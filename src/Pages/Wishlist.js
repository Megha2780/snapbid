import React, { useEffect, useState } from "react";
import Navbar from "../Component/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart, faRupee } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import Footer from "../Component/Footer";
import wm from "../assets/images/watermark.png";
import tmpimg from "../assets/images/author-cover.png";

// Function to clear local storage
const clearLocalStorage = () => {
  localStorage.removeItem("id"); // Remove the ID
  localStorage.removeItem("heartClicked"); // Remove the heartClicked status
};

// Function to handle logout
const handleLogout = () => {
  // Your logout logic here...

  // Clear localStorage
  clearLocalStorage();
};

const Wishlist = () => {
  const uid = localStorage.getItem("id");
  const [data, setData] = useState(null);
  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/whishdisplay/${uid}`
      );
      if (!response.ok) {
        throw new Error("HTTP error" + response.status);
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleDelete = async (wishlistid, imgid) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/wishdelete/${wishlistid}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("HTTP Error : " + response.error);
      }
      const responseData = await response.json();
      console.log(responseData);
      const removeHeartClicked = (imgid) => {
        const heartClickedStorage = JSON.parse(localStorage.getItem("heartClicked"));
        if (heartClickedStorage && heartClickedStorage[imgid]) {
          delete heartClickedStorage[imgid];
          localStorage.setItem("heartClicked", JSON.stringify(heartClickedStorage));
        }
      };
      
      removeHeartClicked(imgid);
      
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchData();
  },[data]);
  return (
    <>
      <Navbar />
      <section className="pt-120 pb-120">
        <div className="container">
          <div className="row mb-50">
            <div className="col-xl-3 order-0 order-xl-1 mb-4 mb-xl-0">
              <form className="search-form style--two" action="#">
                <div className="form-group ms-auto me-auto me-xl-0 mw-100">
                  <input
                    type="text"
                    className="form-control mb-0"
                    placeholder="Search item…"
                  />{" "}
                  <button type="submit">
                    <img
                      src="assets/img/icons/search.svg"
                      className="svg"
                      alt=""
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="tab-content">
            <div className="tab-pane fade show active" id="collected">
              <div className="row">
                {Array.isArray(data) &&
                  data.map(
                    ({ wishlistid, userid, imgid, imgurl, imgname }) => (
                      <div className="col-lg-4 col-md-6">
                        <div className="single-product mb-30" key={wishlistid}>
                          <Link to={`/data/${imgid}`}>
                            <img
                              src={imgurl}
                              className="single-img"
                              alt="image"
                              style={{ height: "400px" }}
                            />
                          </Link>
                          <div className="product-content">
                            <div className="product-top">
                              <h5 className="text-capitalize">{imgname}</h5>
                            </div>

                            <div className="product-bottom">
                              <div className="button-group">
                                <button
                                  onClick={() => handleDelete(wishlistid,imgid)}
                                  className="btn btn-sm btn-border"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
};

export default Wishlist;