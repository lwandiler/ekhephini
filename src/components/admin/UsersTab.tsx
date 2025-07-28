
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, UserPlus, UserCheck, UserX } from 'lucide-react';

// Define user types
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'editor' | 'user';
  lastLogin: string;
  status: 'active' | 'inactive' | 'pending';
}

// Mock data for users - in a real app this would come from your backend
const initialUsers: UserData[] = [
  { 
    id: '1', 
    name: 'Administrator', 
    email: 'admin@clickradio.com',
    role: 'admin',
    lastLogin: '2023-05-03T14:32:00Z',
    status: 'active'
  },
  { 
    id: '2', 
    name: 'Station Manager', 
    email: 'manager@clickradio.com',
    role: 'manager',
    lastLogin: '2023-05-02T09:15:22Z',
    status: 'active'
  },
  { 
    id: '3', 
    name: 'Content Editor', 
    email: 'editor@clickradio.com',
    role: 'editor',
    lastLogin: '2023-04-28T16:45:12Z',
    status: 'active'
  },
  { 
    id: '4', 
    name: 'Jane Doe', 
    email: 'jane@example.com',
    role: 'user',
    lastLogin: '2023-04-15T11:22:36Z',
    status: 'inactive'
  },
  { 
    id: '5', 
    name: 'New User', 
    email: 'newuser@example.com',
    role: 'user',
    lastLogin: '',
    status: 'pending'
  }
];

const UsersTab = () => {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'manager' | 'editor' | 'user',
    password: ''
  });
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const newId = (Math.max(...users.map(u => parseInt(u.id))) + 1).toString();
    
    setUsers([...users, {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      lastLogin: '',
      status: 'pending'
    }]);
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been added as a ${newUser.role}.`,
    });
    
    // Reset form and close dialog
    setNewUser({
      name: '',
      email: '',
      role: 'user',
      password: ''
    });
    setIsAddUserOpen(false);
  };

  const handleEditUser = () => {
    if (currentUser) {
      setUsers(users.map(user => 
        user.id === currentUser.id ? currentUser : user
      ));
      
      toast({
        title: "User Updated",
        description: `${currentUser.name}'s details have been updated.`,
      });
      
      setIsEditUserOpen(false);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
      
      toast({
        title: "User Deleted",
        description: "The user has been removed from the system.",
      });
    }
  };

  const handleStatusChange = (id: string, status: 'active' | 'inactive') => {
    setUsers(users.map(user => 
      user.id === id ? {...user, status} : user
    ));
    
    toast({
      title: "Status Updated",
      description: `User status has been changed to ${status}.`,
    });
  };

  const openEditDialog = (user: UserData) => {
    setCurrentUser(user);
    setIsEditUserOpen(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'editor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button 
          onClick={() => setIsAddUserOpen(true)}
          className="bg-radio-accent hover:bg-radio-accent/80"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      
      <div className="flex justify-between mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader className="bg-gray-50 py-4">
          <CardTitle className="text-lg">Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {user.status === 'active' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'inactive')}
                          className="h-8 px-2 text-amber-600 border-amber-600 hover:bg-amber-50"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'active')}
                          className="h-8 px-2 text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                        className="h-8 px-2"
                      >
                        Edit
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="h-8 px-2 text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-green-500">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value: 'admin' | 'manager' | 'editor' | 'user') => setNewUser({
                  ...newUser, 
                  role: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} className="bg-radio-accent hover:bg-radio-accent/80">
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-green-500">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={currentUser.role} 
                  onValueChange={(value) => setCurrentUser({
                    ...currentUser, 
                    role: value as 'admin' | 'manager' | 'editor' | 'user'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={currentUser.status} 
                  onValueChange={(value) => setCurrentUser({
                    ...currentUser, 
                    status: value as 'active' | 'inactive' | 'pending'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reset-password">Reset Password (leave blank to keep unchanged)</Label>
                <Input 
                  id="reset-password" 
                  type="password"
                  placeholder="New password"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} className="bg-radio-accent hover:bg-radio-accent/80">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersTab;
