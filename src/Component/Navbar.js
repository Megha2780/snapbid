import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo2 from "../Component/logo2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBell,
  faCheck,
  faEnvelope,
  faEnvelopeOpen,
  faHeart,
  faMailBulk,
  faMailReply,
  faMoon,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import profile from "./profile.svg";
import wishlist from "./wishlist.svg";
import signout from "./logout-svgrepo-com.svg";
import tempImg from "./Free-circle-user-icon-vector-png.png";
import "../css/main.scss";

const Navbar = () => {
  const [userData, setUserData] = useState({});
  const [msgData, setMsgData] = useState({});
  const uid = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  
  const fetchData = async (uid) => {
    try {
      if (!uid) {
        console.error("ID NOT FOUND");
        return;
      }
      const response = await fetch("http://localhost:5000/api/nav", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: uid,
        }),
      });
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.statusText);
      }
      const responseData = await response.json();
      setUserData(responseData);
      // console.log("Response Data:", responseData);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };
  const navigate = useNavigate();
  const handlelogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("rzp_device_id");
    localStorage.removeItem("rzp_checkout_anon_id");
    localStorage.removeItem("rzp_checkout_user_id");
    navigate("/login");
  };
  const handlemsg = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${uid}`
      );
      if (!response.ok) {
        throw new Error("HTTP error" + response.status);
      }
      const ndata = await response.json();
      // if (msgData.length > 0) {
      // Check if Bidsdata has any entries
      setMsgData(ndata);
      console.log("messages:", msgData);
      // }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchData(uid);
    handlemsg();
  }, []);
  return (
    <>
      <header className="header">
        <div className="header-main style--three love-sticky position-relative">
          <div className="container">
            <div className="header-inner position-relative px-0 mt-0 bg-transparent">
              <div className="row align-items-center">
                <div className="col-lg-4 col-md-6 col-sm-9 col-6">
                  <div className="d-flex align-items-center">
                    <div className="logo">
                      <Link to="/Home">
                        <img
                          src={logo2}
                          className="main-logo object-fit-contain"
                          alt=""
                          style={{ height: "80px", width: "150px" }}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-3 col-6 d-flex align-items-center justify-content-end position-static">
                  <div className="nav-wrapper d-flex align-items-center">
                    <div className="nav-wrap-inner">
                      <ul className="nav">
                        <li className="">
                          <Link className="link" to="/">
                            Home
                          </Link>
                        </li>
                        <li>
                          <Link className="link" to={"/collections"}>
                            Explore
                          </Link>
                        </li>
                        <li>
                          <Link className="link" to="/auction">
                            Auction
                          </Link>
                        </li>
                        <li>
                          <Link className="link">Pages</Link>
                          <ul className="sub-menu">
                            <Link className="link" to={`/posts/${uid}`}>
                              <li>Posts </li>
                            </Link>
                            <Link className="link" to="/terms">
                              <li>Terms & Conditions</li>
                            </Link>
                          </ul>
                        </li>
                        <li>
                          <Link className="link" to="/contact">
                            Contact
                          </Link>
                        </li>
                        <li>
                          <Link className="link">
                            <FontAwesomeIcon icon={faBell} />
                          </Link>
                          <ul className="sub-menu">
                            {Array.isArray(msgData) &&
                              msgData.map((items) => {
                                return (
                                  <>
                                    <div className="">
                                      <div className="link row">
                                        <li>
                                          <FontAwesomeIcon icon={faUser} />
                                          &nbsp;
                                          <span
                                            style={{
                                              color: "#ff0076",
                                            }}
                                          >
                                            {items.ntitle}
                                          </span>
                                        </li>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                          </ul>
                        </li>
                        <li>
                          <div className="user-avatar mt-4" data-bs-toggle="">
                            {token == null ? (
                              <img
                                src={tempImg}
                                className="object-fit-cover"
                                style={{ width: "50px", height: "50px" }} // Adjust size as needed
                                alt="Profile"
                              />
                            ) : (
                              <img
                                src={userData.profilephoto}
                                className="object-fit-cover"
                                style={{ width: "50px", height: "50px" }} // Adjust size as needed
                                alt="Profile"
                              />
                            )}

                            <span className="user-status">
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="text-white fs-6"
                              />
                            </span>
                          </div>
                          <ul className="sub-menu">
                            <li>
                              <Link className="link" to={`/userprofile/${uid}`}>
                                <img src={profile} alt="" />&nbsp; Profile
                              </Link>
                            </li>
                            <li>
                              <Link to={`/wishlist/${uid}`} className="link">
                                <img src={wishlist} alt="" /> My Wishlist
                              </Link>
                            </li>

                            <li>
                              <button
                                className="link"
                                onClick={(e) => handlelogout()}
                              >
                                <img
                                  style={{ width: "18px", height: "18px" }}
                                  src={signout}
                                />
                                Log Out
                              </button>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
