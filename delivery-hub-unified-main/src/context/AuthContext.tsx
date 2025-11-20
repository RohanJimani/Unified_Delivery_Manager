import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
// import firebase from "firebase/app"; // Ensure Firebase is properly installed and configured
// import "firebase/auth"; // Import Firebase Auth
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase"; // adjust if using @/firebase




interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string; // ✅ Add this line
  rating: number;
  activeDeliveries: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  agent: Agent | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>; // Add Google login method
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for session data
    const storedAgent = localStorage.getItem("delivery-agent");
    if (storedAgent) {
      try {
        setAgent(JSON.parse(storedAgent));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse agent data:", error);
        localStorage.removeItem("delivery-agent");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
  setLoading(true);
  try {
    // Make an API call to the backend login endpoint
    const response = await fetch("https://unified-delivery-manager.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const agent = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || "",
        photo: data.user.photo || "",
        rating: data.user.rating || 0,
        activeDeliveries: data.user.activeDeliveries || 0,
      };

      setAgent(agent);
      setIsAuthenticated(true);
      localStorage.setItem("delivery-agent", JSON.stringify(agent));

      console.log("isAuthenticated after login:", true); // Debugging
      console.log("Agent after login:", agent); // Debugging


      toast({
        title: "Login successful",
        description: `Welcome back, ${agent.name}!`,
        variant: "default",
      });
      navigate("/dashboard");
      navigate("/dashboard");
    } else {
      toast({
        title: "Login failed",
        description: data.message || "Invalid email or password",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Login failed",
      description: "An error occurred during login",
      variant: "destructive",
    });
    console.error("Login error:", error);
  } finally {
    setLoading(false);
  }
};

  const loginWithGoogle = async () => {
  setLoading(true);
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (user) {
      const googleAgent = {
        id: user.uid,
        name: user.displayName || "Google User",
        email: user.email || "",
        phone: user.phoneNumber || "",
        photo: user.photoURL || "",
        rating: 0,
        activeDeliveries: 0,
      };

      setAgent(googleAgent);
      setIsAuthenticated(true);
      localStorage.setItem("delivery-agent", JSON.stringify(googleAgent));

      toast({
        title: "Google Login Successful",
        description: `Welcome, ${googleAgent.name}!`,
        variant: "default",
      });

      navigate("/dashboard");
    }
  } catch (error) {
    toast({
      title: "Google Login Failed",
      description: "An error occurred during Google login",
      variant: "destructive",
    });
    console.error("Google login error:", error);
  } finally {
    setLoading(false);
  }
};


  const logout = () => {
    setAgent(null);
    setIsAuthenticated(false);
    localStorage.removeItem("delivery-agent");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
    navigate("/login");
  };

  const value = {
    isAuthenticated,
    agent,
    login,
    loginWithGoogle, // Add Google login to the context value
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
