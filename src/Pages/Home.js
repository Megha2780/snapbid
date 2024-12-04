import React, { useEffect, useState } from "react";
import Navbar from "../Component/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart, faRupee } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import Footer from "../Component/Footer";
import wm from "../assets/images/watermark.png";
import tmpimg from "../assets/images/author-cover.png";

const Home = () => {
  const { imgid } = useParams();
  const uid = localStorage.getItem("id");
  const [data, setData] = useState(null);
  const [photographer, setPhotographer] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/dishomeimg");
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
  const DisplayPhotographer = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/disphoto/${uid}`);
      if (!response.ok) {
        throw new Error("HTTP error" + response.status);
      }
      const Photographer = await response.json();
      setPhotographer(Photographer);
      // setLoading(false);
      console.log(photographer);
    } catch (err) {
      console.error(err.message);
    }
  };
  const calculateDiscountedPrice = (mrp, discount) => {
    const mrpValue = parseFloat(mrp);
    const discountValue = parseFloat(discount);
    const discountedPrice = mrpValue - (mrpValue * discountValue) / 100;
    return discountedPrice.toFixed(0);
  };
  const handlesubmit = async (e, userid) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/followins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followersid: uid,
          userid: userid,
        }),
      });
      if (!response.ok) {
        throw new Error("HTTP ERROR : " + response.status);
      } else {
        const response2 = await fetch("http://localhost:5000/api/messageins", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: userid,
            ntitle: "You have new follower",
            ntype: 1,
          }),
        });
        if (!response2.ok) {
          throw new Error("HTTP ERROR : " + response2.status);
        }
        const data2 = await response2.data2;
        if (data2.error) {
          console.error(data2.error);
        }
      }
      const data = await response.data;
      if (data.error) {
        console.error(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchData();
    DisplayPhotographer();
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div
        className="banner layer style--three overlay ov-hidden"
        data-bg-img="assets/img/bg/banner-bg4.png"
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="banner-content text-white mb-5 mb-lg-0">
                <h5>you won’t believe your eyes</h5>
                <h1>
                  Digital Collection & Sell on <span>SnapBid</span>
                </h1>
                <p>
                  SnapBid, we’re excited about brand new type of digital good
                  called a non fungible tokens We’re proud to be the first and
                  largest marketplace for Images.
                </p>
                <ul className="list-info text-white">
                  <li>
                    <h4>
                      <span className="counter">3</span>k
                      <span className="c1">+</span>
                    </h4>
                    <h6>Artwork</h6>
                  </li>
                  <li>
                    <h4>
                      <span className="counter">9</span>k
                      <span className="c1">+</span>
                    </h4>
                    <h6>Auction</h6>
                  </li>
                  <li>
                    <h4>
                      <span className="counter">6</span>k
                      <span className="c1">+</span>
                    </h4>
                    <h6>Artist</h6>
                  </li>
                </ul>
                <div className="button-group flex-column flex-sm-row align-items-start align-items-sm-center">
                  <Link to={"/collections"} className="btn mb-3 mb-sm-0">
                    <img
                      src="assets/img/icons/discover.svg"
                      alt=""
                      className="svg"
                    />{" "}
                    Explore Images
                  </Link>
                  <Link to={"/auction"} className="btn btn-border">
                    <img
                      src="assets/img/icons/bid.svg"
                      alt=""
                      className="svg"
                    />{" "}
                    Place a bid
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="banner-img move-img">
                <a
                  href="https://www.youtube.com/watch?v=gfGuPd1CELo"
                  className="vdo_btn popup-video ms-xl-4"
                >
                  <img
                    src="assets/img/icons/play2.svg"
                    alt=""
                    className="svg"
                  />
                </a>
                <img
                  src="assets/img/media/banner-big-img.png"
                  className="ms-xl-4"
                  alt=""
                />
                <div className="banner-small-img d-none d-md-block">
                  <img src="assets/img/media/banner-small-img.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="pt-120 pb-90 section-bg">
        <div className="container">
          <div className="row">
            <div className="col-xl-4">
              <div className="section-title style--two d-flex align-items-center justify-content-between">
                <h2 className="text-white">Snaps</h2>
              </div>
            </div>
            <div className="col-xl-8 mb-30 mb-xl-0">
              <div className="d-flex align-items-center flex-wrap justify-content-center justify-content-lg-between justify-content-xl-end">
                <Link
                  to={"/collections"}
                  className="btn btn-sm ms-3 d-none d-lg-inline-flex"
                >
                  <img
                    src="assets/img/icons/view-all.svg"
                    alt=""
                    className="svg"
                  />{" "}
                  View All
                </Link>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="grid row">
              {data &&
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
                    <Link
                      to={`/data/${imgid}`}
                      key={imgid}
                      className="col-md-3 col-lg-3 element-item artwork memes"
                    >
                      <div onClick={() => countviews(imgid)}>
                        <div className="single-product style--two mb-30">
                          <div className="product-img position-relative">
                            <img
                              src={wm}
                              alt=""
                              className="w-100 object-fit-cover position-absolute top-0"
                              style={{
                                height: "200px",
                                zIndex: "1",
                                filter: "invert(1)",
                                opacity: "0.08",
                              }}
                            ></img>
                            <img
                              src={wm}
                              alt=""
                              className="w-100 object-fit-cover position-absolute top-0"
                              style={{
                                height: "200px",
                                zIndex: "1",
                                filter: "invert(1)",
                                opacity: "0.08",
                              }}
                            ></img>
                            <img
                              src={imgurl == null ? tmpimg : imgurl}
                              alt=""
                              className="w-100 object-fit-cover"
                              style={{ height: "200px" }}
                            ></img>
                          </div>
                          <div
                            className="product-content"
                            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                          >
                            <div
                              className="owners"
                              style={{ zIndex: "999999" }}
                            >
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
                                    ></FontAwesomeIcon>
                                  </div>
                                  <div className="love-count">
                                    <big className={mrp == 0 ? "d-none" : ""}>
                                      ₹{" "}
                                      {calculateDiscountedPrice(mrp, discount)}
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
                    </Link>
                  )
                )}
            </div>
          </div>

          <div className="row">
            <div className="col-12 d-lg-none text-center mb-30">
              <a href="explore.html" className="btn btn-sm ms-3">
                <img
                  src="assets/img/icons/view-all.svg"
                  alt=""
                  className="svg"
                />{" "}
                View All
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-sm-8">
              <div className="section-title style--two">
                <h2 className="text-white">Popular Photographers</h2>
              </div>
            </div>
            
          </div>
          <div className="row">
            <div className="col-12">
              <div
                className="swiper"
                data-swiper-loop="true"
                data-swiper-items="4"
                data-swiper-margin="30"
                data-swiper-breakpoints='{"0": {"slidesPerView": "1"},"420": {"slidesPerView": "2"}, "768": {"slidesPerView": "3"}, "992": {"slidesPerView": "4"}, "1200": {"slidesPerView": "5"}, "1400": {"slidesPerView": "6"}}'
              >
                <div className="swiper-wrapper d-flex">
                  {Array.isArray(photographer) &&
                    photographer.map(
                      (photographerData) =>
                        photographerData.userid !== parseInt(uid) ? (
                          <div
                            className="swiper-slide"
                            style={{ width: "191px", marginRight: "30px" }}
                          >
                            <div
                              className="featured-artists"
                              key={photographerData.userid}
                            >
                              <div className="tp-img">
                                <img
                                  src={photographerData.coverphoto}
                                  style={{
                                    width: "191px",
                                    height: "110px",
                                    objectFit: "cover",
                                  }}
                                  alt=""
                                />
                              </div>
                              <div className="artists-content text-center">
                                <div className="user-avatar">
                                  <img
                                    src={photographerData.profilephoto}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "cover",
                                    }}
                                    alt=""
                                  />
                                </div>
                                <h5 className="text-white">
                                  {photographerData.username}
                                </h5>
                                {photographerData.userid !== uid ? (
                                  <input
                                    type="submit"
                                    onClick={(e) =>
                                      handlesubmit(e, photographerData.userid)
                                    }
                                    className="mx-auto d-block btn btn-follow"
                                    value={"+ Follow"}
                                  ></input>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-sm-8">
              <div className="section-title style--two text-white">
                <h2>Browse Category</h2>
              </div>
            </div>
            <div className="col-sm-4 d-none d-sm-block">
              <div className="swiper-nav">
                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div
                className="swiper live-auction"
                data-swiper-loop="true"
                data-swiper-items="4"
                data-swiper-margin="30"
                data-swiper-breakpoints='{"0": {"slidesPerView": "1"}, "768": {"slidesPerView": "2"}, "992": {"slidesPerView": "3"}}'
              >
                <div className="swiper-wrapper">
                  <div
                    className="swiper-slide"
                    style={{ width: "412px", marginRight: "30px" }}
                  >
                    <a href="explore.html" className="category-item">
                      <img src="assets/img/media/cat1.png" alt="" />
                      <div className="content">
                        <img src="assets/img/media/cat-s1.png" alt="" />
                        <h5>Art Images</h5>
                      </div>
                    </a>
                  </div>
                  <div
                    className="swiper-slide"
                    style={{ width: "412px", marginRight: "30px" }}
                  >
                    <a href="explore.html" className="category-item">
                      <img src="assets/img/media/cat2.png" alt="" />
                      <div className="content">
                        <img src="assets/img/media/cat-s2.png" alt="" />
                        <h5>Trading Images</h5>
                      </div>
                    </a>
                  </div>
                  <div
                    className="swiper-slide"
                    style={{ width: "412px", marginRight: "30px" }}
                  >
                    <a href="explore.html" className="category-item">
                      <img src="assets/img/media/cat3.png" alt="" />
                      <div className="content">
                        <img src="assets/img/media/cat-s3.png" alt="" />
                        <h5>Virtual Images</h5>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <Footer />
    </>
  );
};

export default Home;
