/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Check, User } from "lucide-react";
import { orgTypes } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { z } from "zod";
import { UserData } from "@/utils/types";
import { Spinner } from "@/components/ui/spinner";
import { profileRoute } from "@/utils/apiRoutes";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

// Constants for validation
const PHONE_REGEX = /^[0-9]{10}$/;
const PINCODE_REGEX = /^[0-9]{6}$/;
// const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
const profileSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50),
  mobile: z.string().regex(PHONE_REGEX, "Invalid phone number format"),
  email: z.string().email("Invalid email format"),
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(PINCODE_REGEX, "Invalid pincode format"),

  // Organization Information
  orgName: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(100),
  orgType: z.string().min(2, "Organization type is required"),
  orgEmail: z.string().email("Invalid organization email format"),
  orgContact: z
    .string()
    .regex(PHONE_REGEX, "Invalid organization contact number"),
  jobTitle: z.string().min(2, "Job title is required").max(50),
  orgLocation: z.string().min(2, "Organization location is required"),

  // Social Media and Username
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  linkedIn: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),

  // File uploads
  avatar: z.string().optional(),
  orgLogo: z.string().optional(),
});

// .url()
const EditProfile = ({
  userData,
  setUserData,
}: {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    orgName: "",
    orgType: "",
    orgEmail: "",
    orgContact: "",
    jobTitle: "",
    orgLocation: "",
    username: "",
    linkedIn: "",
    facebook: "",
    twitter: "",
    avatar: "",
    orgLogo: "",
  });
  useEffect(() => {
    const user = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobile: userData.mobile,
      email: userData.email,
      country: userData.country,
      state: userData.state,
      city: userData.city,
      pincode: userData.pincode,
      orgName: userData.orgName,
      orgType: userData.orgType,
      orgEmail: userData.orgEmail,
      orgContact: userData.orgContact,
      jobTitle: userData.jobTitle,
      orgLocation: userData.orgLocation,
      username: userData.username,
      linkedIn: userData.linkedIn,
      facebook: userData.facebook,
      twitter: userData.twitter,
      avatar: userData.avatar,
      orgLogo: userData.orgLogo,
    };
    setFormData(user as UserData);
  }, [userData]);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    orgName: "",
    orgType: "",
    orgEmail: "",
    orgContact: "",
    jobTitle: "",
    orgLocation: "",
    username: "",
    linkedIn: "",
    facebook: "",
    twitter: "",
    avatar: "",
    orgLogo: "",
  });

  const [avatar, setavatar] = useState();
  const [orgLogo, setOrgLogo] = useState();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: any, name: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const validateFormData = () => {
    try {
      profileSchema.parse(formData);

      setErrors({});
      return true; // Form is valid
    } catch (error: any) {
      const errorDetails = error.errors.reduce(
        (acc: any, { path, message }: any) => {
          acc[path[0]] = message;
          return acc;
        },
        {}
      );
      setErrors(errorDetails);
      return false; // Form is invalid
    }
  };

  const handleAvatarUpload = useCallback(
    (event: any) => {
      const file = event.target.files?.[0];
      setavatar(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData({ ...formData, avatar: e.target?.result as string });
        };
        reader.readAsDataURL(file);
      }
    },
    [handleChange]
  );

  const handleSubmit = async () => {
    const isValid = validateFormData();
    if (!isValid) {
      return;
    }
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "avatar" && key !== "orgLogo") {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (avatar) {
        formDataToSend.append("avatar", avatar);
      } else {
        formDataToSend.append("avatar", formData["avatar"]);
      }

      // Add `orgLogo` file if available
      if (orgLogo) {
        formDataToSend.append("orgLogo", orgLogo);
      } else {
        formDataToSend.append("orgLogo", formData["orgLogo"]);
      }

      // Send request to backend
      const response = await axios.put(
        `${profileRoute}/update-profile`,
        formDataToSend,
        {
          withCredentials: true, // Include cookies
          headers: {
            "Content-Type": "multipart/form-data", // Ensure correct content type
          },
        }
      );

      // Handle success response
      if (response.data.success) {
        setUserData(response.data.data); // Update user data in state
        toast({
          title: "Success",
          description: "Profile update successfull !",
        });
        setCurrentStep(4); // Redirect to profile page
      } else {
        toast({
          title: "Something went wrong",
          description: response.data.message || "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
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
      setLoading(false); // Stop loading indicator
    }
  };

  const StepIndicator = () => (
    <div className="flex justify-center gap-2 mb-6">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`w-8 h-8 rounded-full flex items-center justify-center
            ${
              currentStep >= step
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
        >
          {currentStep > step ? <Check size={16} /> : step}
        </div>
      ))}
    </div>
  );

  const PersonalInfo = () => (
    <>
      <div className="space-y-8">
        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar>
              <AvatarImage
                className="w-24 h-24 rounded-full"
                src={formData.avatar}
                alt="Profile"
              />
              <AvatarFallback className="bg-primary/10">
                <User className="w-12 h-12 text-primary/60" />
              </AvatarFallback>
            </Avatar>
            <Label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-1 rounded-full bg-primary hover:bg-primary/90 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-white" />
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </Label>
          </div>
          <div className="text-center space-y-1">
            <h3 className="font-medium">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">
              Upload a profile picture or continue without one
            </p>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <span className="text-red-500">{errors.firstName}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <span className="text-red-500">{errors.lastName}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Contact Number</Label>
            <Input
              id="mobile"
              name="mobile"
              placeholder="Contact Number"
              value={formData.mobile}
              onChange={handleChange}
            />
            {errors.mobile && (
              <span className="text-red-500">{errors.mobile} </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
            />
            {errors.country && (
              <span className="text-red-500">{errors.country} </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            />
            {errors.state && (
              <span className="text-red-500">{errors.state} </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />
            {errors.city && (
              <span className="text-red-500">{errors.city} </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
            {errors.pincode && (
              <span className="text-red-500">{errors.pincode} </span>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const OrganizationInfo = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="orgName">Organization Name</Label>
          <Input
            id="orgName"
            name="orgName"
            placeholder="Organization Name"
            value={formData.orgName}
            onChange={handleChange}
          />
          {errors.orgName && (
            <span className="text-red-500">{errors.orgName}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="orgType">Organization Type</Label>
          <Select
            name="orgType"
            value={formData.orgType}
            onValueChange={(value) => handleSelectChange(value, "orgType")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              {orgTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.orgType && (
            <span className="text-red-500">{errors.orgType}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="orgEmail">Organization Email</Label>
          <Input
            id="orgEmail"
            name="orgEmail"
            type="email"
            placeholder="Organization Email"
            value={formData.orgEmail}
            onChange={handleChange}
          />{" "}
          {errors.orgEmail && (
            <span className="text-red-500">{errors.orgEmail}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="orgContact">Organization Contact</Label>
          <Input
            id="orgContact"
            name="orgContact"
            placeholder="Organization Contact"
            value={formData.orgContact}
            onChange={handleChange}
          />{" "}
          {errors.orgContact && (
            <span className="text-red-500">{errors.orgContact}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Position</Label>
          <Input
            id="jobTitle"
            name="jobTitle"
            placeholder="Your job position"
            value={formData.jobTitle}
            onChange={handleChange}
          />{" "}
          {errors.jobTitle && (
            <span className="text-red-500">{errors.jobTitle}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="orgLocation">Organization Location</Label>
          <Input
            id="orgLocation"
            name="orgLocation"
            placeholder="Organization Location"
            value={formData.orgLocation}
            onChange={handleChange}
          />{" "}
          {errors.orgLocation && (
            <span className="text-red-500">{errors.orgLocation}</span>
          )}
        </div>
      </div>
    </>
  );

  const AdditionalInfo = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="Choose username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <span className="text-red-500">{errors.username}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedIn">LinkedIn</Label>
          <Input
            id="linkedIn"
            name="linkedIn"
            placeholder="LinkedIn profile URL"
            value={formData.linkedIn}
            onChange={handleChange}
          />
          {errors.linkedIn && (
            <span className="text-red-500">{errors.linkedIn}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            name="facebook"
            placeholder="Facebook profile URL"
            value={formData.facebook}
            onChange={handleChange}
          />
          {errors.facebook && (
            <span className="text-red-500">{errors.facebook}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter</Label>
          <Input
            id="twitter"
            name="twitter"
            placeholder="Twitter profile URL"
            value={formData.twitter}
            onChange={handleChange}
          />
          {errors.twitter && (
            <span className="text-red-500">{errors.twitter}</span>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        You can skip this step entirely and set it up later.
      </p>
    </>
  );

  const SuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center">
        <Check size={24} />
      </div>
      <h2 className="text-2xl font-semibold">Your Account is Ready!</h2>
      <p className="text-muted-foreground">
        Thank you for setting up your account. Your account is ready for
        deployment. You can always do an in-depth setup on your settings page.
      </p>
      <Button onClick={() => navigate("/")} className="mt-4">
        Ok, GOT IT!
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <StepIndicator />
          <CardTitle className="text-center">
            {currentStep === 1 && "Personal Information"}
            {currentStep === 2 && "Organization Information"}
            {currentStep === 3 && "Additional Information"}
            {currentStep === 4 && "Account Ready"}
          </CardTitle>
          <CardDescription className="text-center">
            {currentStep < 4 &&
              "Fill out the form below. You can always edit the data later."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 min-h-[50vh]">
          {currentStep === 1 && (
            <>
              <div className="space-y-8">
                {/* Avatar Upload Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage
                        className="w-24 h-24 rounded-full"
                        src={formData.avatar}
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-primary/10">
                        <User className="w-12 h-12 text-primary/60" />
                      </AvatarFallback>
                    </Avatar>
                    <Label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 p-1 rounded-full bg-primary hover:bg-primary/90 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-white" />
                      <Input
                        id="avatar-upload"
                        type="file"
                        name="avatar"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </Label>
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="font-medium">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a profile picture or continue without one
                    </p>
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && (
                      <span className="text-red-500">{errors.firstName}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && (
                      <span className="text-red-500">{errors.lastName}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <span className="text-red-500">{errors.email}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Contact Number</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      placeholder="Contact Number"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                    {errors.mobile && (
                      <span className="text-red-500">{errors.mobile} </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                    {errors.country && (
                      <span className="text-red-500">{errors.country} </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                    />
                    {errors.state && (
                      <span className="text-red-500">{errors.state} </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                    />
                    {errors.city && (
                      <span className="text-red-500">{errors.city} </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                    {errors.pincode && (
                      <span className="text-red-500">{errors.pincode} </span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          {currentStep === 2 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    name="orgName"
                    placeholder="Organization Name"
                    value={formData.orgName}
                    onChange={handleChange}
                  />
                  {errors.orgName && (
                    <span className="text-red-500">{errors.orgName}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgType">Organization Type</Label>
                  <Select
                    name="orgType"
                    value={formData.orgType}
                    onValueChange={(value) =>
                      handleSelectChange(value, "orgType")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      {orgTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.orgType && (
                    <span className="text-red-500">{errors.orgType}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgEmail">Organization Email</Label>
                  <Input
                    id="orgEmail"
                    name="orgEmail"
                    type="email"
                    placeholder="Organization Email"
                    value={formData.orgEmail}
                    onChange={handleChange}
                  />{" "}
                  {errors.orgEmail && (
                    <span className="text-red-500">{errors.orgEmail}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgContact">Organization Contact</Label>
                  <Input
                    id="orgContact"
                    name="orgContact"
                    placeholder="Organization Contact"
                    value={formData.orgContact}
                    onChange={handleChange}
                  />{" "}
                  {errors.orgContact && (
                    <span className="text-red-500">{errors.orgContact}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Position</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    placeholder="Your job position"
                    value={formData.jobTitle}
                    onChange={handleChange}
                  />{" "}
                  {errors.jobTitle && (
                    <span className="text-red-500">{errors.jobTitle}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgLocation">Organization Location</Label>
                  <Input
                    id="orgLocation"
                    name="orgLocation"
                    placeholder="Organization Location"
                    value={formData.orgLocation}
                    onChange={handleChange}
                  />{" "}
                  {errors.orgLocation && (
                    <span className="text-red-500">{errors.orgLocation}</span>
                  )}
                </div>
              </div>
            </>
          )}
          {currentStep === 3 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Choose username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && (
                    <span className="text-red-500">{errors.username}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedIn">LinkedIn</Label>
                  <Input
                    id="linkedIn"
                    name="linkedIn"
                    placeholder="LinkedIn profile URL"
                    value={formData.linkedIn}
                    onChange={handleChange}
                  />
                  {errors.linkedIn && (
                    <span className="text-red-500">{errors.linkedIn}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    placeholder="Facebook profile URL"
                    value={formData.facebook}
                    onChange={handleChange}
                  />
                  {errors.facebook && (
                    <span className="text-red-500">{errors.facebook}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    placeholder="Twitter profile URL"
                    value={formData.twitter}
                    onChange={handleChange}
                  />
                  {errors.twitter && (
                    <span className="text-red-500">{errors.twitter}</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                You can skip this step entirely and set it up later.
              </p>
            </>
          )}
          {currentStep === 4 && <SuccessStep />}
        </CardContent>
        <CardFooter>
          {currentStep < 4 && (
            <div className="flex justify-between w-full pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button
                disabled={loading}
                onClick={currentStep === 3 ? handleSubmit : handleNext}
                // () => setCurrentStep(4)
              >
                {currentStep === 3 ? (
                  loading ? (
                    <Spinner className="mr-2 border-white" />
                  ) : (
                    "Submit"
                  )
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditProfile;
