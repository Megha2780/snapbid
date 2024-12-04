import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faDownload,
  faEye,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import wm from "../assets/images/watermark.png";

const ItemDetails = () => {
  const token = localStorage.getItem("token");
  const [tid, setThreadId] = useState();
  const { imgid } = useParams();
  const [data, setData] = useState({});
  const uid = localStorage.getItem("id");
  const [formData, setFormData] = useState({});
  const [orderId, setOrderId] = useState("");
  const date = new Date();
  const [threadData, setThreadData] = useState({});
  const [singleData, setSingleData] = useState({});
  const [comments, setComments] = useState({});
  const [thComments, setThComments] = useState([]);

  const handleDownload = async (imgurl, imgname) => {
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
      // Increment total downloads on the server
      await fetch(`http://localhost:5000/api/downloadcount/${imgid}`, {
        method: "PUT",
      });
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };
  const fetchData = async () => {
    try {
      if (!imgid) {
        console.error("ID NOT FOUND");
        return;
      }
      const response = await fetch(`http://localhost:5000/api/data/${imgid}`);
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.statusText);
      }
      const responseData = await response.json();
      setData(responseData);
      // console.log(responseData);
    } catch (err) {
      console.error(err);
    }
  };
  const handlePayment = async (amount, imgid, imgurl, imgname) => {
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
          name: data.imgname,
          description: "Hello World",
          order_id: pdata.id,
          handler: (response) => {
            addOrder(pdata, amount);
            handleDownload(imgurl, imgname);
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
          // Call backend endpoint to insert order details into the database
          addOrder(pdata);
        });
        paymentWindow.open();
      }
    } catch (err) {
      console.error("Error creating payment:", err);
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
          paystatus: "false",
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log(formData);
    setComments((prevthread) => ({ ...prevthread, [name]: value }));
    console.log(comments);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/threadins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: uid,
          imgid: imgid,
          status: "false",
          thcreatedDt: date,
          title: formData.title,
          thdescription: formData.thdescription,
        }),
      });
      if (!response.ok) {
        throw new Error("HTTP ERROR : " + response.status);
      }
      const resData = await response.resData;
      if (resData.error) {
        console.error(resData.error);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const displayThread = async () => {
    try {
      if (!imgid) {
        console.error("ID NOT FOUND");
        return;
      }
      const response = await fetch(
        `http://localhost:5000/api/displaythread/${imgid}`
      );
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.statusText);
      }
      const threadData = await response.json();
      setThreadData(threadData);
      // console.log(threadData);
    } catch (err) {
      console.error(err);
    }
  };
  const handleSingle = async (threadId) => {
    try {
      if (!threadId) {
        console.error("Thread ID not found");
        return;
      }
      const response = await fetch(
        `http://localhost:5000/api/singlethread/${threadId}`
      );
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.statusText);
      }
      const singleThread = await response.json();
      setSingleData(singleThread);
      fetchComments(threadId); // Fetch comments after setting single thread data
    } catch (err) {
      console.error(err);
    }
  };
  const handleAddComments = async (e, threadId) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/commentins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadid: threadId,
          userid: uid,
          comment: comments.comment,
        }),
      });
      if (!response.ok) {
        throw new Error("HTTP ERROR : " + response.status);
      }
      const responseData = await response.json();
      if (responseData.error) {
        console.error(responseData.error);
      } else {
        // After successfully adding comment, fetch comments again to update
        fetchComments(threadId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/displaycomments/${tid}`
      );
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.statusText);
      }
      const commentsData = await response.json();
      setThComments(commentsData);
      console.log(commentsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    displayThread();
    fetchComments(); // Corrected typo here
  }, [data]);

  const calculateDiscountedPrice = (mrp, discount) => {
    const mrpValue = parseFloat(mrp);
    const discountValue = parseFloat(discount);
    const discountedPrice = mrpValue - (mrpValue * discountValue) / 100;
    return discountedPrice.toFixed(0);
  };
  return (
    <>
      <Navbar />
      <section className="pt-120 pb-120">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-6 order-1 order-lg-0">
              <div className="item-details ov-hidden">
                <h2 className="product-title text-capitalize">
                  {data.imgname}
                </h2>
                <div>
                  <img
                    src={data.profilephoto}
                    style={{
                      width: "30px",
                      height: "30px",
                      objectFit: "cover",
                    }}
                    className="rounded-circle me-2 "
                  ></img>
                  <span className="text-light text-capitalize">
                    {data.username}
                  </span>
                </div>
                <div className="d-flex align-items-center my-3">
                  <h5 className="ms-0 me-3 p-2 border border-1 rounded-pill">
                    <FontAwesomeIcon icon={faEye} /> {data.totalviews}
                  </h5>
                  <h5 className="p-2 border border-1 rounded-pill">
                    <FontAwesomeIcon icon={faDownload} /> {data.totaldownloads}
                  </h5>
                </div>
                <p
                  className="my-2 text-capitalize fw-bold c1 fst-italic"
                  style={{ letterSpacing: "2px" }}
                >
                  {data.subcatname}
                </p>
                <p className="my-2 text-capitalize">{data.description}</p>
                <div className="row pt-1 ">
                  <div className="col-sm-6">
                    <div className="price mb-4 mb-sm-0">
                      <h6>
                        Item Price :&nbsp;
                        <span
                          className={
                            data.mrp === 0 ? "d-none" : "text-light mx-2 "
                          }
                        >
                          <del>{data.mrp}</del>
                        </span>
                        <span className="fs-3">
                          {data.mrp === 0
                            ? "Free"
                            : `₹ ${calculateDiscountedPrice(
                                data.mrp,
                                data.discount
                              )}/-`}
                        </span>
                        <span className="badge bg-primary text-light ms-2">
                          {data.discount}% off
                        </span>
                      </h6>
                    </div>
                    {data.userid == uid ? (
                      ""
                    ) : (
                      <div>
                        {token == null ? (
                          <Link to={"/login"}>
                            <input
                              type="submit"
                              className={
                                data.userid === uid || data.mrp > 0
                                  ? "btn btn-border btn-sm"
                                  : "d-none"
                              }
                              value={"Buy Now"}
                            />
                          </Link>
                        ) : (
                          <input
                            type="submit"
                            className={
                              data.userid === uid || data.mrp > 0
                                ? "btn btn-bordered btn-sm"
                                : "d-none"
                            }
                            onClick={(e) =>
                              handlePayment(
                                calculateDiscountedPrice(
                                  data.mrp,
                                  data.discount
                                ) * 100,
                                data.imgid,
                                data.imgurl,
                                data.imgname
                              )
                            }
                            value={"Buy Now"}
                          ></input>
                        )}

                        <button
                          className={
                            data.userid === uid || data.mrp === 0
                              ? "btn btn-border btn-sm"
                              : "d-none"
                          }
                          onClick={(e) =>
                            handleDownload(data.imgurl, data.imgname)
                          }
                        >
                          Download
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <form className="mt-5" onSubmit={(e) => handleSubmit(e)}>
                  <h3 className="mb-5">Create Threads</h3>
                  <div>
                    <label>Thread Title:</label>
                    <input
                      type="text"
                      className="form-control border-bottom h-25"
                      name="title"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <div>
                    <label>Thread Description:</label>
                    <textarea
                      className="form-control border-bottom h-25"
                      name="thdescription"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <div>
                    <input
                      type="submit"
                      value={"Create Thread"}
                      className="btn"
                    />
                  </div>
                </form>
                <ul className="nav tab-buttons style--two">
                  <li>
                    <button
                      className="active mt-5"
                      data-bs-toggle="tab"
                      data-bs-target="#info"
                    >
                      Threads
                    </button>
                  </li>
                </ul>
                <div className="tab-content">
                  {Array.isArray(threadData) &&
                    threadData.map((thread) => (
                      <div className="container card mb-2">
                        <div
                          className="row card-body p-3"
                          key={thread.threadid}
                        >
                          <div className="col-md-2">
                            <img
                              src={thread.profilephoto}
                              className="rounded-circle object-fit-cover"
                              style={{ width: "50px", height: "50px" }}
                            />
                          </div>
                          <div className="col-md-8">
                            <h5>{thread.username}</h5>
                            <p className="fw-light mt-3">
                              {thread.thdescription}
                            </p>

                            <div>
                              <button
                                className="btn  btn-primary"
                                type="button"
                                onClick={() => {
                                  handleSingle(thread.threadid);
                                  setThreadId(thread.threadid);
                                }}
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasExample"
                                aria-controls="offcanvasExample"
                              >
                                View More
                              </button>
                              <div
                                className="offcanvas offcanvas-bottom vh-100"
                                tabindex="-1"
                                id="offcanvasExample"
                                aria-labelledby="offcanvasExampleLabel"
                              >
                                <div className="offcanvas-header">
                                  <h5
                                    className="offcanvas-title text-dark text-capitalize"
                                    id="offcanvasExampleLabel"
                                  >
                                    {singleData.title}
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close"
                                  ></button>
                                </div>

                                <div class="offcanvas-body">
                                  <div
                                    className=""
                                    style={{ width: "25%", height: "13vh" }}
                                  >
                                    <div className=" rounded-0 row  d-flex align-items-baseline">
                                      <div className="col-md-3">
                                        <img
                                          src={singleData.profilephoto}
                                          className="rounded-circle object-fit-cover"
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                          }}
                                        ></img>
                                      </div>
                                      <div className="col-md-8">
                                        <h3 className="text-dark text-capitalize">
                                          {singleData.title}
                                        </h3>
                                        <p className="text-dark mt-2">
                                          {singleData.thdescription}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <hr className="w-25 border-black"></hr>
                                  <div className="container-fluid">
                                    <div className="row">
                                      <div className="col-md-8 text-dark">
                                        {thComments.map((comment) => (
                                          <div className="row">
                                            <div className="col-md-1 mb-4">
                                              <img
                                                src={comment.profilephoto}
                                                className="rounded-circle object-fit-cover"
                                                style={{
                                                  width: "50px",
                                                  height: "50px",
                                                }}
                                              ></img>
                                            </div>
                                            <div className="col-md-9">
                                              <h6 className="text-dark">
                                                {comment.username}
                                              </h6>
                                              <p className="text-dark">
                                                {comment.comment}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="col-md-4  text-dark">
                                        <h3 className="text-dark">
                                          Add Comments
                                        </h3>
                                        <form
                                          className="mt-4"
                                          onSubmit={(e) =>
                                            handleAddComments(
                                              e,
                                              singleData.threadid
                                            )
                                          }
                                        >
                                          <label className="text-dark">
                                            Enter Comment:
                                          </label>
                                          <div>
                                            <textarea
                                              name="comment"
                                              className="border-dark rounded text-dark w-50"
                                              onChange={(e) => handleChange(e)}
                                            />
                                          </div>
                                          <input
                                            type="submit"
                                            value={"Add Comment"}
                                            className="btn mt-3"
                                          />
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-6 order-0 order-lg-1">
              <div className="item-details-img mb-5 mb-lg-0 position-relative">
                <img
                  src={data.imgurl}
                  className="rounded w-100"
                  style={{ height: "600px" }}
                ></img>
                <img
                  src={wm}
                  className="rounded w-100 position-absolute top-0 z-2 end-0 h-100 object-fit-cover "
                  style={{ filter: "invert(1)", opacity: "0.1" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ItemDetails;
