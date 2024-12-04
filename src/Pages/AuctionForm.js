import React, { useEffect, useState } from "react";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import { useParams } from "react-router-dom";

const AuctionForm = () => {
  const { imgid } = useParams();
  const [data, setData] = useState([]);
  const [formData, setformData] = useState({});
  const date = new Date();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prevData) => ({ ...prevData, [name]: value }));
    console.log(formData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auctionform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imgid: imgid,
          ownerid:0,
          createdDt: date,
          auctionAmount: formData.auctionAmount,
          startDate: 0,
          endDate: 0,
          aucstatus: "false",
          bidDays: formData.bidDays,
          endstatus: "false",
          sendStatus: "false",
        }),
      });
      if (!response.ok) {
        throw new Error("HTTP ERROR : " + response.status);
      }
      const data = await response.data;
      if (data.error) {
        console.error(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auction/${imgid}`
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
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Navbar />
      <h1 className="text-center mt-5 text-light">Create Auction</h1>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="border m-5 mx-auto d-block w-75"
      >
        <div className="m-5">
          <div>
            <label className="mt-4">Image:</label>&nbsp;&nbsp;&nbsp;
            <img
              src={data.imgurl}
              className="rounded"
              style={{ width: "300px", height: "300px",objectFit:"cover" }}
              alt="image"
            ></img>
          </div>
          <div className="mt-4">
            <label>Image Name:</label>
            <input
              className="form-control"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              type="text"
              value={data.imgname}
              //   onChange={(e) => handleChange(e)}
              name="imgname"
            />
          </div>
          <div className="mt-4">
            <label>Auction Amount:</label>
            <input
              className="form-control"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              type="number"
              onChange={(e) => handleChange(e)}
              name="auctionAmount"
            />
          </div>
          <div className="mt-4">
            <label>Description</label>
            <textarea
              className="form-control bordered"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              value={data.description}
              //   onChange={(e) => handleChange(e)}
              name="description"
            />
          </div>
          <div className="mt-4 mb-4 ">
            <label className="">Bid Days</label>
            <input
              type="text"
              className="form-control"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              name="bidDays"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div>
            <input type="submit" className="btn btn-success" value={"Create"} />
          </div>
        </div>
      </form>
      <Footer />
    </>
  );
};

export default AuctionForm;
