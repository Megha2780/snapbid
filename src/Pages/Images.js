import React, { useEffect, useState } from "react";
import Navbar from "../Component/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faHeart,
  faRupee,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import Footer from "../Component/Footer";
import wm from "../assets/images/watermark.png";
import tmpimg from "../assets/images/author-cover.png";

const Images = () => {
  const { imgid } = useParams();
  const uid = localStorage.getItem("id");
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term
  const [tempImg, setTempImg] = useState(
    "https://pixsector.com/cache/517d8be6/av5c8336583e291842624.png"
  );
  const [loading, setLoading] = useState(true); // Add loading state
  const [heartClicked, setHeartClicked] = useState({}); // State to track clicked hearts

  const handleWishlist = async (imgid) => {
    console.log(imgid);
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: uid,
          imgid: imgid,
        }),
      });
      if (!response.ok) {
        throw new Error("HTTP ERROR : " + response.status);
      }
      const data2 = await response.json(); // Corrected: Access response.json()
      console.log(data2);
      if (data2.error) {
        console.error(data2.error); 
      } else {
        setHeartClicked({ ...heartClicked, [imgid]: true }); // Set heart as clicked for this imgid
        localStorage.setItem("heartClicked", JSON.stringify({ ...heartClicked, [imgid]: true }));
        localStorage.removeItem(heartClicked);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const countviews = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/countview/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ totalviews: 1 }), // Increment by 1 for each view
        }
      );
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.statusText);
      }
      const responseData = await response.json();
      setData(responseData);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateDiscountedPrice = (mrp, discount) => {
    const mrpValue = parseFloat(mrp);
    const discountValue = parseFloat(discount);
    const discountedPrice = mrpValue - (mrpValue * discountValue) / 100;
    return discountedPrice.toFixed(0);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/disimg");
      if (!response.ok) {
        throw new Error("HTTP error" + response.status);
      }
      const data = await response.json();
      setData(data);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    try {
      const response = await fetch(
        `http://localhost:5000/api/search?q=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("HTTP error" + response.status);
      }
      const searchData = await response.json();
      setData(searchData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchData();
    const heartStorage = localStorage.getItem("heartClicked");
    if (heartStorage) {
      setHeartClicked(JSON.parse(heartStorage));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <form
          className="search-form d-none d-sm-block ms-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="form-group">
            <button type="submit">
              <FontAwesomeIcon icon={faSearch} className="text-light" />
            </button>
            <input
              type="text"
              className="form-control mb-0 text-light"
              placeholder="Search Snaps....."
              value={searchTerm}
              onChange={handleSearch} // Trigger search on input change
            />
          </div>
        </form>
        <div className="grid row">
          {Array.isArray(data) &&
            data.map(
              ({
                imgid,
                imgname,
                imgurl,
                profilephoto,
                username,
                mrp,
                discount,
                subcatname,
                userid,
              }) => (
                <div
                  key={imgid}
                  className="col-md-3 col-lg-3 element-item artwork memes"
                >
                  <div onClick={() => countviews(imgid)}>
                    <div className="single-product style--two mb-30">
                      <Link
                        to={`/data/${imgid}`}
                        className="product-img position-relative overflow-hidden"
                      >
                        <img
                          src={wm}
                          alt=""
                          className="w-100 object-fit-cover position-absolute "
                          style={{
                            height: "200px",
                            zIndex: "1",
                            filter: "invert(1)",
                            opacity: "0.0",
                          }}
                        ></img>
                        <img
                          src={imgurl == null ? tempImg : imgurl}
                          alt=""
                          className="w-100 object-fit-cover top-0"
                          style={{ height: "200px" }}
                        ></img>
                        <img
                          src={wm == null ? tempImg : wm}
                          alt=""
                          className="w-100 object-fit-cover position-absolute start-0"
                          style={{
                            height: "200px",
                            zIndex: "1",
                            filter: "invert(1)",
                            opacity: "0.1",
                          }}
                        ></img>
                      </Link>
                      <div
                        className="product-content"
                        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                      >
                        <div className="owners" style={{ zIndex: "999999" }}>
                          <img
                            style={{ width: "50px", height: "50px" }}
                            src={profilephoto}
                            className="object-fit-cover border-3 border rounded-circle"
                            alt="image"
                          />
                        </div>

                        <div className="product-top">
                          <h5 className="text-capitalize">{imgname}</h5>
                          <h6>{subcatname}</h6>
                          <div className="d-flex justify-content-between align-items-center">
                            <Link
                              to={`/userprofile/${userid}`}
                              className="text-decoration-none text-black"
                            >
                              <h6 className="c1 fs-6 mt-3 text-capitalize">
                                By, {username}
                              </h6>
                            </Link>
                          </div>
                        </div>
                        <div className="product-bottom">
                          <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center ml-n2">
                              <div className="px-2 py-0 style--two">
                                <FontAwesomeIcon
                                  icon={faHeart}
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent event propagation
                                    handleWishlist(imgid);
                                  }}
                                  style={{ color: heartClicked[imgid] ? "red" : "" }} // Conditional styling for heart
                                />
                              </div>
                              <div className="love-count">
                                <big className={mrp == 0 ? "d-none" : ""}>
                                  ₹ {calculateDiscountedPrice(mrp, discount)}
                                </big>
                                <big className={mrp == 0 ? "" : "d-none"}>
                                  Free
                                </big>
                                <small
                                  className={
                                    mrp == 0
                                      ? "d-none "
                                      : "badge bg-success fw-normal ms-2"
                                  }
                                >
                                  {discount}% off
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Images;