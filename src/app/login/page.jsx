// src/app/login/page.js
"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import { setCredentials, clearCredentials } from "../../lib/redux/authSlice";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router=useRouter();
  const { emailState, passwordStae, isLoggedIn } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Login data:", formData);

  try {
    const response = await axios.post("http://localhost:8081/api/auth/login", {
      email: formData.email,
      password: formData.password,
    });
    if (response.headers["success"] == "true") {
      dispatch(
        setCredentials({
          email: response.data.email,
          password: response.data.password,
          isLoggedIn: true,
          role:response.data.role
        })
      );

      router.push("/");

      localStorage.setItem("email", formData.email);
      sessionStorage.setItem("access-token", response.headers["access-token"]);
      sessionStorage.setItem("refresh-token", response.headers["refresh-token"]);
    } else {
      console.log("Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
  }
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
