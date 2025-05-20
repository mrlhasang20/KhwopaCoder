"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

interface User {
  id: string
  name: string
  email: string
  batch: string
  github: string
  linkedin: string
  points: number
  solved: number
  rank: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for token and user data in localStorage on mount
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log("=== LOGIN PROCESS START ===");
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password,
      });

      console.log("Login response received:", response.data);

      const { access_token, user: userData } = response.data;

      // Store token and user data
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Set the authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      // Update user state
      setUser(userData);

      console.log("Login successful, user state updated");
      
      return userData;
      
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      console.log("=== REGISTRATION PROCESS START ===");
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        email: data.email,
        name: data.name,
        password: data.password,
        batch: data.batch || "2024",
        github: null,
        linkedin: null
      });
      
      console.log("Registration response:", response.data);
      
      const userData = response.data;

      // After successful registration, automatically log in
      console.log("Attempting automatic login after registration");
      const loginResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email: data.email,
        password: data.password
      });

      console.log("Login response:", loginResponse.data);

      const { access_token, user: loginUserData } = loginResponse.data;

      // Store token and user data
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(loginUserData));

      // Set the authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      // Update user state
      setUser(loginUserData);

      console.log("Registration and login successful, redirecting to dashboard");
      
      // // Add a small delay before navigation
      // setTimeout(() => {
      //   router.push("/dashboard");
      // }, 100);
      router.push("/dashboard")  
      
    } catch (error: any) {
      console.error("=== REGISTRATION ERROR ===");
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      console.error("=========================");
      
      if (error.response?.data?.detail) {
        throw new Error(Array.isArray(error.response.data.detail) 
          ? error.response.data.detail[0].msg 
          : error.response.data.detail);
      }
      throw new Error("Registration failed. Please try again.");
    }
  };

  const logout = () => {
    // Clear token and user data
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    
    // Clear authorization header
    delete axios.defaults.headers.common["Authorization"]
    
    // Clear user state
    setUser(null)
    
    // Redirect to login
    router.push("/login")
  }
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
