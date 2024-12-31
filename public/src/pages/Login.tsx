import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { auth } from "@/utils/apiRoutes";
import { useToast } from "@/hooks/use-toast";
import { userToken } from "@/utils";
import { UserData } from "@/utils/types";

// Spinner Component
const Spinner = ({ className }: { className?: string }) => (
  <div
    className={`h-5 w-5 border-2 border-t-transparent rounded-full animate-spin ${className}`}
  />
);

const signInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function SignIn({
  setUserData,
}: {
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { toast } = useToast();
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Clear errors for the specific field
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const result = signInSchema.safeParse(formValues);
    if (!result.success) {
      const validationErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          validationErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(validationErrors as { email: string; password: string });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${auth}/login`,
        {
          email: formValues.email,
          password: formValues.password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.setItem(userToken, "true");
        toast({
          title: "Welcome In",
        });
        setUserData(response.data.data);
        navigate("/");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: error.response?.data?.message,
        });
        console.error(
          "Error logging in:",
          error.response?.data?.message || error.message
        );
      } else {
        console.error("Error logging in:", error);
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try again later",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-muted">
      <Card className="w-full max-w-md p-6 space-y-4">
        <CardHeader>
          <CardTitle className="text-xl text-center font-semibold">
            Welcome to Squirrel IP
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formValues.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>
          <Link
            to="/forgot-password"
            className="text-sm text-primary underline"
          >
            Forgot Password?
          </Link>
          <Button
            type="submit"
            className="w-full flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="mr-2 border-white" /> Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-primary font-semibold">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default SignIn;
