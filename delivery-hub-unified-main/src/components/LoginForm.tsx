import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, loading, loginWithGoogle } = useAuth();
  const navigate = useNavigate(); // ✅ Move this inside the component

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("https://unified-delivery-manager.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Save to localStorage or context
      // localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("delivery-agent", JSON.stringify(data.user)); // ✅ Correct key
      

      // Redirect to dashboard
      alert("Login successful!");
      console.log("Navigating to /dashboard...");
      navigate("/dashboard"); // ✅ Redirect to dashboard
      navigate("/dashboard"); 
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-delivery-blue">
          Delivery Agent Login
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  className="text-xs text-delivery-teal p-0 h-auto"
                  type="button"
                >
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full mt-6 bg-delivery-teal hover:bg-delivery-blue"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-4">
          <Button
            type="button"
            className="w-full bg-blue-500 hover:bg-red-600 text-white"
            onClick={handleGoogleLogin}
          >
            Login with Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground text-center">
          Demo credentials pre-filled for you
        </div>
        <div className="text-center">
          <span className="text-sm">Not registered?</span>{" "}
          <Link to="/register" className="text-sm text-delivery-teal hover:underline">
            Register here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
