/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter, LayoutGrid, List, CarFront } from "lucide-react";
import { industries, technologies, transactionTypes } from "@/utils";
import axios, { AxiosError } from "axios";
import { patentsRoute } from "@/utils/apiRoutes";
import { Toggle } from "@/components/ui/toggle";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Patent } from "@/utils/types";
import { toast } from "@/hooks/use-toast";

// Dummy data

export default function Marketplace() {
  const [searchText, setSearchText] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [patents, setpatents] = useState<Patent[]>([]);
  // const [filteredPatents, setFilteredPatents] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    async function start() {
      setLoading(true);
      try {
        const { data } = await axios.get(`${patentsRoute}/get-all-patents`);
        // console.log(data.data);
        setpatents(data.data);
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
        setLoading(false);
      }
      // setFilteredPatents(data.data); // Initialize with all patents
    }
    start();
  }, []);

  // useEffect(() => {
  //   filterPatents();
  // }, [appliedFilters, patents]);

  // Filter patents based on search and filters
  const filteredPatents = patents?.filter((patent) => {
    const matchesSearch =
      patent.title.toLowerCase().includes(searchText.toLowerCase()) ||
      patent.abstract.toLowerCase().includes(searchText.toLowerCase());

    const matchesFilters =
      appliedFilters.length === 0 ||
      appliedFilters.some(
        (filter: any) =>
          patent.sector === filter ||
          patent.usedTech === filter ||
          patent.transactionType === filter
      );

    return matchesSearch && matchesFilters;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPatents?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatents = filteredPatents?.slice(startIndex, endIndex);
  const addFilter = (value: any) => {
    if (!appliedFilters.includes(value)) {
      setAppliedFilters([...appliedFilters, value]);
    }
  };

  const removeFilter = (filter: any) => {
    setAppliedFilters(appliedFilters.filter((f: any) => f !== filter));
  };
  // View toggle components
  const ViewToggle = () => (
    <div className="flex gap-2 mb-4">
      <Toggle
        pressed={isGridView}
        onPressedChange={() => setIsGridView(true)}
        disabled={loading}
        aria-label="Grid view"
      >
        {loading ? (
          <Skeleton className="h-4 w-4" />
        ) : (
          <LayoutGrid className="h-4 w-4" />
        )}
      </Toggle>
      <div className="hidden md:flex">
        <Toggle
          pressed={!isGridView}
          onPressedChange={() => setIsGridView(false)}
          aria-label="List view"
          disabled={loading}
        >
          {loading ? (
            <Skeleton className="h-4 w-4" />
          ) : (
            <List className="h-4 w-4" />
          )}
        </Toggle>
      </div>
    </div>
  );

  // Grid view component
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {currentPatents?.map((patent) => (
        <Card
          onClick={() =>
            navigate(`/description/${patent.patentId}`, { state: patent })
          }
          key={patent.patentId}
          className="cursor-pointer relative hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-4 ">
            <div className="aspect-video relative mb-4">
              <img
                src={patent.patentImages[0]}
                alt={patent.title}
                className="w-full h-full object-contain rounded-md"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold line-clamp-2">{patent.title}</h3>
              <p className="text-sm text-gray-500">Sector: {patent.sector}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Badge
              variant={
                patent.transactionType === "Available"
                  ? "secondary"
                  : patent.transactionType === "Both"
                  ? "secondary"
                  : "destructive"
              }
              className={`${
                patent.transactionType === "Both" &&
                "bg-blue-400 hover:bg-blue-300"
              } capitalize`}
            >
              {patent.transactionType}
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  // List view component
  const ListView = () => (
    <div className="space-y-4">
      {currentPatents?.map((patent) => (
        <Card
          onClick={() =>
            navigate(`/description/${patent.patentId}`, { state: patent })
          }
          key={patent.patentId}
          className="cursor-pointer hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-48 flex-shrink-0">
                <img
                  src={patent.patentImages[0]}
                  alt={patent.title}
                  className="w-full h-32 object-contain rounded-md"
                />
              </div>
              <div className="flex-grow space-y-2">
                <h3 className="font-semibold">{patent.title}</h3>
                <p className="text-sm text-gray-500">{patent.abstract}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Sector: {patent.sector}
                  </p>
                  <Badge
                    variant={
                      patent.transactionType === "Available"
                        ? "secondary"
                        : patent.transactionType === "Both"
                        ? "secondary"
                        : "destructive"
                    }
                    className={`${
                      patent.transactionType === "Both" &&
                      "bg-blue-400 hover:bg-blue-300"
                    } capitalize`}
                  >
                    {patent.transactionType}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Status Filters */}
      <div className="flex gap-4 mb-6">
        <Badge variant="outline" className="text-sm">
          All ({filteredPatents.length})
        </Badge>
        <Badge variant="outline" className="text-sm">
          Available (
          {
            filteredPatents.filter((ele) => ele.transactionType === "Available")
              .length
          }
          )
        </Badge>
        <Badge variant="outline" className="text-sm">
          Sold (
          {
            filteredPatents.filter((ele) => ele.transactionType === "Sold")
              .length
          }
          )
        </Badge>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by keywords"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="md:col-span-1 h-fit">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5" />
              <h2 className="font-semibold">Filters</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <Select onValueChange={addFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Technology</label>
                <Select onValueChange={addFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Technology" />
                  </SelectTrigger>
                  <SelectContent>
                    {technologies.map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Transaction Type</label>
                <Select onValueChange={addFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Transaction Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypes.map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Applied Filters */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Applied Filters</h3>
            <div className="flex flex-wrap gap-2">
              {appliedFilters.length > 0 ? (
                appliedFilters.map((filter: any, index: any) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {filter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeFilter(filter)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
              ) : (
                <span className="text-gray-500">No filters applied</span>
              )}
            </div>
          </div>

          {/* View Toggle */}
          <ViewToggle />

          {/* Dynamic View */}
          {currentPatents.length > 0 ? (
            <>
              {isGridView ? <GridView /> : <ListView />}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                      key={index}
                      variant={
                        currentPage === index + 1 ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500">No Patents Found</p>
          )}
        </div>
      </div>
    </div>
  );
}
