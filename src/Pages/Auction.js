import React, { useState, useEffect } from "react";
import Navbar from "../Component/Navbar";
import wm from "../assets/images/watermark.png";
import { Link, useParams } from "react-router-dom";
import tmpimg from "../assets/images/author-cover.png";
import Footer from "../Component/Footer";
const Auction = () => {
  const [data, setData] = useState([]);
  const uid = localStorage.getItem("id");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auctionDisplay"
        );
        if (!response.ok) {
          throw new Error("HTTP error" + response.status);
        }
        const auctionData = await response.json();
        setData(auctionData);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      updateRemainingTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to calculate time remaining between start date and end date
  const calculateTimeRemaining = (endDate) => {
    const endTime = new Date(endDate);
    const currentTime = new Date();
    const timeDiff = endTime - currentTime;

    if (timeDiff > 0) {
      const remainingDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const remainingHours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const remainingMinutes = Math.floor(
        (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
      );
      const remainingSeconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      return {
        days: remainingDays,
        hours: remainingHours,
        minutes: remainingMinutes,
        seconds: remainingSeconds,
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }; // If auction has ended
  };
  const updateRemainingTime = () => {
    setData((prevData) => {
      return prevData.map((item) => {
        return { ...item, remainingTime: calculateTimeRemaining(item.endDate) };
      });
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Options for formatting the date
    const options = {
      year: "numeric",
      month: "short", // Change this to 'long' for full month name
      day: "2-digit",
      hour12: true, // Change to false for 24-hour format
    };
    return date.toLocaleString("en-US", options);
  };
  return (
    <>
      <Navbar />

      <div className="container pt-4">
        <div className="tab-content">
          <div className="tab-pane fade show active" id="collected">
            <div className="row">
              {data.map((item, index) => (
                <Link
                  to={`/aucdetails/${item.auctionid}`}
                  className={
                    new Date(item.endDate).getTime() < new Date().getTime()
                      ? "col-lg-3 col-md-6 my-2"
                      : "col-lg-3 col-md-6 my-2 position-relative"
                  }
                  style={
                    new Date(item.endDate).getTime() < new Date().getTime()
                      ? { filter: "grayscale(1)" }
                      : { filter: "grayscale(0)" }
                  }
                  key={item.auctionid}
                >
                  <div className="single-product style--two">
                    <div className="product-img position-relative">
                      <img
                        src={wm}
                        alt=""
                        className="w-100 object-fit-cover position-absolute top-0"
                        style={{
                          height: "200px",
                          zIndex: "1",
                          filter: "invert(1)",
                          opacity: "0.35",
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
                          opacity: "0.40",
                        }}
                      ></img>
                      <img
                        src={item.imgurl == null ? tmpimg : item.imgurl}
                        alt=""
                        className="w-100 object-fit-cover"
                        style={{ height: "200px" }}
                      ></img>
                    </div>
                    <div
                      className="product-content"
                      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                    >
                      <div className="product-top">
                        <h5 className="text-capitalize">{item.imgname}</h5>
                        <div className="d-flex justify-content-between">
                          <h6 className="c1 fs-5">₹{item.auctionAmount}</h6>
                          <div>
                            <h6>
                              <ul className="countdown">
                                <li>
                                  <span className="hours">
                                    {calculateTimeRemaining(item.endDate).days}
                                  </span>
                                </li>
                                <li className="ms-1 me-1">
                                  {calculateTimeRemaining(item.endDate).days > 1
                                    ? "Days, "
                                    : "Day, "}
                                </li>
                                <li>
                                  <span className="hours">
                                    {calculateTimeRemaining(item.endDate).hours}
                                  </span>
                                  h
                                </li>
                                <li className="ms-1 me-1">:</li>
                                <li>
                                  <span className="hours">
                                    {
                                      calculateTimeRemaining(item.endDate)
                                        .minutes
                                    }
                                    m
                                  </span>
                                </li>
                                <li className="ms-1 me-1">:</li>
                                <li>
                                  <span className="hours">
                                    {
                                      calculateTimeRemaining(item.endDate)
                                        .seconds
                                    }
                                    s
                                  </span>
                                </li>
                              </ul>
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="product-bottom">
                        <div className="d-flex justify-content-between">
                          <div className="countdown-wrap">
                            <h6 style={{ fontSize: "10px" }}>
                              End On : {formatDate(item.endDate)}
                            </h6>
                          </div>
                          {item.userid != uid ? (
                            <Link
                              to={`/aucdetails/${item.auctionid}`}
                              className={
                                new Date(item.endDate).getTime() <
                                new Date().getTime()
                                  ? "d-none"
                                  : "btn btn-border btn-sm"
                              }
                            >
                              <img
                                src="assets/img/icons/judge-icon.svg"
                                alt=""
                                className="svg"
                              ></img>
                              Place Bid
                            </Link>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      new Date(item.endDate).getTime() < new Date().getTime()
                        ? "position-absolute top-0 h-100 d-flex justify-content-center align-items-center"
                        : "d-none"
                    }
                    style={{
                      zIndex: "9999999",
                      backgroundColor: "rgba(0,0,0,.5)",
                      width: "93%",
                      borderRadius: "20px",
                    }}
                  >
                    <h1
                      className="text-center text-light"
                      style={{ transform: "rotate(-45deg)" }}
                    >
                      AUCTION ENDED
                    </h1>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Auction;
