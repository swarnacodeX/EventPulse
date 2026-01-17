// src/app/signup/page.js
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCredentials, clearCredentials } from "../../lib/redux/authSlice";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const router=useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const organizerNotice="If you want to register as an organizer you need to sign up by clicking on Organizer tab, you wont have organizer access immediately, our team will reach out to you for verification purposes, after verification you will get a token which you can used to login as a organizer."
  
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

    if (formData.password !== formData.confirmPassword ) {
      alert("Passwords don't match!");
      return;
    }

    if(formData.role==""){
      alert("Please select User or Organizer");
      return;
    }
    const checklist = getPasswordChecklist(formData.password);
const isPasswordValid = Object.values(checklist).every(Boolean);
if (!isPasswordValid) {
  alert("Password does not meet all requirements");
  return;}
    console.log("Signup data:", formData);
    const response = await axios.post("http://localhost:8081/api/auth/signup", {
      username: formData.name,
      email: formData.email,
      role:formData.role,
      password: formData.password,
    });
    if (response.headers["success"] == "true" && response.data.role!="ORGANIZER") {
          dispatch(
            setCredentials({
              email: response.data.email,
              password: response.data.password,
              isLoggedIn: true,
              role:response.data.role
            })
          );
          router.push("/");
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("email", formData.email);
          sessionStorage.setItem("access-token", response.headers["access-token"]);
          sessionStorage.setItem("refresh-token", response.headers["refresh-token"]);
  }
  else if(response.headers["success"] == "true" && response.data.role=="ORGANIZER"){
   dispatch(
            setCredentials({
              email: response.data.email,
              password: response.data.password,
              isLoggedIn: false,
              role:response.data.role
            })
          );
          router.push("/");
          localStorage.setItem("role", response.headers["user-role"]);
          localStorage.setItem("email", formData.email);
          sessionStorage.setItem("access-token", response.headers["access-token"]);
          sessionStorage.setItem("refresh-token", response.headers["refresh-token"]);
  }
  }
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const isStrongPassword = (password) => {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
  return regex.test(password);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-4 space-y-4">

      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            Join us and discover amazing events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex space-x-4 justify-center mb-2">
                <Button
                  type="button"
                  variant={formData.role === "USER" ? "default" : "outline"}
                  className={`w-1/2 ${
                    formData.role === "USER"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800/50 text-slate-300"
                  }`}
                  onClick={() => setFormData({ ...formData, role: "USER" })}
                >
                  User
                </Button>

                <Button
                  type="button"
                  variant={
                    formData.role === "ORGANIZER" ? "default" : "outline"
                  }
                  className={`w-1/2 ${
                    formData.role === "ORGANIZER"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800/50 text-slate-300"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, role: "ORGANIZER" })
                  }
                >
                  Organizer
                </Button>
              </div>
            </div>

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

                {formData.password && (
                  <PasswordChecklist password={formData.password} />
                )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {(formData.role === "" || formData.role === "USER") && (
                <div className="mt-4 flex justify-center">
                  <Button
                    type="button"
                    onClick={() => console.log("Google OAuth clicked")}
                    className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-md shadow  hover:bg-black hover:text-white"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span>Continue with Google</span>
                  </Button>
                  
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Create Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
<div className="mt-4  mx-auto p-3 bg-yellow-900/40 text-yellow-200 border border-yellow-700 rounded-md text-sm">
        {organizerNotice}
      </div>

    </div>
  );
}


