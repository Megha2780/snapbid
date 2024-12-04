import React, { useEffect, useState } from "react";
import Navbar from "../Component/Navbar";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const Posts = () => {
  const [fdata, setFdata] = useState({});
  const uid = localStorage.getItem("id");
  const fetchdata = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/followers/${uid}`
      );
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.statusText);
      }
      const responseData = await response.json();
      setFdata(responseData);
      console.log("data are", fdata);
    } catch (err) {
      console.error(err);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Options for formatting the date
    const options = {
      year: "numeric",
      month: "short", // Change this to 'long' for full month name
      day: "2-digit",
      // hour: "2-digit",
      // minute: "2-digit",
      // second: "2-digit",
      hour12: true, // Change to false for 24-hour format
      // timeZoneName: "short", // Remove this line if you don't want to display timezone
    };
    return date.toLocaleString("en-US", options);
  };
  useEffect(() => {
    fetchdata();
  });
  return (
    <>
      <Navbar />
      {/* <div className="author-area">
        <div
          className="author-cover"
          data-bg-img="assets/img/bg/author-cover.png"
        ></div>
      </div> */}
      <section className="pt-120 pb-120">
        <div className="container">
          <div className="row">
            {Array.isArray(fdata) &&
              fdata.map((datas) => {
                return (
                  <div className="col-xl-4 col-md-6">
                    <div className="single-post-item">
                      <Link className="link" to="blog-details.html">
                        <img
                          src={datas.imgurl}
                          style={{
                            width: "415px",
                            height: "519px",
                            objectFit: "cover",
                          }}
                          alt=""
                        />
                      </Link>
                      <div className="post-content">
                        <h5 className="post-title">{datas.imgname}</h5>
                        <p>{datas.description}</p>
                        <ul className="meta">
                          <li>
                            <Link className="link" to={`/data/${datas.imgid}`}>
                              <img src="assets/img/media/blog-by.png" alt="" />{" "}
                              by {datas.username}
                            </Link>
                          </li>
                          <li>
                            <Link className="link" to="blog-details.html">
                              {formatDate(datas.addedDt)}
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* <div className="col-xl-4 col-md-6">
              <div className="single-post-item">
                <Link className="link" to="blog-details.html">
                  <img src="assets/img/product/product4.png" alt="" />
                </Link>
                <div className="post-content">
                  <Link to="blog-details.html" className="category link">
                    artwork
                  </Link>
                  <h5 className="post-title">Colorful Abstract Painting</h5>
                  <p>
                    Anefty are non-fungible tokens. they are unique items that
                    you can't replace with something as each other.
                  </p>
                  <ul className="meta">
                    <li>
                      <Link className="link" to="blog-details.html">
                        <img src="assets/img/media/blog-by.png" alt="" /> by
                        ANEFTY
                      </Link>
                    </li>
                    <li>
                      <Link className="link" to="blog-details.html">
                        Oct 27,2021
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="single-post-item">
                <Link className="link" to="blog-details.html">
                  <img src="assets/img/product/product6.png" alt="" />
                </Link>
                <div className="post-content">
                  <Link to="blog-details.html" className="category link">
                    trypaint
                  </Link>
                  <h5 className="post-title">Animal Girl Painting</h5>
                  <p>
                    Anefty are non-fungible tokens. they are unique items that
                    you can't replace with something as each other.
                  </p>
                  <ul className="meta">
                    <li>
                      <Link className="link" to="blog-details.html">
                        <img src="assets/img/media/blog-by.png" alt="" /> by
                        ANEFTY
                      </Link>
                    </li>
                    <li>
                      <Link className="link" to="blog-details.html">
                        Oct 25,2021
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="single-post-item">
                <Link className="link" to="blog-details.html">
                  <img src="assets/img/product/product8.png" alt="" />
                </Link>
                <div className="post-content">
                  <Link to="blog-details.html" className="category link">
                    Colorpaint
                  </Link>
                  <h5 className="post-title">Horrotic Painting</h5>
                  <p>
                    Anefty are non-fungible tokens. they are unique items that
                    you can't replace with something as each other.
                  </p>
                  <ul className="meta">
                    <li>
                      <Link className="link" to="blog-details.html">
                        <img src="assets/img/media/blog-by.png" alt="" /> by
                        ANEFTY
                      </Link>
                    </li>
                    <li>
                      <Link className="link" to="blog-details.html">
                        Oct 23,2021
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="single-post-item">
                <Link className="link" to="blog-details.html">
                  <img src="assets/img/product/product17.png" alt="" />
                </Link>
                <div className="post-content">
                  <Link to="blog-details.html" className="category link">
                    painting
                  </Link>
                  <h5 className="post-title">Colorful Abstract Painting</h5>
                  <p>
                    Anefty are non-fungible tokens. they are unique items that
                    you can't replace with something as each other.
                  </p>
                  <ul className="meta">
                    <li>
                      <Link className="link" to="blog-details.html">
                        <img src="assets/img/media/blog-by.png" alt="" /> by
                        ANEFTY
                      </Link>
                    </li>
                    <li>
                      <Link className="link" to="blog-details.html">
                        Oct 21,2021
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="single-post-item">
                <Link className="link" to="blog-details.html">
                  <img src="assets/img/product/product5.png" alt="" />
                </Link>
                <div className="post-content">
                  <Link to="blog-details.html" className="category link">
                    Colorpaint
                  </Link>
                  <h5 className="post-title">Liquid Forest Princess</h5>
                  <p>
                    Anefty are non-fungible tokens. they are unique items that
                    you can't replace with something as each other.
                  </p>
                  <ul className="meta">
                    <li>
                      <Link className="link" to="blog-details.html">
                        <img src="assets/img/media/blog-by.png" alt="" /> by
                        ANEFTY
                      </Link>
                    </li>
                    <li>
                      <Link className="link" to="blog-details.html">
                        Oct 18,2021
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-12 d-flex justify-content-center mt-30">
              <Link to="#" className="btn link">
                <img
                  src="assets/img/icons/btn-loadmore.svg"
                  alt=""
                  className="svg"
                />{" "}
                Load More
              </Link>
            </div> */}
          </div>
        </div>
      </section>
      {/* <div className="insta_feed mt-n2 mb-2 ovx-hidden">
        <Link to="https://www.instagram.com/" className="btn link">
          <img
            src="assets/img/icons/btn-instagram.svg"
            alt=""
            className="svg"
          />
          instagram
        </Link>
        <ul className="row g-2">
          <li className="col-lg col-sm-4 col-6">
            <Link to="https://www.instagram.com/" className="d-block link">
              <img src="assets/img/media/insta1.png" alt="" />
            </Link>
          </li>
          <li className="col-lg col-sm-4 col-6">
            <Link to="https://www.instagram.com/" className="d-block link">
              <img src="assets/img/media/insta2.png" alt="" />
            </Link>
          </li>
          <li className="col-lg col-sm-4 col-6">
            <Link to="https://www.instagram.com/" className="d-block link">
              <img src="assets/img/media/insta3.png" alt="" />
            </Link>
          </li>
          <li className="col-lg col-sm-4 col-6">
            <Link to="https://www.instagram.com/" className="d-block link">
              <img src="assets/img/media/insta4.png" alt="" />
            </Link>
          </li>
          <li className="col-lg col-sm-4 col-6">
            <Link to="https://www.instagram.com/" className="d-block link">
              <img src="assets/img/media/insta5.png" alt="" />
            </Link>
          </li>
          <li className="col-lg col-sm-4 col-6">
            <Link to="https://www.instagram.com/" className="d-block link">
              <img src="assets/img/media/insta6.png" alt="" />
            </Link>
          </li>
        </ul>
      </div> */}
    </>
  );
};

export default Posts;
