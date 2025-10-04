/**
 * Projects Page
 * 
 * Displays all club projects with filtering and creation capabilities.
 * Features grid/list view toggle and project management.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  Clock,
  CheckCircle,
  Pause,
  Users,
} from 'lucide-react';
import { PageAnimator, StaggerContainer, StaggerItem } from '../components/shared/PageAnimator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/Dialog';
import { UserAvatar } from '../components/ui/Avatar';
import { CardSkeleton } from '../components/shared/SkeletonLoader';
import { getProjects, createProject } from '../lib/api';
import { formatDate } from '../lib/utils';
import { PROJECT_STATUS } from '../lib/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // New project form state
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: PROJECT_STATUS.ACTIVE,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      // Set mock data on error
      setProjects([
        {
          id: '1',
          name: 'Autonomous Robot',
          description: 'Building a self-navigating robot using LIDAR and camera sensors',
          status: PROJECT_STATUS.ACTIVE,
          progress: 75,
          members: ['user1', 'user2', 'user3'],
          startDate: '2024-01-15',
          tags: ['robotics', 'ai', 'sensors'],
        },
        {
          id: '2',
          name: 'Drone Delivery System',
          description: 'Developing a drone-based package delivery prototype',
          status: PROJECT_STATUS.ACTIVE,
          progress: 45,
          members: ['user4', 'user5'],
          startDate: '2024-02-01',
          tags: ['drones', 'automation'],
        },
        {
          id: '3',
          name: 'Smart Home IoT',
          description: 'IoT-based home automation system with voice control',
          status: PROJECT_STATUS.COMPLETED,
          progress: 100,
          members: ['user6', 'user7', 'user8', 'user9'],
          startDate: '2023-11-01',
          endDate: '2024-03-15',
          tags: ['iot', 'smart-home'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      setIsCreating(true);
      const created = await createProject(newProject);
      setProjects([created, ...projects]);
      setIsDialogOpen(false);
      setNewProject({ name: '', description: '', status: PROJECT_STATUS.ACTIVE });
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case PROJECT_STATUS.ACTIVE:
        return <Clock className="h-4 w-4" />;
      case PROJECT_STATUS.COMPLETED:
        return <CheckCircle className="h-4 w-4" />;
      case PROJECT_STATUS.ON_HOLD:
        return <Pause className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case PROJECT_STATUS.ACTIVE:
        return 'default';
      case PROJECT_STATUS.COMPLETED:
        return 'success';
      case PROJECT_STATUS.ON_HOLD:
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <PageAnimator>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all club projects
          </p>
        </div>

        {/* Create Project Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to your club's portfolio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  placeholder="Enter project name"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  placeholder="Describe your project..."
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  options={[
                    { value: PROJECT_STATUS.ACTIVE, label: 'Active' },
                    { value: PROJECT_STATUS.COMPLETED, label: 'Completed' },
                    { value: PROJECT_STATUS.ON_HOLD, label: 'On Hold' },
                  ]}
                  value={newProject.status}
                  onChange={(value) =>
                    setNewProject({ ...newProject, status: value })
                  }
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateProject}
                  isLoading={isCreating}
                  className="flex-1"
                >
                  Create Project
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: PROJECT_STATUS.ACTIVE, label: 'Active' },
                { value: PROJECT_STATUS.COMPLETED, label: 'Completed' },
                { value: PROJECT_STATUS.ON_HOLD, label: 'On Hold' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full md:w-48"
            />

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid/List */}
      {isLoading ? (
        <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-muted-foreground">No projects found</p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <StaggerItem key={project.id}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <Badge variant={getStatusColor(project.status)}>
                        {getStatusIcon(project.status)}
                        <span className="ml-1">{project.status}</span>
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Progress Bar */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    {project.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Members and Date */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex -space-x-2">
                        {project.members?.slice(0, 3).map((member, index) => (
                          <UserAvatar
                            key={member}
                            name={`User ${index + 1}`}
                            className="h-8 w-8 border-2 border-background"
                          />
                        ))}
                        {project.members?.length > 3 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                            +{project.members.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(project.startDate)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <Badge variant={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {project.members?.length || 0} members
                        </span>
                        <span className="text-muted-foreground">
                          {formatDate(project.startDate)}
                        </span>
                        <span className="font-medium">{project.progress}% complete</span>
                      </div>
                    </div>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </PageAnimator>
  );
}