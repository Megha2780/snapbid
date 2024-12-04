import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import bg from "../assets/images/author-cover.png";

const AuctionDetails = () => {
  const { auctionid } = useParams();
  const [data, setData] = useState({});
  const [formdata, setFormdata] = useState({});
  const [formdata2, setFormdata2] = useState({});
  const [bids, setBids] = useState({});
  const uid = localStorage.getItem("id");
  const [loading, setLoading] = useState(true);
  const [maxprc, setmaxprc] = useState(0);
  const [aucend, setEnded] = useState(false);
  const [bidUid, setBidUid] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (Array.isArray(bids) && bids.length > 0) {
      setBidUid(bids[0].userid);
    }
  }, [bids]);
  const fetchData = async () => {
    try {
      if (!auctionid) {
        console.error("ID NOT FOUND");
        return;
      }
      const response = await fetch(
        `http://localhost:5000/api/aucdetails/${auctionid}`
      );
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.statusText);
      }
      const responseData = await response.json();
      setData(responseData);
      setLoading(false);
      // console.log(responseData);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchBid = async () => {
    try {
      if (!auctionid) {
        console.error("ID NOT FOUND");
        return;
      }
      const response = await fetch(
        `http://localhost:5000/api/biddata/${auctionid}`
      );
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.statusText);
      }
      const responseData = await response.json();
      setBids(responseData);
      setLoading(false);
      // console.log(responseData);
    } catch (err) {
      console.error(err);
    }
  };

  const maxprice = async () => {
    try {
      if (!auctionid) {
        console.error("ID NOT FOUND");
        return;
      }
      const response = await fetch(
        `http://localhost:5000/api/maxbid/${auctionid}`
      );
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.statusText);
      }
      const responseData2 = await response.json();
      setFormdata2(responseData2);
      setLoading(false);
      // console.log(responseData2.maxprice);
      setmaxprc(responseData2.maxprice);
      // console.log(maxprc);
      return responseData2.maxprice;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchBid();
    // bidIns();
    const interval = setInterval(() => {
      updateRemainingTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Removed data and fetchData from dependencies

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
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
      return {
        ...prevData,
        remainingTime: calculateTimeRemaining(prevData.endDate),
      };
    });
  };

  const UpdateBid = async () => {
    if (!auctionid) {
      console.error("ID NOT FOUND");
      return;
    }
    const mxprc = formdata.bidprice; // Use updated bid price directly
    const response = await fetch(
      `http://localhost:5000/api/updbid/${auctionid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auctionAmount: mxprc }),
      }
    );
    if (!response.ok) {
      console.error(response.status);
    } else {
      console.log(response.status);
    }
  };
  const updstatus = async () => {
    if (!auctionid) {
      console.error("ID NOT FOUND");
      return;
    }
    if (new Date(data.endDate).getTime() <= new Date().getTime()) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/updstatus/${auctionid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ endstatus: "true", ownerid: bidUid }),
          }
        );
        if (!response.ok) {
          console.error(response.status);
        } else {
          console.log(response.status);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dt = new Date().getTime();

    try {
      if (parseInt(formdata.bidprice) <= parseInt(data.auctionAmount)) {
        alert("Can't Bid Entered Amount Is Lower Than Min Bid");
      } else {
        const response = await fetch("http://localhost:5000/api/bidins", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auctionid: data.auctionid,
            imgid: data.imgid,
            userid: uid,
            bidprice: formdata.bidprice,
            bidtime: dt,
          }),
        });
        if (!response.ok) {
          throw new Error("HTTP ERROR : " + response.status);
        }
        const responseData = await response.json();
        alert("Bid Posted");
        // Update UI with new bid amount
        setData((prevData) => ({
          ...prevData,
          auctionAmount: responseData.newBidAmount, // Assuming the server returns newBidAmount after bid is posted
        }));
        // Reset the form data after successful submission
        setFormdata({});
        // Update bid after successful submission
        UpdateBid();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const addWinner = async () => {
    if (new Date(data.endDate).getTime() <= new Date().getTime()) {
      setEnded(true);
    }
  };

  useEffect(() => {
    fetchBid();
    maxprice();
    addWinner();
    // update status after successfull submission
    updstatus();
  });
  return (
    <>
      <Navbar />
      {loading ? ( // Render loading UI if loading is true
        <div>Loading...</div>
      ) : (
        <section
          className={
            new Date(data.endDate).getTime() < new Date().getTime()
              ? "pt-120 pb-120 position-relative"
              : "pt-120 pb-120"
          }
        >
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-lg-6 order-1 order-lg-0">
                <div className="item-details ov-hidden">
                  <h2 className="product-title">{data.imgname}</h2>

                  <div className="favorites">
                    <div
                      className="border-1 border  rounded-pill p-1 pe-2 d-flex align-items-center"
                      style={{ borderColor: "rgba(255,255,255,0.5)" }}
                    >
                      <div className=" style--two">
                        <img
                          src={data.profilephoto}
                          style={{
                            width: "30px",
                            height: "30px",
                            objectFit: "cover",
                          }}
                          className="rounded-circle me-2 "
                        ></img>
                      </div>
                      <div className="love-count text-white text-capitalize">
                        {data.username}
                      </div>
                    </div>
                  </div>
                  <p className="text-capitalize">{data.description}</p>
                  <div className="row pt-1">
                    <div className="col-sm-6">
                      <div className="price mb-4 mb-sm-0">
                        <h6>Bid Amount</h6>
                        <h3 className="c1">₹{data.auctionAmount}</h3>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="countdown-wrapper">
                        <h6>Countdown</h6>
                        <ul className="countdown">
                          <li>
                            <span className="hours">
                              {calculateTimeRemaining(data.endDate).days}
                            </span>
                          </li>
                          <li className="ms-1 me-1">
                            {calculateTimeRemaining(data.endDate).days > 1
                              ? "Days, "
                              : "Day, "}
                          </li>
                          <li>
                            <span className="hours">
                              {calculateTimeRemaining(data.endDate).hours}
                            </span>
                            h
                          </li>
                          <li className="ms-1 me-1">:</li>
                          <li>
                            <span className="hours">
                              {calculateTimeRemaining(data.endDate).minutes}m
                            </span>
                          </li>
                          <li className="ms-1 me-1">:</li>
                          <li>
                            <span className="hours">
                              {calculateTimeRemaining(data.endDate).seconds}s
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      new Date(data.endDate).getTime() < new Date().getTime()
                        ? "d-none"
                        : "d-block"
                    }
                  >
                    <div className="row mb-4 mt-30 pt-2">
                      <div className="col-sm-6">
                        {data.userid == uid ? (
                          ""
                        ) : (
                          <div className="item-price2">
                            <h6>Add Your Bid :</h6>
                            <form onSubmit={(e) => handleSubmit(e)}>
                              <div className="item-price-inner align-items-center d-flex justify-content-between">
                                <h6 className="mb-0">Amount</h6>
                                <input
                                  type="number"
                                  onChange={(e) => handleChange(e)}
                                  name="bidprice"
                                  style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                                  className="mb-0 border-white rounded border-0 p-1"
                                ></input>
                              </div>
                              {token == null ? (
                                <Link to={"/login"}>
                                  <div className="button-group style--two">
                                    <input
                                      type="submit"
                                      className="btn btn-sm"
                                      value={"place Bid"}
                                    ></input>
                                  </div>
                                </Link>
                              ) : (
                                <div className="button-group style--two">
                                  <input
                                    type="submit"
                                    className="btn btn-sm"
                                    value={"place Bid"}
                                  ></input>
                                </div>
                              )}
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row mb-4 mt-40 pt-1">
                    <div className="col-sm-6">
                      <a
                        href="profile.html"
                        className="hz-profile creator media mb-4 mb-sm-0"
                      >
                        <div className="avatar">
                          <img
                            src={data.profilephoto}
                            className="rounded-circle"
                            style={{ width: "40px", height: "40px" }}
                            alt=""
                          />
                        </div>
                        <div className="content media-body">
                          <h6>Owner</h6>
                          <h5 className="text-capitalize">{data.username}</h5>
                        </div>
                      </a>
                    </div>
                  </div>
                  <ul className="nav tab-buttons style--two">
                    <li>
                      <button data-bs-toggle="tab" data-bs-target="#bids">
                        Bids
                      </button>
                    </li>
                  </ul>
                  <div className="container">
                    {Array.isArray(bids) &&
                      bids.map(
                        ({ bidid, username, imgname, bidprice, bidtime }) => {
                          return (
                            <div className="card my-2" key={bidid}>
                              <div className="card-body p-2">
                                <h4
                                  className={
                                    maxprc === bidprice
                                      ? "card-title c1 h1 anim-text"
                                      : "card-title "
                                  }
                                >
                                  ₹{bidprice}
                                </h4>
                                <p
                                  className={
                                    maxprc === bidprice
                                      ? "card-title anim-text"
                                      : "card-title "
                                  }
                                >
                                  <span className="text-capitalize">
                                    {username}
                                  </span>
                                  <br />
                                  {formatTime(bidtime)}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      )}
                  </div>
                </div>
              </div>
              <div className="col-xl-5 col-lg-6 order-0 order-lg-1">
                <div className="item-details-img mb-5 mb-lg-0">
                  <img
                    src={data.imgurl}
                    style={{
                      width: "526px",
                      height: "680px",
                      objectFit: "cover",
                    }}
                    className="rounded w-100 object-fit-cover"
                  ></img>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              new Date(data.endDate).getTime() < new Date().getTime()
                ? "w-100 h-100 position-absolute top-0"
                : "d-none"
            }
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="w-100 h-100 position-relative">
              <div className="position-absolute top-50 start-50 translate-middle text-center">
                {bids && bids.length > 0 && bids[0] && bids[0].username ? (
                  <>
                    <h1 className="text-light">
                      <span className="c1">{bids[0].username}</span> Won Auction
                      At <span className="c1">₹{bids[0].bidprice}</span>
                    </h1>
                    <hr />
                  </>
                ) : null}
                <h1 className="text-light display-1">Auction Ended</h1>
              </div>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
};

const formatTime = (bidtime) => {
  const date = new Date(bidtime);

  // Format the date components
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  // Format the time components
  let hours = date.getHours();
  const amPM = hours < 12 ? "AM" : "PM";
  hours = (hours % 12 || 12).toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // Construct the formatted date and time string
  const formattedTime = `${hours}:${minutes}:${seconds} ${amPM} ${year}-${month}-${day}`;

  return formattedTime;
};

export default AuctionDetails;
