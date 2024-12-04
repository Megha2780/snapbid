import React, { useState, useEffect } from "react";
import "../css/main.scss";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Component/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faRupee } from "@fortawesome/free-solid-svg-icons";

const UserProfile = () => {
  const token = localStorage.getItem("token");
  const puid = useParams();
  const puser = puid.userid;
  const [data, setData] = useState({});
  const [imgs, setImgs] = useState({});
  const uid = localStorage.getItem("id");
  const [bids, setBids] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [payment, setpayment] = useState({});
  const [followData, setFollowData] = useState({});
  const [followings, setfollowings] = useState();
  const [posts, setposts] = useState();
  const [follwers, setfollowers] = useState();
  const [followersData, setFollowersData] = useState({});
  // const [loading, setLoading] = useState(true); // Add loading state
  const photographer = sessionStorage.getItem("photographer");
  console.log("puser is", puser);
  const fetchData = async (uid) => {
    try {
      if (uid == null) {
        console.error("ID NOT FOUND");
        return;
      } else if (puser !== null) {
        const response = await fetch(`http://localhost:5000/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: puser,
          }),
        });
        if (!response.ok) {
          throw new Error("HTTP Error: " + response.statusText);
        }
        const responseData = await response.json();
        setData(responseData[0]);
        console.log(responseData[0]);
      } else {
        const response = await fetch(`http://localhost:5000/api/users`, {
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
        setData(responseData[0]);
        console.log(responseData[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchImg = async (uid) => {
    try {
      if (uid == null) {
        console.error("ID NOT FOUND");
        return;
      } else if (puser !== null) {
        const response = await fetch(`http://localhost:5000/api/users/images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: puser,
          }),
        });
        if (!response.ok) {
          throw new Error("HTTP Error: " + response.statusText);
        }
        const responseData = await response.json();
        setImgs(responseData);
        console.log(responseData);
        console.log("puid is " + data.userid);
      } else {
        const response = await fetch(`http://localhost:5000/api/users/images`, {
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
        setImgs(responseData);
        console.log(responseData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (imgid) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/imgdelete/${imgid}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("HTTP Error : " + response.error);
      }
      const responseData = await response.json();
      console.log(responseData);
    } catch (err) {
      console.error(err);
    }
  };
  const bidDisplay = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bidDisplay/${uid}`
      );
      if (!response.ok) {
        throw new Error("HTTP error" + response.status);
      }
      const Bidsdata = await response.json();
      if (Bidsdata.length > 0) {
        // Check if Bidsdata has any entries
        setBids(Bidsdata);
        console.log("Bidsdata:", Bidsdata);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const handlefollow = async (puser) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/followdisplay/${puser}`
      );
      if (!response.ok) {
        throw new Error("HTTP error" + response.status);
      }
      const followdata = await response.json();
      setFollowData(followdata);
      console.log("Followdata:", followdata);
    } catch (err) {
      console.error(err.message);
    }
  };
  const handlefollowers = async (puser) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/disfollowers/${puser}`
      );
      if (!response.ok) {
        throw new Error("HTTP error" + response.status);
      }
      const followersdata = await response.json();
      setFollowersData(followersdata);
      console.log("Followersdata:", followersdata);
    } catch (err) {
      console.error(err.message);
    }
  };
  const handlePayment = async (amount, imgid, winid, imgurl, imgname) => {
    console.log(amount);
    try {
      const response = await fetch("http://localhost:5000/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: amount }),
      });
      if (!response.ok) {
        throw new Error("Failed to create payment");
      } else {
        const pdata = await response.json();
        setOrderId(pdata.id);
        console.log(pdata);

        const options = {
          key: "rzp_test_zsGgjdiHn7SOm3",
          amount: amount,
          currency: "INR",
          name: bids.imgname,
          description: "Hello World",
          order_id: pdata.id,
          handler: (response) => {
            addOrder(pdata, amount);
            changeOwner(imgid);
            handlpayupd(winid);
            handleDownload(imgid, imgurl, imgname);
          },
          prefill: {
            name: "uname",
            email: "megha@gmail.com",
            contact: "7874345017",
          },
          theme: {
            color: "#fff000",
          },
          payment_method: {
            method: "upi",
            vpa: "meghamegha2879@okicici",
          },
        };
        const paymentWindow = new window.Razorpay(options);
        paymentWindow.on("payment.success", function (response) {
          const paymentId = response.razorpay_payment_id;
          console.log("success", paymentId);
        });
        paymentWindow.open();
      }
    } catch (err) {
      console.error("Error creating payment:", err);
    }
  };
  const changeOwner = async (imgid) => {
    try {
      const response = await fetch("http://localhost:5000/api/owner", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: data.userid,
          imgid: imgid,
        }),
      });

      if (!response.ok) {
        console.error(response.statusText);
      } else {
        const resdata = await response.json();
        console.log(resdata);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const addOrder = async (orderId, amt) => {
    const payDate = new Date();
    console.log(orderId.id);

    try {
      const response = await fetch("http://localhost:5000/api/inspay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: uid,
          orderid: orderId.id,
          paymentDt: payDate,
          paymentAmount: amt / 100,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to insert data into database");
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error("Error inserting data into database:", error);
    }
  };
  const handleDownload = async (imgname, imgurl) => {
    try {
      const response = await fetch(
        `http://localhost:5000/download-image?imageUrl=${encodeURIComponent(
          imgurl
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = imgname;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };
  // console.log("userid is", winid);
  const handlpayupd = async (winid) => {
    try {
      const response = await fetch(`http://localhost:5000/api/updpayment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          winid: winid,
        }),
      });

      if (!response.ok) {
        throw new Error("HTTP Error: " + response.statusText);
      }
      const updpayment = await response.json();
      setpayment(updpayment);
    } catch (err) {
      console.error(err);
    }
  };
  const handleunfollow = async (userid) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/followdelete/${userid}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("HTTP Error : " + response.error);
      }
      const deleteData = await response.json();
      console.log(deleteData);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchtotalfollowings = async (userid) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/totalfollowings/${userid}`
      );
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.statusText);
      }
      const totalfollowings = await response.json();
      setfollowings(totalfollowings.totalfollowings);
      return totalfollowings.totalfollowings;
    } catch (err) {
      console.error(err.message);
    }
  };
  const fetchtotalposts = async (userid) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/totalposts/${userid}`
      );
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.statusText);
      }
      const totalposts = await response.json();
      setposts(totalposts.totalposts);
      return totalposts.totalposts;
    } catch (err) {
      console.error(err.message);
    }
  };
  const fetchtotalfollowers = async (userid) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/totalfollowers/${userid}`
      );
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.statusText);
      }
      const totalfollowers = await response.json();
      setfollowers(totalfollowers.totalfollowers);
      return totalfollowers.totalfollowers;
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    fetchData(uid);
    fetchImg(uid);
  }, [data, imgs]);
  useEffect(() => {
    bidDisplay();
    handlefollow(puser);
    handlefollowers(puser);
  }, [followData, followersData, puser]);
  useEffect(() => {
    fetchtotalfollowings(puser);
    fetchtotalposts(puser);
    fetchtotalfollowers(puser);
  }, [puser]);
  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  return (
    <>
      <Navbar />
      <div className="author-area sep-bottom">
        <img
          className="author-cover author-cover-edit object-fit-cover"
          src={data.coverphoto}
        ></img>
        <div className="author-info">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-3 d-flex justify-content-center justify-content-lg-start">
                <div className="author-profile text-center text-white d-inline-block pb-2 pb-lg-4">
                  <div className="user-avatar">
                    <img
                      src={data.profilephoto}
                      className="object-fit-cover"
                      alt=""
                    />
                  </div>
                  <h5 className="user_name text-white">
                    {data.photographer == "true" ? "Photographer " : ""}
                    {data.username}
                  </h5>
                  <p>{new Date(data.regdate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="d-flex align-items-center mt-10 justify-content-evenly mb-3 mb-lg-0">
                  <h5 className="text-light">
                    Posts:<br></br>
                    <p className="text-center">{posts}</p>
                  </h5>
                  <h5 className="text-light">
                    <button
                      type="button"
                      className="fw-bold text-light"
                      data-bs-toggle="modal"
                      data-bs-target="#followingModal"
                    >
                      Followings:
                    </button>
                    <p className="text-center">{followings}</p>
                  </h5>
                  <h5 className="text-light">
                    <button
                      type="button"
                      className="fw-bold text-light"
                      data-bs-toggle="modal"
                      data-bs-target="#followersModal"
                    >
                      Followers:
                    </button>
                    <p className="text-center">{follwers}</p>
                  </h5>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="d-flex flex-wrap align-items-center mt-10 justify-content-center justify-content-lg-end mb-3 mb-lg-0">
                  <Link
                    to={`/editprofile/${uid}`}
                    className={
                      data.userid != uid ? "d-none" : "btn btn-primary"
                    }
                  >
                    Edit Profile
                  </Link>
                  &nbsp;
                  {photographer == "true" ? (
                    <Link
                      to={`/createitem`}
                      className={
                        data.userid != uid ? "d-none" : "btn btn-primary"
                      }
                    >
                      Add Image
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="followingModal"
        tabIndex="-1"
        aria-labelledby="followingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content w-75">
            <div className="modal-header">
              <h5 className="modal-title" id="followingModalLabel">
                Following
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body row">
              {Array.isArray(followData) &&
                followData.map((photographerData) => (
                  <div className="" style={{ height: "100px" }}>
                    <div
                      className="featured-artists"
                      key={photographerData.userid}
                    >
                      <div className="d-flex align-items-center justify-content-between p-3">
                        {/* <div className=" "> */}
                        <img
                          src={photographerData.profilephoto}
                          className="rounded-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          alt=""
                        />
                        {/* </div> */}
                        <Link to={`/userprofile/${photographerData.userid}`}>
                          <h5 className="text-white">
                            {photographerData.username}
                          </h5>
                        </Link>

                        <input
                          type="submit"
                          onClick={() =>
                            handleunfollow(photographerData.userid)
                          }
                          className="btn btn-follow"
                          value={"Unfollow"}
                        ></input>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="followersModal"
        tabIndex="-1"
        aria-labelledby="followingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content w-75">
            <div className="modal-header">
              <h5 className="modal-title" id="followingModalLabel">
                Followers
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body row">
              {Array.isArray(followersData) &&
                followersData.map((Datas) => (
                  <div className="" style={{ height: "100px" }}>
                    <div className="featured-artists" key={Datas.userid}>
                      <div className="d-flex align-items-center justify-content-around p-3">
                        {/* <div className=" "> */}
                        <img
                          src={Datas.profilephoto}
                          className="rounded-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          alt=""
                        />
                        {/* </div> */}
                        <Link to={`/userprofile/${Datas.userid}`}>
                          <h5 className="text-white">{Datas.username}</h5>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="pb-120 mt-5">
        <div className="container">
          <div className="tab-content">
            <div className="tab-pane fade show active" id="collected">
              <div className="row">
                {Array.isArray(imgs) &&
                  imgs.map(
                    ({ userid, imgid, imgurl, mrp, imgname, description }) => (
                      <div className="col-lg-4 col-md-6">
                        {/* <h1 className="text-white mb-4">Images</h1> */}
                        <div className="single-product mb-30" key={imgid}>
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
                              <div className="row w-75">
                                <div className="col-md-10">
                                  <h5 className="text-capitalize">{imgname}</h5>
                                </div>
                                <div className="col-md-2">
                                  {userid == uid ? (
                                    <Link to={`/editimg/${imgid}`}>
                                      <FontAwesomeIcon
                                        className="text-white"
                                        icon={faPencil}
                                      />
                                    </Link>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>

                              <div className="d-flex justify-content-between">
                                <h4>
                                  {mrp <= 0 ? "Free" : mrp}{" "}
                                  <FontAwesomeIcon
                                    icon={faRupee}
                                    className={mrp <= 0 ? "d-none" : ""}
                                  />
                                </h4>
                              </div>
                            </div>
                            <div className="product-bottom">
                              <div className="button-group">
                                <Link
                                  to={`/auction/${imgid}`}
                                  className={
                                    data.userid != uid
                                      ? "d-none"
                                      : mrp <= 0
                                      ? "d-none"
                                      : "btn btn-sm btn-border"
                                  }
                                >
                                  Create Auction
                                </Link>
                                <button
                                  onClick={() => handleDelete(imgid)}
                                  className={
                                    data.userid == uid
                                      ? "btn btn-sm btn-border"
                                      : "d-none"
                                  }
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

              <div className="container">
                <div className="tab-content">
                  <div className="tab-pane fade show active" id="collected">
                    <div className="row">
                      {Array.isArray(bids) &&
                        bids.map((item) => (
                          <div className="col-lg-4 col-md-6">
                            <h1 className="text-white">Your Bids</h1>
                            <div
                              className="single-product mb-30"
                              key={item.winid}
                            >
                              {/* <Link to={/data/${imgid}}> */}
                              <img
                                src={item.imgurl}
                                className="single-img"
                                alt="image"
                                style={{ height: "400px" }}
                              />
                              {/* </Link> */}
                              <div className="product-content">
                                <div className="product-top">
                                  <h5 className="text-capitalize">
                                    {item.imgname}
                                  </h5>
                                  <div className="d-flex justify-content-between">
                                    <h4>
                                      {item.bidamount}&nbsp;
                                      <FontAwesomeIcon
                                        icon={faRupee}
                                        className=""
                                      />
                                    </h4>
                                    {token == null ? (
                                      <Link to={"/login"}>
                                        <input
                                          type="submit"
                                          className="btn btn-sm w-50"
                                          value={"Pay Now"}
                                        ></input>
                                      </Link>
                                    ) : (
                                      <input
                                        type="submit"
                                        className="btn btn-sm w-50"
                                        onClick={(e) =>
                                          handlePayment(
                                            item.bidamount * 100,
                                            item.imgid,
                                            item.winid,
                                            item.imgurl,
                                            item.imgname
                                          )
                                        }
                                        value={"Pay Now"}
                                      ></input>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserProfile;
