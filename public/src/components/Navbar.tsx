/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { profileRoute } from "@/utils/apiRoutes";
import { userToken } from "@/utils";
import { toast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import useUserData from "@/hooks/useUserData";
import { UserData } from "@/utils/types";
import { Spinner } from "./ui/spinner";
import { useTheme } from "./theme-provider";
import Cookies from "js-cookie";

interface NavLinksProps {
  onClick?: () => void;
  navigate: (path: string) => void;
}

const NavLinks = ({ onClick, navigate }: NavLinksProps) => (
  <>
    <Button
      variant="ghost"
      onClick={() => {
        onClick?.();
        navigate("");
      }}
    >
      Home
    </Button>
    <Button
      variant="ghost"
      onClick={() => {
        onClick?.();
        navigate("about");
      }}
    >
      About
    </Button>
    <Button
      variant="ghost"
      onClick={() => {
        onClick?.();
        navigate("contact");
      }}
    >
      Contact
    </Button>
    <Button
      variant="ghost"
      onClick={() => {
        onClick?.();
        navigate("marketplace");
      }}
    >
      New Innovation
    </Button>
  </>
);

export const NavBar = ({
  userData,
  setUserData,
}: {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}) => {
  // const [userData, setUserData] = useState<UserData>({
  //   avatar: "",
  //   city: "",
  //   country: "",
  //   createdAt: "",
  //   email: "",
  //   facebook: "",
  //   firstName: "",
  //   jobTitle: "",
  //   joinedAt: "",
  //   lastName: "",
  //   linkedIn: "",
  //   mobile: "",
  //   orgContact: "",
  //   orgEmail: "",
  //   orgLocation: "",
  //   orgLogo: "",
  //   orgName: "",
  //   orgType: "",
  //   password: "",
  //   pincode: "",
  //   state: "",
  //   twitter: "",
  //   updatedAt: "",
  //   userId: "",
  //   username: "",
  // });
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isAuth = useAuth(false);
  const [deleteLoading, setdeleteLoading] = useState(false);

  const [, setErrors] = useState();
  useUserData(setUserData, setErrors);
  const { setTheme } = useTheme();

  const { pathname } = useLocation();
  const isLoggedIn = useAuth();
  useEffect(() => {
    if (!isLoggedIn) {
      if (
        pathname === "/profile" ||
        pathname === "editprofile" ||
        pathname === "/create-patent" ||
        pathname.includes("/description")
      ) {
        navigate("/");
      }
    }
  }, [isLoggedIn, navigate]);

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

  const deleteUser = async () => {
    try {
      setdeleteLoading(true);
      const response = await axios.delete(`${profileRoute}/delete-user`, {
        withCredentials: true,
      });
      if (response.status === 200) handleLogout();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: error.response?.data?.message,
        });
      }
    } finally {
      setdeleteLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log("here");
  // }, []);

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <img
          src="/src/assets/sqlg.png"
          alt="logo"
          className="size-12 w-14 cursor-pointer"
          onClick={() => navigate("/home")}
        />

        <div className="ml-auto flex items-center gap-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4">
            <NavLinks navigate={navigate} />
          </div>

          {isAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={userData.avatar} alt="User" />
                  <AvatarFallback>{userData.firstName![0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="md:w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Set theme</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Delete Account
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={deleteUser}
                        disabled={deleteLoading}
                        className="bg-red-700 hover:bg-red-600"
                      >
                        {deleteLoading ? <Spinner /> : "Confirm"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("home")}>Join Us</Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-4">
                <NavLinks
                  navigate={navigate}
                  onClick={() => setIsOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
