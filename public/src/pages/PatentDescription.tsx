/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Heart, ThumbsUp, MessageSquare, Trash, FileText } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Patent, UserData } from "@/utils/types";
import axios, { AxiosError } from "axios";
import { intRoute, patentsRoute } from "@/utils/apiRoutes";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";

function PatentDescription({ userData }: { userData: UserData }) {
  const [patentData, setpatentData] = useState<Patent>();
  const [loading, setLoading] = useState(false);
  const [userOwnPatent, setUserOwnPatent] = useState(false);
  const navigate = useNavigate();
  const [deleteLoading, setdeleteLoading] = useState(false);
  const [interactions, setinteractions] = useState({
    wishlist: [],
    inquiry: [],
    impression: [],
  });

  const [isEnquired, setIsEnquired] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isImpressioned, setIsImpressioned] = useState(false);

  const location = useLocation();
  useEffect(() => {
    if (location.state) {
      // console.log(location.state);
      setLoading(true);
      setpatentData(location.state);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setUserOwnPatent(userData.userId === patentData?.userId);
  }, [userData, patentData]);

  async function fetchUserImpressions() {
    try {
      const response = await axios.get(`${intRoute}/all-impressions`, {
        withCredentials: true, // Ensures cookies are sent with the request
      });
      if (response.data.success) {
        return response.data.data; // Return data to the caller
      } else {
        console.error("Failed to fetch impressions:", response.data.message);
      }
    } catch (error: any) {
      if (error.response) {
        console.error(
          "Error fetching impressions:",
          error.response.data.message
        );
      } else {
        console.error("Error fetching impressions:", error.message);
      }
    }
  }

  useEffect(() => {
    fetchUserImpressions().then((data) => {
      console.log("Impressions request made");
      if (data) {
        setinteractions({
          ...interactions,
          wishlist: data.wishlist,
          inquiry: data.enquiry,
          impression: data.impression,
        });
      }
    });
  }, []);

  // useEffect(() => {
  //   console.log(interactions);
  // }, [interactions]);

  useEffect(() => {
    setIsWishlisted(interactions.wishlist.includes(patentData?.patentId));
    setIsEnquired(interactions.inquiry.includes(patentData?.patentId));
    setIsImpressioned(interactions.impression.includes(patentData?.patentId));
  }, [userData, patentData]);

  const deletePatent = async () => {
    try {
      setdeleteLoading(true);
      const response = await axios.delete(
        `${patentsRoute}/delete-patent/${patentData?.patentId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log(response.data.message);
        toast({
          title: "Patent deleted",
        });
        // Redirect to patents listing or dashboard after successful deletion
        navigate("/marketplace");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "Error logging in",
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
      setdeleteLoading(false);
    }
  };

  async function toggleWishlist() {
    try {
      const response = await axios.post(`${intRoute}/wishlist`, {
        from: {
          userId: userData.userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          mobile: userData.mobile,
          email: userData.email,
        },
        to: {
          userId: patentData?.userId, // Assuming the patent has an owner
          firstName: patentData?.firstName,
          lastName: patentData?.lastName,
          mobile: patentData?.mobile,
          email: patentData?.email,
        },
        patentDetails: {
          title: patentData?.title,
          patentNumber: patentData?.patentNumber,
          applicationNumber: patentData?.applicationNumber,
          abstract: patentData?.abstract,
          usedTech: patentData?.usedTech,
          sector: patentData?.sector,
          patentId: patentData?.patentId,
        },
      });
      // setisWishlisted(false);
      setIsWishlisted(response.data.data.wishlist);
    } catch (error: any) {
      console.error(
        "Error:",
        error.response ? error.response.data.message : error.message
      );
    }
  }

  async function toggleEnquiry() {
    try {
      if (isEnquired) {
        return;
      }
      const response = await axios.post(`${intRoute}/enquiry`, {
        from: {
          userId: userData.userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          mobile: userData.mobile,
          email: userData.email,
        },
        to: {
          userId: patentData?.userId, // Assuming the patent has an owner
          firstName: patentData?.firstName,
          lastName: patentData?.lastName,
          mobile: patentData?.mobile,
          email: patentData?.email,
        },
        patentDetails: {
          title: patentData?.title,
          patentNumber: patentData?.patentNumber,
          applicationNumber: patentData?.applicationNumber,
          abstract: patentData?.abstract,
          usedTech: patentData?.usedTech,
          sector: patentData?.sector,
          patentId: patentData?.patentId,
        },
      });
      // setisEnquired(true);
      setIsEnquired(response.data.data.enquire);
    } catch (error: any) {
      console.error(
        "Error:",
        error.response ? error.response.data.message : error.message
      );
    }
  }

  async function toggleImpression() {
    try {
      const response = await axios.post(`${intRoute}/impression`, {
        from: {
          userId: userData.userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          mobile: userData.mobile,
          email: userData.email,
        },
        to: {
          userId: patentData?.userId, // Assuming the patent has an owner
          firstName: patentData?.firstName,
          lastName: patentData?.lastName,
          mobile: patentData?.mobile,
          email: patentData?.email,
        },
        patentDetails: {
          title: patentData?.title,
          patentNumber: patentData?.patentNumber,
          applicationNumber: patentData?.applicationNumber,
          abstract: patentData?.abstract,
          usedTech: patentData?.usedTech,
          sector: patentData?.sector,
          patentId: patentData?.patentId,
        },
      });
      setIsImpressioned(response.data.data.impression);
    } catch (error: any) {
      console.error(
        "Error:",
        error.response ? error.response.data.message : error.message
      );
    }
  }

  if (!patentData || loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl font-bold">
                {patentData?.title}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Listed: {moment(patentData?.listedAt).format("MMMM Do, YYYY")}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="text-sm">
                {patentData?.sector}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {patentData?.transactionType}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="mt-6 space-y-8">
          {/* Action Buttons - Top */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={isWishlisted ? "secondary" : "outline"}
              className="flex items-center gap-2"
              onClick={toggleWishlist}
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
              />
              {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
            </Button>
            <Button
              variant={isImpressioned ? "secondary" : "outline"}
              className="flex items-center gap-2"
              onClick={toggleImpression}
            >
              <ThumbsUp className="w-4 h-4" />
              {isImpressioned ? "Liked" : "Like Patent"}
            </Button>
            {!userOwnPatent ? (
              <Button
                variant={isEnquired ? "secondary" : "outline"}
                className="flex items-center gap-2"
                onClick={toggleEnquiry}
              >
                <MessageSquare className="w-4 h-4" />
                {isEnquired ? "Enquiry Sent" : "Raise Inquiry"}
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={deletePatent}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <Trash className="w-4 h-4" />
                    Delete Patent
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Images Gallery */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Patent Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {patentData?.patentImages?.map((img, index) => (
                <div key={index} className="relative aspect-[3/4] group">
                  <img
                    src={img}
                    alt={`Patent Image ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-base leading-relaxed">
                {patentData?.abstract}
              </p>
            </div>

            {/* Technical Details */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold">Technical Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-500">Sector</h4>
                  <p>{patentData?.sector}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Technology Used</h4>
                  <p>{patentData?.usedTech}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">
                    Transaction Type
                  </h4>
                  <p>{patentData?.transactionType}</p>
                </div>
              </div>
            </div>

            {/* Document Section */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Investor's Deck</h3>
                  {!userOwnPatent && !isEnquired && (
                    <p className="text-sm text-gray-500 mt-1">
                      Raise an inquiry to view the document
                    </p>
                  )}
                </div>
                {(userOwnPatent || isEnquired) && (
                  <Button
                    onClick={() => window.open(patentData.pdf, "_blank")}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    View PDF
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PatentDescription;
