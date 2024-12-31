import React, { useState } from "react";
import { Input } from "@/components/ui/input"; // Adjust the path as necessary
import { Button } from "@/components/ui/button"; // Adjust the path as necessary
import { Label } from "@/components/ui/label"; // Adjust the path as necessary
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Shadcn Card components
import { Loader2 } from "lucide-react"; // Icons from lucide-react
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isCooldown, setIsCooldown] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    setIsLoading(true); // Show loading spinner

    try {
      const response = await fetch(
        "http://localhost:5000/api/profile/send-recovery-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (response.status === 200) {
        toast({
          title: "Recovery email sent successfully!",
        });
        startCooldown();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "An error occurred.",
        });
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
      setIsLoading(false); // Hide loading spinner
    }
  };

  const startCooldown = () => {
    setIsCooldown(true);
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setIsCooldown(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex  items-center justify-center min-h-[90vh] bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <Card className="bg-white shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-gray-700">
              Forgot Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-600"
                >
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Button
                type="submit"
                disabled={isCooldown || isLoading}
                className={`w-full p-3 text-white font-semibold rounded-md transition-colors ${
                  isCooldown || isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary "
                }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : isCooldown ? (
                  `Try Again in ${timer}s`
                ) : (
                  "Send Recovery Email"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ForgotPassword;
