/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Linkedin, Facebook } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import axios, { AxiosError } from "axios";
import { subsRoute } from "@/utils/apiRoutes";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/Squirrelip.png";

const contactSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  organization: z.string().min(1, "Organization Name is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message cannot be empty"),
});

export default function Contact() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      organization: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await axios.post(
        subsRoute,
        {
          firstname: data.firstName,
          lastname: data.lastName,
          orgname: data.organization,
          mobile: data.phone,
          email: data.email,
          message: data.message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast({
          title: "Message reeived",
          description: "We'll get back to you",
        });
        form.reset();
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white py-12 text-center">
        <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
        <p className="mt-2 text-gray-600">We'd love to talk to you</p>
      </div>

      {/* Contact Info Cards */}
      <div className="mx-auto max-w-7xl px-4 -mt-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <Phone className="h-6 w-6" />
              <div>
                <p className="font-semibold">CALL US</p>
                <span className="text-gray-600">+91 7977563694</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <Mail className="h-6 w-6" />
              <div>
                <p className="font-semibold">EMAIL US</p>
                <span className="text-gray-600">info.squirrelip@gmail.com</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <MapPin className="h-6 w-6" />
              <div>
                <p className="font-semibold">OUR OFFICE</p>
                <span className="text-gray-600">Thane, Mumbai</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Section */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Let's Work Together!</h2>
            <p className="text-gray-600">
              Share your innovations, visions for your next project with us now.
              Please contact us for basic questions. We're always here to help.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Organization Name/Sector"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Phone No." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Email Address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Type your message..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button disabled={loading} type="submit" className="w-full">
                    {loading ? (
                      <Spinner className="mr-2 border-white" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white">
        <div className="container px-4 mx-auto py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <img
                src={logo}
                alt="Squirrel IP Logo"
                className="size-14 sm:size-16"
              />
              <p className="text-zinc-300">Follow Us On</p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-zinc-800 hover:bg-zinc-700 rounded-full"
                  asChild
                >
                  <a
                    href="https://www.linkedin.com/company/squirrelip/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-zinc-800 hover:bg-zinc-700 rounded-full"
                  asChild
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">CONTACT US</h3>
              <div className="space-y-2 text-zinc-300">
                <p>Phone: +91 7977563694</p>
                <p>Email: info.squirrelip@gmail.com</p>
                <p>Working Days: Monday to Saturday</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">SERVICES</h3>
              <div className="space-y-2 text-zinc-300">
                <p>Patent Filing</p>
                <p>Patent Commercialization</p>
                <p>Patent Customization</p>
                <p>Patent Workforce Community</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">PAGES</h3>
              <div className="flex flex-col ">
                <Button
                  variant="link"
                  className="p-0 text-zinc-300 hover:text-white justify-start"
                  onClick={() => navigate("/about")}
                >
                  About
                </Button>
                <Button
                  variant="link"
                  className="p-0 text-zinc-300 hover:text-white justify-start"
                  onClick={() => navigate("/marketplace")}
                >
                  New Innovation
                </Button>
                <Button
                  variant="link"
                  className="p-0 text-zinc-300 hover:text-white justify-start"
                  onClick={() => navigate("/contact")}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="bg-zinc-900 text-zinc-400 py-4 text-center text-sm border-t border-zinc-800">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p>© 2024 Squirrel-IP. All rights reserved.</p>
            <div className="flex gap-4">
              <Button
                variant="link"
                className="p-0 text-zinc-400 hover:text-white text-sm"
              >
                Privacy Policy
              </Button>
              <Button
                variant="link"
                className="p-0 text-zinc-400 hover:text-white text-sm"
              >
                Terms of Service
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
