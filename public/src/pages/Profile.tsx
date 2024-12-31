/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Eye, MapPin, MessageSquare, Plus, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, intRoute } from "@/utils/apiRoutes";
import { userToken } from "@/utils";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { Patent, UserData } from "@/utils/types";
import Cookies from "js-cookie";
const Profile = ({
  userData,
  setUserData,
}: {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}) => {
  // Dummy data

  const navigate = useNavigate();

  const [patentInteractions, setPatentInteractions] = useState<any>({
    impressionCount: [],
    wishlistCount: [],
    enquiryCount: [],
  });

  // State for user activity
  const [userActivity, setUserActivity] = useState({
    wishlistCount: [],
    inquiryCount: [],
    impressionCount: [],
  });

  // State for my patents
  const [myPatents, setMyPatents] = useState<Patent[]>([]);

  const handleLogout = async () => {
    localStorage.removeItem(userToken);
    Cookies.remove("token");
    setUserData({
      avatar: "",
      city: "",
      country: "",
      createdAt: "",
      email: "",
      facebook: "",
      firstName: "",
      jobTitle: "",
      joinedAt: "",
      lastName: "",
      linkedIn: "",
      mobile: "",
      orgContact: "",
      orgEmail: "",
      orgLocation: "",
      orgLogo: "",
      orgName: "",
      orgType: "",
      password: "",
      pincode: "",
      state: "",
      twitter: "",
      updatedAt: "",
      userId: "",
      username: "",
    });
    navigate("/home");
  };
  const fetchAllInteractions = async () => {
    try {
      const response = await axios.get(`${intRoute}/all-interactions`, {
        withCredentials: true, // Include cookies
      });

      if (response.status === 200 && response.data.success) {
        console.log(response.data);
        const results = response.data.data;
        setPatentInteractions({
          impressionCount: results.received.impressions,
          wishlistCount: results.received.wishlist,
          enquiryCount: results.received.enquiry,
        });
        setUserActivity({
          wishlistCount: results.sent.impressions,
          inquiryCount: results.sent.wishlist,
          impressionCount: results.sent.enquiry,
        });
        // console.log(results.userPatents.length);
        setMyPatents(results.userPatents);
        return {
          success: true,
          data: response.data.data,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to fetch interactions"
        );
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
    }
  };
  useEffect(() => {
    fetchAllInteractions();
  }, []);

  if (!userData.userId) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white">
      <div className="h-48 bg-gradient-to-r from-slate-900 to-slate-800" />
      <div className="container mx-auto px-4 -mt-24 pb-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Profile Section */}
          <Card className="lg:col-span-3 h-fit border-none shadow-2xl hover:shadow-2xl transition-shadow duration-300 bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-8">
              <div className="flex flex-col items-center space-y-6">
                <Avatar className="w-24 h-24 ring-4 ring-white shadow-xl">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="text-2xl">
                    {userData.firstName![0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-3 w-full">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <p className="text-lg font-medium text-slate-700">
                    {userData.jobTitle}
                  </p>
                  <p className="text-sm text-slate-600">
                    {userData.orgName} employee
                  </p>
                  <div className="flex items-center justify-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{userData.city}</span>
                  </div>
                  <p className="text-sm text-slate-500 break-all px-4 font-mono">
                    {userData._id}
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {myPatents.length} Patents Registered
                  </p>
                  <p className="text-sm text-slate-600">
                    Member Since{" "}
                    {new Date(userData.joinedAt as string).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div className="flex flex-col gap-3 w-full pt-4">
                  <Button
                    variant="default"
                    onClick={() => navigate("/editprofile")}
                    className="w-full bg-slate-900 hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full border-slate-300 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="w-full border-b border-slate-200 p-0 h-auto bg-transparent space-x-2">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="patent">Patent</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">
                      Welcome back, {userData.firstName}
                    </h2>

                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Left Column - Patent Stats */}
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              Patent Impression/Likes
                            </p>
                          </div>
                          <div className="text-3xl font-bold bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg">
                            {patentInteractions.impressionCount.length}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              People wislisted your patent
                            </p>
                          </div>
                          <div className="text-3xl font-bold bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg">
                            {patentInteractions.wishlistCount.length}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              Inquiry Raised
                            </p>
                          </div>
                          <div className="text-3xl font-bold bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg">
                            {patentInteractions.enquiryCount.length}
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Activity */}
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-xl shadow-lg">
                          <h3 className="text-xl font-bold text-white">
                            Your Activity
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <p className="text-sm font-medium text-slate-700 mb-4">
                              Your Wishlist
                            </p>
                            <div className="text-3xl font-bold text-white bg-slate-900 px-6 py-3 rounded-lg shadow-lg inline-block">
                              {userActivity.wishlistCount.length}
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <p className="text-sm font-medium text-slate-700 mb-4">
                              Inquiry Raised by you
                            </p>
                            <div className="text-3xl font-bold text-white bg-slate-900 px-6 py-3 rounded-lg shadow-lg inline-block">
                              {userActivity.inquiryCount.length}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <h3 className="text-sm font-medium text-slate-700 mb-4">
                            How much you were active here
                          </h3>
                          <Progress
                            value={75}
                            className="h-3 bg-gray-200 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="patent">
                <div className="space-y-8">
                  {/* Add Patent Section */}
                  <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            Add your patent to the list
                          </h3>
                          <p className="text-slate-600 mt-2">
                            Share your innovations with the community
                          </p>
                        </div>
                        <Button
                          onClick={() => navigate("/create-patent")}
                          className="bg-slate-900 hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[150px]"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Patent
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* My Patents Section */}
                  <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-2xl font-bold text-slate-900">
                            My Patents
                          </h3>
                          {/* <Button
                            variant="outline"
                            className="border-slate-300 hover:bg-slate-100"
                          >
                            View All
                          </Button> */}
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Patent Cards */}
                          {myPatents.length !== 0 &&
                            myPatents.map((patent, index) => (
                              <Card
                                key={index}
                                className="group hover:shadow-lg transition-all duration-300 border border-slate-200"
                              >
                                <CardContent className="p-6">
                                  <div className="space-y-4">
                                    {/* Status Badge */}
                                    <div
                                      className={`
                      inline-block px-3 py-1 rounded-full text-xs font-medium
                      ${
                        patent.transactionType === "Available"
                          ? "bg-green-100 text-green-800"
                          : patent.transactionType === "Sold"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    `}
                                    >
                                      {patent.transactionType}
                                    </div>

                                    {/* Patent Title */}
                                    <h4 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">
                                      {patent.title}
                                    </h4>

                                    {/* Patent Details */}
                                    <div className="space-y-2">
                                      <div className="flex items-center text-sm text-slate-600">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {new Date(
                                          patent.listedAt
                                        ).toLocaleDateString()}
                                      </div>
                                      <div className="flex items-center text-sm text-slate-600">
                                        <Tag className="w-4 h-4 mr-2" />
                                        {patent.patentType}
                                      </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                      <div className="flex items-center text-sm text-slate-600">
                                        <Eye className="w-4 h-4 mr-1" />
                                        {
                                          patentInteractions.impressionCount.filter(
                                            (ele: any) =>
                                              ele.patentDetails.patentId ===
                                              patent.patentId
                                          ).length
                                        }
                                      </div>
                                      <div className="flex items-center text-sm text-slate-600">
                                        <MessageSquare className="w-4 h-4 mr-1" />
                                        {
                                          patentInteractions.enquiryCount.filter(
                                            (ele: any) =>
                                              ele.patentDetails.patentId ===
                                              patent.patentId
                                          ).length
                                        }
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          navigate(
                                            `/description/${patent.patentId}`,
                                            {
                                              state: patent,
                                            }
                                          );
                                        }}
                                        className="text-slate-600 hover:text-slate-900"
                                      >
                                        View Details
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity Section */}
                  <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900">
                          Recent Activity on your Patents
                        </h3>
                        <div className="text-slate-600">
                          {/* We could add a timeline or activity feed here */}
                          <p>No recent activities</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
