/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { industries, technologies, transactionTypes } from "@/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import moment from "moment";
import { UserData } from "@/utils/types";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { patentsRoute } from "@/utils/apiRoutes";

const patentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  email: z.string().email("Invalid email address"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  coauthors: z.string().optional(),
  org: z.string().min(1, "Organization is required"),
  title: z.string().min(1, "Patent title is required"),
  grantDate: z
    .date()
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "Grant date is required and must be a valid date",
    }),
  filingDate: z
    .date()
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "Filing date is required and must be a valid date",
    }),
  patentNumber: z.string().min(1, "Patent number is required"),
  applicationNumber: z.string().min(1, "Application number is required"),
  abstract: z.string().min(10, "Abstract must be at least 10 characters long"),
  sector: z.string().min(1, "Sector is required"),
  usedTech: z.string().min(1, "Used technology is required"),
  transactionType: z.string().min(1, "Transaction type is required"),
});

interface FormData {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  state: string;
  city: string;
  coauthors: string;
  org: string;
  title: string;
  grantDate: Date | undefined | string;
  filingDate: Date | undefined | string;
  patentNumber: string;
  applicationNumber: string;
  abstract: string;
  sector: string;
  usedTech: string;
  transactionType: string;
}

const CreatePatent = ({ userData }: { userData: UserData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    state: "",
    city: "",
    coauthors: "",
    org: "",
    title: "",
    grantDate: undefined,
    filingDate: undefined,
    patentNumber: "",
    applicationNumber: "",
    abstract: "",
    sector: "",
    usedTech: "",
    transactionType: "",
  });

  useEffect(() => {
    setFormData({
      ...formData,
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      mobile: userData.mobile!,
      email: userData.email!,
      state: userData.state!,
      city: userData.city!,
      coauthors: "",
      org: userData.orgName!,
      title: "",
      patentNumber: "",
      applicationNumber: "",
      abstract: "",
      sector: "",
      usedTech: "",
      transactionType: "",
    });
  }, [userData]);

  const [errors, setErrors] = useState<FormData | undefined>();
  const [files, setFiles] = useState<any>();
  const [images, setImages] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: string, date: Date | undefined) => {
    setFormData({
      ...formData,
      [field]: date,
    });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(e.target.files[0]); // Set the first selected file
      console.log("Selected File:", e.target.files[0]); // Log for debugging
    }
  };

  const handleImageUpload = (e: any) => {
    const files = Array.from(e.target.files);
    console.log(files);
    setImages(files);
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const removeImage = (indexToRemove: any) => {
    setImages(images.filter((_: any, index: any) => index !== indexToRemove));
  };
  // useEffect(() => {
  //   console.log(images);
  // }, [images]);

  const validateForm = () => {
    try {
      patentSchema.parse(formData);
      setErrors(undefined); // Reset errors if validation passes
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors: any = {};
        err.errors.forEach((e) => {
          validationErrors[e.path[0]] = e.message;
        });
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Check if the PDF file is selected
    if (!files) {
      toast({
        title: "Error",
        description: "Missing PDF file.",
        variant: "destructive",
      });
      return;
    }

    // Check if at least one image is selected
    if (!images || images.length === 0) {
      toast({
        title: "Error",
        description: "Missing patent images.",
        variant: "destructive",
      });
      return;
    }

    // Create a FormData object to send data as multipart/form-data
    const formDataToSend = new FormData();

    // Append text fields
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value !== undefined) {
        formDataToSend.append(key, value);
      }
    });

    // Append the PDF file
    formDataToSend.append("pdf", files);

    // Append images (file-by-file)
    images.forEach((image: File) => {
      formDataToSend.append("images", image);
    });

    setLoading(true); // Show loading indicator

    try {
      // Send data to the backend using axios
      const response = await axios.post(
        `${patentsRoute}/create-patent`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Patent submitted successfully!",
        });

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          mobile: "",
          email: "",
          state: "",
          city: "",
          coauthors: "",
          org: "",
          title: "",
          grantDate: undefined,
          filingDate: undefined,
          patentNumber: "",
          applicationNumber: "",
          abstract: "",
          sector: "",
          usedTech: "",
          transactionType: "",
        });
        setFiles(null);
        setImages([]);
        setCurrentStep(1);
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to submit patent.",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "Error submitting patent:",
          error.response?.data?.message || error.message
        );
        toast({
          title: "Something went wrong",
          description: error.response?.data?.message || "An error occurred.",
          variant: "destructive",
        });
      } else {
        console.error("Unexpected error:", error);
        toast({
          title: "Something went wrong",
          description: "Try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome!</h1>
          <p className="mt-2 text-gray-600">
            Add your patent by completing following steps
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="flex mb-8 flex-wrap">
          {/* Timeline on the Left */}
          <div className="hidden lg:flex flex-col pr-8">
            {[
              "Tell us about yourself",
              "Tell us about your patent",
              "Share knowledge about your invention",
              "Upload Documents",
            ].map((step, index) => (
              <div key={index} className="flex items-center space-x-4 mb-6">
                {/* Step Indicator */}
                <div
                  className={`w-6 h-6 rounded-full flex justify-center items-center text-sm font-bold text-white ${
                    currentStep === index + 1
                      ? "bg-black"
                      : currentStep > index + 1
                      ? "bg-gray-700"
                      : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                {/* Step Title */}
                <div
                  className={`text-lg ${
                    currentStep === index + 1
                      ? "text-black font-semibold"
                      : currentStep > index + 1
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </div>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="flex-1">
            <div className="space-y-6">
              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="text-xl font-bold text-black">
                  {currentStep === 1 && "Tell us about yourself"}
                  {currentStep === 2 && "Tell us about your patent"}
                  {currentStep === 3 && "Share knowledge about your invention"}
                  {currentStep === 4 && "Upload Documents"}
                </div>
                {/* Form Content */}
                <Card className="shadow-lg ">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {currentStep === 1 && "Personal Information"}
                      {currentStep === 2 && "Patent Information"}
                      {currentStep === 3 && "Invention Details"}
                      {currentStep === 4 && "Document Upload"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="min-h-[50vh]">
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                            />
                            {errors?.firstName && (
                              <div className="text-red-500 text-sm">
                                {errors?.firstName}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                            />
                            {errors?.lastName && (
                              <div className="text-red-500 text-sm">
                                {errors?.lastName}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="mobile">Phone Number</Label>
                            <Input
                              id="mobile"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleChange}
                            />
                            {errors?.mobile && (
                              <div className="text-red-500 text-sm">
                                {errors?.mobile}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                            {errors?.email && (
                              <div className="text-red-500 text-sm">
                                {errors?.email}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                            />
                            {errors?.state && (
                              <div className="text-red-500 text-sm">
                                {errors?.state}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                            />
                            {errors?.city && (
                              <div className="text-red-500 text-sm">
                                {errors?.city}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="coauthors">
                              Co-Authors (If any)
                            </Label>
                            <Input
                              id="coauthors"
                              name="coauthors"
                              value={formData.coauthors}
                              onChange={handleChange}
                            />
                            {errors?.coauthors && (
                              <div className="text-red-500 text-sm">
                                {errors?.coauthors}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="org">
                              Institution/Organization
                            </Label>
                            <Input
                              id="org"
                              name="org"
                              value={formData.org}
                              onChange={handleChange}
                            />
                            {errors?.org && (
                              <div className="text-red-500 text-sm">
                                {errors?.org}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title of Patent</Label>
                          <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                          />
                          {errors?.title && (
                            <div className="text-red-500 text-sm">
                              {errors?.title}
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="grantDate">Date of Grant</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formData.grantDate ? (
                                    moment(formData.grantDate).format(
                                      "MMMM D, YYYY"
                                    )
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={formData.grantDate as Date}
                                  onSelect={(date) =>
                                    handleDateChange("grantDate", date)
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            {errors?.grantDate && (
                              <div className="text-red-500 text-sm">
                                {errors?.grantDate as string}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="filingDate">Date of Filing</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formData.filingDate ? (
                                    moment(formData.filingDate).format(
                                      "MMMM D, YYYY"
                                    )
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={formData.filingDate as Date}
                                  onSelect={(date) =>
                                    handleDateChange("filingDate", date)
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            {errors?.filingDate && (
                              <div className="text-red-500 text-sm">
                                {errors?.filingDate as string}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="patentNumber">Patent Number</Label>
                            <Input
                              id="patentNumber"
                              name="patentNumber"
                              value={formData.patentNumber}
                              onChange={handleChange}
                            />
                            {errors?.patentNumber && (
                              <div className="text-red-500 text-sm">
                                {errors?.patentNumber}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="applicationNumber">
                              Application Number
                            </Label>
                            <Input
                              id="applicationNumber"
                              name="applicationNumber"
                              value={formData.applicationNumber}
                              onChange={handleChange}
                            />
                            {errors?.applicationNumber && (
                              <div className="text-red-500 text-sm">
                                {errors?.applicationNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="abstract">Abstract</Label>
                          <Textarea
                            id="abstract"
                            name="abstract"
                            value={formData.abstract}
                            onChange={handleChange}
                            className="min-h-[150px]"
                          />
                          {errors?.abstract && (
                            <div className="text-red-500 text-sm">
                              {errors?.abstract}
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="sector">Sector</Label>
                            <Select
                              value={formData.sector}
                              onValueChange={(value) =>
                                handleSelectChange("sector", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a sector" />
                              </SelectTrigger>
                              <SelectContent>
                                {industries.map((industry) => (
                                  <SelectItem key={industry} value={industry}>
                                    {industry}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors?.sector && (
                              <div className="text-red-500 text-sm">
                                {errors?.sector}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="usedTech">Used Technology</Label>
                            <Select
                              name="usedTech"
                              value={formData.usedTech}
                              onValueChange={(value) =>
                                handleSelectChange("usedTech", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a technology" />
                              </SelectTrigger>
                              <SelectContent>
                                {technologies.map((tech) => (
                                  <SelectItem key={tech} value={tech}>
                                    {tech}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors?.usedTech && (
                              <div className="text-red-500 text-sm">
                                {errors?.usedTech}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="transactionType">
                              Transaction Type
                            </Label>
                            <Select
                              value={formData.transactionType}
                              onValueChange={(value) =>
                                handleSelectChange("transactionType", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select transaction type" />
                              </SelectTrigger>
                              <SelectContent>
                                {transactionTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors?.transactionType && (
                              <div className="text-red-500 text-sm">
                                {errors?.transactionType}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-1">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            id="pdf-upload"
                            onChange={handleFileChange}
                          />
                          <Label
                            htmlFor="pdf-upload"
                            className="cursor-pointer block space-y-2"
                          >
                            <div className="mx-auto w-12 h-12 text-gray-400">
                              📄
                            </div>
                            <div className="text-sm text-gray-600">
                              Drag your file here or click to browse
                            </div>
                            <div className="text-xs text-gray-500">
                              PDF files only, max 1 file
                            </div>
                          </Label>
                          {files && (
                            <div className="mt-4 text-sm text-gray-600">
                              Selected: {files.name}
                            </div>
                          )}
                        </div>
                        {/* Simplified Link Section */}
                        <p className="text-sm text-gray-600">
                          <span>
                            Download our template for Innovator's Deck:{" "}
                          </span>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://pdf-folders-bucket.s3.eu-north-1.amazonaws.com/Innovator's+Deck.pptx"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Click here
                          </a>
                        </p>
                        {/* Images */}
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="image-upload"
                              onChange={handleImageUpload}
                              multiple
                            />
                            <Label
                              htmlFor="image-upload"
                              className="cursor-pointer block space-y-2"
                            >
                              <div className="mx-auto w-12 h-12 text-gray-400">
                                📄
                              </div>
                              <div className="text-sm text-gray-600">
                                Drag your files here or click to browse
                              </div>
                              <div className="text-xs text-gray-500">
                                Upload multiple images
                              </div>
                            </Label>
                          </div>

                          {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {images.map((image: any, index: any) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={16} />
                                  </button>
                                  <p className="mt-1 text-xs text-gray-500 truncate">
                                    {image.name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    {/* Navigation Buttons */}
                    <div className="w-full  flex justify-between mt-auto">
                      {currentStep > 1 && (
                        <Button variant="outline" onClick={handleBack}>
                          Back
                        </Button>
                      )}
                      <div className="ml-auto">
                        {currentStep < 4 ? (
                          <Button onClick={handleNext}>Next</Button>
                        ) : (
                          <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Uploading..." : "Submit"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePatent;
