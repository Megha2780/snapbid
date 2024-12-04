import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";

const EditImg = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { imgid } = useParams();
  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/editimg/${imgid}`
      );
      if (!response.ok) {
        throw new Error("http error " + response.status);
      }
      const userData = await response.json();
      setData(userData);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
    console.log(data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/editimg/${imgid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imgname: data.imgname,
            mrp: data.mrp,
            discount: data.discount,
            description: data.description,
          }),
        }
      );

      if (!response.ok) {
        console.error(response);
      } else {
        alert("ok");
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return <h2>Loading.....!!!!!</h2>;
  }
  return (
    <>
      <Navbar />
      <form onSubmit={(e) => handleSubmit(e)}>
        <section className="pt-120 pb-120 mt-n1">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <div className="section-title">
                  <h2 className="text-white">Image Edit</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="edit-profile-form text-white">
                  <div className="card mb-60">
                    <div className="card-body">
                      <div className="profile-images">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="profile-edit mb-5 mb-lg-0">
                              <div className="">
                                <label
                                  className="btn btn-primary d-block w-100 rounded-1 btn-lg"
                                  htmlFor="profilephoto"
                                >
                                  Image
                                </label>
                                <img
                                  src={data.imgurl}
                                  className="w-100 object-fit-cover rounded-4"
                                  style={{ height: "300px", width: "300px" }}
                                  alt={"tempImg"}
                                ></img>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card mb-60">
                    <div className="card-body">
                      <div className="account-info">
                        <h3>Update Image Information</h3>
                        <div className="form-group">
                          <label for="name">Image Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="imgname"
                            value={data.imgname}
                            onChange={(e) => handleChange(e)}
                          />
                        </div>

                        <div className="form-group mb-5">
                          <label for="bio">MRP</label>{" "}
                          <input
                            id="bio"
                            className="form-control mb-0"
                            placeholder="Write your bio"
                            name="mrp"
                            value={data.mrp}
                            onChange={(e) => handleChange(e)}
                          ></input>
                        </div>
                        <div className="form-group mb-5">
                          <label for="discount">Discount</label>{" "}
                          <input
                            id="discount"
                            className="form-control mb-0"
                            value={data.discount}
                            name="discount"
                            onChange={(e) => handleChange(e)}
                          ></input>
                        </div>
                        <div className="form-group mb-0">
                          <label for="discount">Description</label>
                          <textarea
                            id="discount"
                            className="form-control mb-0"
                            value={data.description}
                            name="description"
                            onChange={(e) => handleChange(e)}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <input
                      type="submit"
                      className="btn d-block mx-auto w-75"
                      value={"Save Changes"}
                    ></input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
      <Footer />
    </>
  );
};

export default EditImg;
