
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";



const Profile = () => {
  const { agent, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Get initials for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const generateAgentId = () => {
  const prefix = "AGENT";
  const random = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  return `${prefix}-${random}`;
};

const agentId = agent?.id || generateAgentId();


  const handleSaveChanges = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
        
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  {/* <AvatarImage src={agent?.avatar} alt={agent?.name} /> */}
                  <AvatarImage src={`http://localhost:5000/uploads/${agent?.photo}`} alt={agent?.name} />
                  <AvatarFallback className="text-3xl">{agent?.name ? getInitials(agent.name) : "??"}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-medium">{agent?.name}</h3>
                <p className="text-sm text-muted-foreground">Delivery Agent</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-muted-foreground mr-1">Rating:</span>
                  <span className="font-medium">{agent?.rating}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-delivery-orange ml-0.5"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={agent?.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={agent?.email} disabled />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" defaultValue={agent?.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="id">Agent ID</Label>
                      {/* <Input id="id" defaultValue={agent?.id} disabled /> */}
                      <Input id="id" defaultValue={agentId} disabled />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;