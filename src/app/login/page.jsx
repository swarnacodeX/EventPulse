// src/app/login/page.js
"use client";

import { useState } from "react";
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
import { Eye, EyeOff, Mail, Lock, KeyRound, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../lib/redux/authSlice";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user"); // user | organizer
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    organizerToken: "",
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const resetForm = () => {
    setFormData({ email: "", password: "", organizerToken: "" });
    setShowPassword(false);
  };

  const handleRoleSwitch = (newRole) => {
    if (newRole !== role) {
      setRole(newRole);
      resetForm();
    }
  };
  const passwordRules = {
    minLength: (pwd) => pwd.length >= 8,
    upperCase: (pwd) => /[A-Z]/.test(pwd),
    lowerCase: (pwd) => /[a-z]/.test(pwd),
    number: (pwd) => /[0-9]/.test(pwd),
    specialChar: (pwd) => /[^A-Za-z0-9]/.test(pwd),
  };

  const getPasswordChecklist = (password) => ({
    minLength: passwordRules.minLength(password),
    upperCase: passwordRules.upperCase(password),
    lowerCase: passwordRules.lowerCase(password),
    number: passwordRules.number(password),
    specialChar: passwordRules.specialChar(password),
  });
  const PasswordChecklist = ({ password }) => {
    const checklist = getPasswordChecklist(password);

    const Item = ({ isValid, label }) => (
      <li className="flex items-center gap-2 text-sm">
        <span className={isValid ? "text-green-400" : "text-red-400"}>
          {isValid ? "✔" : "✖"}
        </span>
        <span className={isValid ? "text-green-300" : "text-slate-400"}>
          {label}
        </span>
      </li>
    );

    return (
      <ul className="mt-2 space-y-1">
        <Item isValid={checklist.minLength} label="At least 8 characters" />
        <Item isValid={checklist.upperCase} label="One uppercase letter" />
        <Item isValid={checklist.lowerCase} label="One lowercase letter" />
        <Item isValid={checklist.number} label="One number" />
        <Item isValid={checklist.specialChar} label="One special character" />
      </ul>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload =
      role === "organizer"
        ? {
            email: formData.email,
            password: formData.password,
            organizerToken: formData.organizerToken,
          }
        : {
            email: formData.email,
            password: formData.password,
          };
          const checklist = getPasswordChecklist(formData.password);
const isPasswordValid = Object.values(checklist).every(Boolean);

if (!isPasswordValid) {
  alert("Password does not meet all requirements");
  return;
}

    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        payload
      );
      console.log(response);
      if (response.headers["success"] === "true") {
        dispatch(
          setCredentials({
            email: response.data.email,
            password: response.data.password,
            isLoggedIn: true,
            role: response.data.role,
          })
        );

        router.push("/");

        localStorage.setItem("email", formData.email);
        localStorage.setItem("role", response.data.role);
        sessionStorage.setItem(
          "access-token",
          response.headers["access-token"]
        );
        sessionStorage.setItem(
          "refresh-token",
          response.headers["refresh-token"]
        );
        localStorage.setItem("User-id", response.data.userID);
      } else {
        console.log("Login failed");
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-md overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Sliding Toggle */}
          <div className="flex justify-center mb-6">
            <div className="relative w-64 h-10 bg-slate-800/50 rounded-full flex items-center">
              <div
                className={`absolute top-1 h-8 w-1/2 rounded-full bg-blue-600 transition-all duration-300 ${
                  role === "user" ? "left-1" : "left-32"
                }`}
              ></div>
              <button
                type="button"
                className={`flex-1 z-10 text-sm ${
                  role === "user" ? "text-white" : "text-slate-300"
                }`}
                onClick={() => handleRoleSwitch("user")}
              >
                User
              </button>
              <button
                type="button"
                className={`flex-1 z-10 text-sm ${
                  role === "organizer" ? "text-white" : "text-slate-300"
                }`}
                onClick={() => handleRoleSwitch("organizer")}
              >
                Organizer
              </button>
            </div>
          </div>

          {/* Sliding Forms */}
          <div className="w-full overflow-hidden">
            <div
              className={`flex w-[200%] transition-transform duration-500 ${
                role === "user" ? "translate-x-0" : "-translate-x-1/2"
              }`}
            >
              {/* User Form */}
              <form
                onSubmit={handleSubmit}
                className="w-1/2 flex-shrink-0 space-y-4 px-4"
              >
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

                {formData.password && (
                  <PasswordChecklist password={formData.password} />
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              {/* Organizer Form */}
              <form
                onSubmit={handleSubmit}
                className="w-1/2 flex-shrink-0 space-y-4 px-4"
              >
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
    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
  </button>
</div>

{formData.password && (
  <PasswordChecklist password={formData.password} />
)}

                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    name="organizerToken"
                    type="text"
                    placeholder="Organizer Token"
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                    value={formData.organizerToken}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>
          </div>

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
