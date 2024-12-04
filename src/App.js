import Login from "./Component/Login";
import "./css/main.scss";
import SignUp from "./Component/SignUp";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import ForgotPassword from "./Component/ForgotPassword";
import CreateItem from "./Pages/CreateItem";
import Images from "./Pages/Images";
import ItemDetails from "./Pages/ItemDetails";
import Home from "./Pages/Home";
import UserProfile from "./Pages/UserProfile";
import AuctionForm from "./Pages/AuctionForm";
import Auction from "./Pages/Auction";
import Contact from "./Pages/Contact";
import ProfileEdit from "./Pages/ProfileEdit";
import AuctionDetails from "./Pages/AuctionDetails";
import Wishlist from "./Pages/Wishlist";
import EditImg from "./Pages/EditImg";
import Terms from "./Pages/Terms";
import Posts from "./Pages/Posts";

function App() {
  const token = localStorage.getItem("token");
  console.log(token);
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route
            path="/"
            element={token !== null ? <Home /> : <Login></Login>}
          ></Route> */}
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/forgot" element={<ForgotPassword />}></Route>
          <Route path="/createitem" element={<CreateItem />}></Route>
          <Route path="/collections" element={<Images />}></Route>
          <Route path="/auction" element={<Auction />}></Route>
          <Route path="/wishlist/:userid" element={<Wishlist />}></Route>
          <Route path="/data/:imgid" element={<ItemDetails />}></Route>
          <Route path="/posts/:followersid" element={<Posts />}></Route>
          <Route path="/userprofile/:userid" element={<UserProfile />}></Route>
          <Route
            path="/auction/:imgid"
            element={<AuctionForm></AuctionForm>}
          ></Route>
           <Route
            path="/editimg/:imgid"
            element={<EditImg/>}
          ></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/terms" element={<Terms />}></Route>
          <Route path="/editprofile/:userid" element={<ProfileEdit />}></Route>
          <Route path="/aucdetails/:auctionid" element={<AuctionDetails />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
