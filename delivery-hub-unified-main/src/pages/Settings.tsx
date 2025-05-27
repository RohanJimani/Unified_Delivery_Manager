import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Settings2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Settings = () => {
  const { agent } = useAuth();
  
  // State for notification preferences
  const [notifications, setNotifications] = useState({
    newDeliveries: true,
    statusUpdates: true,
    paymentAlerts: true,
    promotionalMessages: false,
  });
  
  // State for app preferences
  const [preferences, setPreferences] = useState({
    darkMode: false,
    autoRefresh: true,
    refreshInterval: "30",
    defaultView: "pending",
  });

  // State for password change dialog
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handlePreferenceChange = (key: keyof typeof preferences, value: string | boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handlePasswordChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear any error when user types
    if (passwordError) setPasswordError("");
  };

  const handleSubmitPasswordChange = () => {
    // Validate password
    if (passwordForm.currentPassword !== "password") {
      setPasswordError("Current password is incorrect");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    // In a real app, this would call an API to change the password
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    
    // Reset form and close dialog
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setPasswordDialog(false);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Settings2 className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">App Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue={agent?.email} disabled />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue={agent?.phone} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value="••••••••" disabled />
                  <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setPasswordDialog(true)}>
                    Change Password
                  </Button>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveSettings}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Delivery Alerts</p>
                    <p className="text-sm text-muted-foreground">Receive notifications when new deliveries are available</p>
                  </div>
                  <Switch 
                    checked={notifications.newDeliveries} 
                    onCheckedChange={() => handleNotificationChange('newDeliveries')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Status Updates</p>
                    <p className="text-sm text-muted-foreground">Notifications about changes to your delivery status</p>
                  </div>
                  <Switch 
                    checked={notifications.statusUpdates} 
                    onCheckedChange={() => handleNotificationChange('statusUpdates')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Alerts</p>
                    <p className="text-sm text-muted-foreground">Be notified when you receive payments</p>
                  </div>
                  <Switch 
                    checked={notifications.paymentAlerts} 
                    onCheckedChange={() => handleNotificationChange('paymentAlerts')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Promotional Messages</p>
                    <p className="text-sm text-muted-foreground">Receive updates about promotions and offers</p>
                  </div>
                  <Switch 
                    checked={notifications.promotionalMessages} 
                    onCheckedChange={() => handleNotificationChange('promotionalMessages')}
                  />
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveSettings}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>App Preferences</CardTitle>
                <CardDescription>Customize your app experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                  </div>
                  <Switch 
                    checked={preferences.darkMode} 
                    onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Refresh</p>
                    <p className="text-sm text-muted-foreground">Automatically refresh delivery data</p>
                  </div>
                  <Switch 
                    checked={preferences.autoRefresh} 
                    onCheckedChange={(checked) => handlePreferenceChange('autoRefresh', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                  <Input 
                    id="refreshInterval" 
                    type="number" 
                    value={preferences.refreshInterval} 
                    onChange={(e) => handlePreferenceChange('refreshInterval', e.target.value)}
                    disabled={!preferences.autoRefresh}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultView">Default Dashboard View</Label>
                  <select 
                    id="defaultView"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={preferences.defaultView}
                    onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
                  >
                    <option value="pending">Pending Deliveries</option>
                    <option value="active">Active Deliveries</option>
                  </select>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveSettings}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage how your data is used</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Location Sharing</p>
                    <p className="text-sm text-muted-foreground">Allow the app to track your location for deliveries</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Analytics</p>
                    <p className="text-sm text-muted-foreground">Share anonymous usage data to improve the service</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea 
                    id="feedback" 
                    placeholder="Share your thoughts on our privacy policy..."
                  />
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveSettings}>Save Privacy Settings</Button>
                </div>
                
                <div className="border-t pt-4 mt-6">
                  <h3 className="font-medium mb-2">Data Management</h3>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline">Download My Data</Button>
                    <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      Delete My Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new password.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {passwordError && (
              <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm">
                {passwordError}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSubmitPasswordChange}>
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Settings;