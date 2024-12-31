import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { organizationTypes, sectorsList, userToken } from "@/utils";
import { Spinner } from "@/components/ui/spinner";
import { auth } from "@/utils/apiRoutes";
import { UserData } from "@/utils/types";

const Register = ({
  setUserData,
}: {
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    firstName: "",
    lastName: "",
    organizationName: "",
    organizationType: "",
    jobTitle: "",
    sector: "",
    city: "",
    pinCode: "",
    mobileNo: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setloading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const registerSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    organizationName: z
      .string()
      .min(1, { message: "Organization name is required" }),
    organizationType: z
      .string()
      .min(1, { message: "Organization type is required" }),
    jobTitle: z.string().min(1, { message: "Job title is required" }),
    sector: z.string().min(1, { message: "Sector is required" }),
    city: z.string().min(1, { message: "City is required" }),
    pinCode: z
      .string()
      .regex(/^[0-9]{6}$/, { message: "Pin code must be a 6-digit number" }),
    mobileNo: z.string().regex(/^[0-9]{10}$/, {
      message: "Mobile number must be a 10-digit number",
    }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = registerSchema.safeParse(formData);
    if (!termsAccepted) {
      return toast({
        title: "Action needed",
        description: "Accept the T&C",
      });
    }

    if (!validationResult.success) {
      const formattedErrors: { [key: string]: string } = {};
      validationResult.error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted fields.",
        variant: "destructive",
      });
    } else {
      setErrors({});
      try {
        setloading(true);
        // console.log(formData);
        const response = await axios.post(
          `${auth}/register`,
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            mobile: formData.mobileNo, // Make sure this matches
            email: formData.email,
            password: formData.password,
            country: formData.country || "", // Include country if needed
            state: formData.state || "", // Include state if needed
            city: formData.city,
            pincode: formData.pinCode, // Make sure this matches
            orgLogo: formData.organizationLogo || "",
            orgName: formData.organizationName || "",
            orgType: formData.organizationType || "",
            orgEmail: formData.organizationEmail || "",
            orgContact: formData.organizationContact || "",
            jobTitle: formData.jobTitle || "",
            orgLocation: formData.organizationLocation || "",
            username: formData.username || "",
            linkedIn: formData.linkedIn || "",
            facebook: formData.facebook || "",
            twitter: formData.twitter || "",
            avatar: formData.avatar || "",
          },
          { withCredentials: true }
        );

        if (response.status === 201) {
          toast({
            title: "Success",
            description: "Registration successful!",
          });
          setUserData(response.data.data);
          localStorage.setItem(userToken, "true");
          navigate("/");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(
            "Error logging in:",
            error.response?.data?.message || error.message
          );
          toast({
            title: "Something went wrong",
            description: error.response?.data?.message || "An error occurred.",
            variant: "destructive",
          });
        } else {
          console.error("Error logging in:", error);
          toast({
            title: "Something went wrong",
            description: "Try again later.",
            variant: "destructive",
          });
        }
      } finally {
        setloading(false);
      }
    }
  };

  const handleTermsChange = (checked: boolean) => {
    setTermsAccepted(checked);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* First Name and Last Name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Organization Name and Type */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  placeholder="Organization Name"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                />
                {errors.organizationName && (
                  <p className="text-red-500 text-sm">
                    {errors.organizationName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="organizationType">Organization Type</Label>
                <Select
                  name="organizationType"
                  value={formData.organizationType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, organizationType: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Organization Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.organizationType && (
                  <p className="text-red-500 text-sm">
                    {errors.organizationType}
                  </p>
                )}
              </div>
            </div>

            {/* Job Title and Sector */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="Job Title"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                />
                {errors.jobTitle && (
                  <p className="text-red-500 text-sm">{errors.jobTitle}</p>
                )}
              </div>
              <div>
                <Label htmlFor="sector">Sector</Label>
                <Select
                  name="sector"
                  value={formData.sector}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sector: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectorsList.map((sector, index) => (
                      <SelectItem key={index} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sector && (
                  <p className="text-red-500 text-sm">{errors.sector}</p>
                )}
              </div>
            </div>

            {/* City and Pin Code */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">{errors.city}</p>
                )}
              </div>
              <div>
                <Label htmlFor="pinCode">Pin Code</Label>
                <Input
                  type="text"
                  id="pinCode"
                  name="pinCode"
                  placeholder="Pin Code"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required
                />
                {errors.pinCode && (
                  <p className="text-red-500 text-sm">{errors.pinCode}</p>
                )}
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <Label htmlFor="mobileNo">Mobile No.</Label>
              <Input
                type="text"
                id="mobileNo"
                name="mobileNo"
                placeholder="Mobile No."
                value={formData.mobileNo}
                onChange={handleChange}
                required
              />
              {errors.mobileNo && (
                <p className="text-red-500 text-sm">{errors.mobileNo}</p>
              )}
            </div>

            {/* Email and Password */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={handleTermsChange}
                required
              />
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                By clicking you agree to accept terms & conditions that you are
                aware of our genuine user policy!
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner className="mr-2 border-white" />
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </CardContent>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/home" className="text-primary  font-semibold">
            Login
          </Link>
        </p>
        <CardFooter />
      </Card>
    </div>
  );
};

export default Register;
