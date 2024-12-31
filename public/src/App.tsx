import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgotpassword from "./pages/Forgotpassword";
import NavBar from "./components/Navbar";
import About from "./pages/About";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import PatentDescription from "./pages/PatentDescription";
import CreatePatent from "./pages/CreatePatent";
import EditProfile from "./pages/EditProfile";
import { UserData } from "./utils/types";
function App() {
  const [userData, setUserData] = useState<UserData>({
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

  return (
    <BrowserRouter>
      <NavBar userData={userData} setUserData={setUserData} />

      <Routes>
        <Route path="/home" element={<Login setUserData={setUserData} />} />
        <Route
          path="/register"
          element={<Register setUserData={setUserData} />}
        />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route
          path="/profile"
          element={<Profile userData={userData} setUserData={setUserData} />}
        />
        <Route
          path="/description/:id"
          element={<PatentDescription userData={userData} />}
        />
        <Route
          path="/editprofile"
          element={
            <EditProfile userData={userData} setUserData={setUserData} />
          }
        />
        <Route
          path="/create-patent"
          element={<CreatePatent userData={userData} />}
        />
        {/* <Route path="/home" element={<SignIn />} />
        <Route path="/edit" element={<ProfileImage />} />*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
