/**
 * Dashboard Page
 * 
 * Main dashboard with statistics, recent activities, and quick actions.
 * Displays overview of projects, meetings, and club activities.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  ArrowRight,
  Bell,
} from 'lucide-react';
import { PageAnimator, StaggerContainer, StaggerItem } from '../components/shared/PageAnimator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { UserAvatar } from '../components/ui/Avatar';
import { StatsCardSkeleton, CardSkeleton } from '../components/shared/SkeletonLoader';
import { getDashboardStats, getRecentActivities, getAnnouncements } from '../lib/api';
import { formatDate, formatDateTime } from '../lib/utils';
import { ROUTES } from '../lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for chart
  const chartData = [
    { name: 'Jan', projects: 4 },
    { name: 'Feb', projects: 6 },
    { name: 'Mar', projects: 8 },
    { name: 'Apr', projects: 7 },
    { name: 'May', projects: 9 },
    { name: 'Jun', projects: 12 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsData, activitiesData, announcementsData] = await Promise.all([
          getDashboardStats(),
          getRecentActivities(5),
          getAnnouncements(),
        ]);
        
        setStats(statsData);
        setActivities(activitiesData);
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set mock data on error
        setStats({
          totalProjects: 24,
          activeProjects: 12,
          totalMembers: 48,
          upcomingMeetings: 3,
        });
        setActivities([]);
        setAnnouncements([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Active Projects',
      value: stats?.activeProjects || 0,
      icon: FolderKanban,
      description: `${stats?.totalProjects || 0} total`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Club Members',
      value: stats?.totalMembers || 0,
      icon: Users,
      description: '+5 this month',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Upcoming Meetings',
      value: stats?.upcomingMeetings || 0,
      icon: Calendar,
      description: 'This week',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Growth Rate',
      value: '+23%',
      icon: TrendingUp,
      description: 'vs last month',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <PageAnimator>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your club.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </p>
                          <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {stat.description}
                          </p>
                        </div>
                        <div className={`${stat.bgColor} p-3 rounded-lg`}>
                          <Icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Project Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Project Activity</CardTitle>
            <CardDescription>Number of projects over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="projects"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Announcements
            </CardTitle>
            <CardDescription>Recent club announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No announcements yet
                </p>
              ) : (
                announcements.slice(0, 3).map((announcement) => (
                  <div key={announcement.id} className="flex gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{announcement.title}</h4>
                        <Badge variant={announcement.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {announcement.content}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to={ROUTES.PROJECTS}>
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <CardSkeleton />
          ) : activities.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No recent activities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <UserAvatar
                    src={activity.user?.avatar}
                    name={activity.user?.name || 'Unknown User'}
                    className="h-10 w-10"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user?.name || 'Someone'}</span>
                      {' '}
                      <span className="text-muted-foreground">{activity.action}</span>
                      {' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(activity.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageAnimator>
  );
}