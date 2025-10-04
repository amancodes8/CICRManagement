/**
 * Admin Page
 * 
 * Administrative dashboard for club management.
 * Only accessible to users with admin role.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Shield,
  Trash2,
  Edit,
  Mail,
  Search,
  UserPlus,
} from 'lucide-react';
import { PageAnimator } from '../components/shared/PageAnimator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/Dialog';
import { Select } from '../components/ui/Select';
import { UserAvatar } from '../components/ui/Avatar';
import { TableSkeleton } from '../components/shared/SkeletonLoader';
import { getUsers, updateUser, deleteUser } from '../lib/api';
import { formatDate } from '../lib/utils';
import { USER_ROLES } from '../lib/types';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedRole, setEditedRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Set mock data on error
      setUsers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: USER_ROLES.ADMIN,
          department: 'Software',
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: USER_ROLES.LEAD,
          department: 'Mechanical',
          createdAt: '2024-02-01',
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          role: USER_ROLES.MEMBER,
          department: 'Electronics',
          createdAt: '2024-02-15',
        },
        {
          id: '4',
          name: 'Alice Williams',
          email: 'alice.williams@example.com',
          role: USER_ROLES.MEMBER,
          department: 'Software',
          createdAt: '2024-03-01',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditedRole(user.role);
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      await updateUser(selectedUser.id, { role: editedRole });
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, role: editedRole } : u
        )
      );
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'destructive';
      case USER_ROLES.LEAD:
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <PageAnimator>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="h-10 w-10 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage club members and permissions
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Members
                  </p>
                  <h3 className="text-3xl font-bold mt-2">{users.length}</h3>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admins</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {users.filter((u) => u.role === USER_ROLES.ADMIN).length}
                  </h3>
                </div>
                <div className="bg-red-500/10 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Project Leads
                  </p>
                  <h3 className="text-3xl font-bold mt-2">
                    {users.filter((u) => u.role === USER_ROLES.LEAD).length}
                  </h3>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Club Members</CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </div>
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No users found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <UserAvatar src={user.avatar} name={user.name} />
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.department || 'N/A'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role and permissions for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <UserAvatar
                src={selectedUser?.avatar}
                name={selectedUser?.name}
                className="h-16 w-16"
              />
              <div>
                <h3 className="font-semibold">{selectedUser?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedUser?.email}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                options={[
                  { value: USER_ROLES.ADMIN, label: 'Admin' },
                  { value: USER_ROLES.LEAD, label: 'Project Lead' },
                  { value: USER_ROLES.MEMBER, label: 'Member' },
                ]}
                value={editedRole}
                onChange={setEditedRole}
              />
              <p className="text-xs text-muted-foreground">
                {editedRole === USER_ROLES.ADMIN &&
                  'Full access to all features and user management'}
                {editedRole === USER_ROLES.LEAD &&
                  'Can manage projects and meetings'}
                {editedRole === USER_ROLES.MEMBER &&
                  'Basic access to view and participate'}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveUser} className="flex-1">
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageAnimator>
  );
}