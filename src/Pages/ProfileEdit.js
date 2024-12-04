import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import storage from "../firebaseConfig";
import Navbar from "../Component/Navbar";

const ProfileEdit = () => {
  const [data, setData] = useState({});
  const [city, setCity] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tempImg, setTempImg] = useState(
    "https://pixsector.com/cache/517d8be6/av5c8336583e291842624.png"
  );
  const [tempImg2, setTempImg2] = useState(
    "https://pixsector.com/cache/517d8be6/av5c8336583e291842624.png"
  );

  const handleTogglePhotographer = (isPhotographer) => {
    setData((prevData) => ({
      ...prevData,
      photographer: isPhotographer.toString(),
    }));
    sessionStorage.setItem("photographer", isPhotographer.toString()); // Update session storage
  };

  const uid = localStorage.getItem("id");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/editusers/${uid}`
      );
      if (!response.ok) {
        throw new Error("http error " + response.status);
      }
      const userData = await response.json();
      setData(userData);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
      setLoading(false);
    }
  };

  const fetchCity = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/data");
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const cityData = await response.json();
      setCity(cityData);
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
    if (!data.profilefile || !data.coverphoto) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/editusers/${uid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: data.username,
              emailid: data.emailid,
              profilephoto: data.profilephoto,
              coverphoto: data.coverphoto,
              cityid: data.cityid,
              contactno: data.contactno,
              bio: data.bio,
              photographer: data.photographer,
            }),
          }
        );
        
        if (!response.ok) {
          console.error(response);
        } else {
          alert("your changes saved");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const profileRef = ref(
          storage,
          `Profile/${data.username
            .split(" ")
            .join("-")
            .trim()
            .toLowerCase()}.jpg`
        );
        const coverRef = ref(
          storage,
          `Cover/${data.username.split(" ").join("-").trim().toLowerCase()}.jpg`
        );

        const profileTask = uploadBytesResumable(profileRef, data.profilefile);
        const coverTask = uploadBytesResumable(coverRef, data.coverfile);

        profileTask.on(
          "state_changed",
          (snapshot) =>
            setUploadProgress(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            ),
          (error) => {
            console.error("OPPS! Something Went Wrong");
            alert("OPPS! Something Went Wrong " + error);
          },
          async () => {
            const profileURL = await getDownloadURL(profileTask.snapshot.ref);
            const coverURL = await getDownloadURL(coverTask.snapshot.ref);

            const response = await fetch(
              `http://localhost:5000/api/editusers/${uid}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: data.username,
                  emailid: data.emailid,
                  profilephoto: profileURL,
                  coverphoto: coverURL,
                  cityid: data.cityid,
                  contactno: data.contactno,
                  bio: data.bio,
                  photographer: data.photographer,
                }),
              }
            );

            if (!response.ok) {
              console.error(response);
            } else {
              alert(response);
            }
          }
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchCity();
  }, []);

  useEffect(() => {
    // console.log(data);
  });

  if (loading) {
    return <div>Loading...</div>;
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
                  <h2 className="text-white">Profile Setting</h2>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex justify-content-md-end mb-5 mb-md-0">
                  <a href="profile.html" className="btn btn-border style-c1">
                    see Previws
                  </a>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="progress">
                <div
                  aria-valuemin={0}
                  aria-valuemax={100}
                  role="progressbar"
                  aria-valuenow={uploadProgress}
                  className="progress-bar"
                  style={{ width: uploadProgress + "%" }}
                >
                  {uploadProgress.toFixed(2)}%
                </div>
              </div>
              <div className="col-12">
                <div className="edit-profile-form text-white">
                  <div className="card mb-60">
                    <div className="card-body">
                      <div className="profile-images">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="profile-edit mb-5 mb-lg-0">
                              <h3>Profile Image</h3>
                              <div className="">
                                <label
                                  className="btn btn-primary d-block w-100 rounded-1 btn-lg"
                                  htmlFor="profilephoto"
                                >
                                  Select Image
                                </label>
                                <img
                                  src={
                                    tempImg == null
                                      ? data.profilephoto
                                      : tempImg
                                  }
                                  className="w-100 object-fit-cover rounded-4"
                                  style={{ height: "300px", width: "300px" }}
                                  alt={tempImg}
                                ></img>
                                <input
                                  id="profilephoto"
                                  className="form-control d-none"
                                  style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                                  type="file"
                                  onChange={(e) => {
                                    setData((prevData) => ({
                                      ...prevData,
                                      profilefile: e.target.files[0],
                                    }));
                                    setTempImg(
                                      URL.createObjectURL(e.target.files[0])
                                    );
                                  }}
                                  name="profilephoto"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="profile-edit mb-5 mb-lg-0">
                              <h3>Cover Image</h3>
                              <div className="">
                                <label
                                  className="btn btn-primary d-block w-100 rounded-1 btn-lg"
                                  htmlFor="coverphoto"
                                >
                                  Select Cover Image
                                </label>
                                <img
                                  src={
                                    tempImg2 == null
                                      ? data.coverphoto
                                      : tempImg2
                                  }
                                  className="w-100 object-fit-cover rounded-4"
                                  style={{ height: "300px", width: "300px" }}
                                  alt={tempImg2}
                                ></img>
                                <input
                                  id="coverphoto"
                                  className="form-control d-none"
                                  style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                                  type="file"
                                  onChange={(e) => {
                                    setData((prevData) => ({
                                      ...prevData,
                                      coverfile: e.target.files[0],
                                    }));
                                    setTempImg2(
                                      URL.createObjectURL(e.target.files[0])
                                    );
                                  }}
                                  name="coverphoto"
                                />
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
                        <h3>Update Your Information</h3>
                        <div className="form-group">
                          <label for="name">Your Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="username"
                            value={data.username}
                            onChange={(e) => handleChange(e)}
                          />
                        </div>
                        <div className="form-group">
                          <div className="row justify-content-between">
                            <label for="email" className="col-md-5">
                              eMail Address
                            </label>
                            <span className="info col-md-7 d-flex justify-content-md-end mb-3 mb-lg-0">
                              * Your email for marketplace notifications
                            </span>
                          </div>
                          <input
                            type="email"
                            className="form-control text-white"
                            id="email"
                            name="emailid"
                            value={data.emailid}
                            onChange={(e) => handleChange(e)}
                          />
                        </div>
                        <div>
                          <label htmlFor="cityid" className="mb-2">
                            City
                          </label>

                          <select
                            className="form-control"
                            name="cityid"
                            onChange={(e) => handleChange(e)}
                          >
                            <option value="">Select City</option>
                            {Array.isArray(city) &&
                              city.map((item) => (
                                <option key={item.cityid} value={item.cityid}>
                                  {item.cityname}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="form-group mb-0">
                          <label for="bio">Bio</label>{" "}
                          <textarea
                            id="bio"
                            className="form-control mb-0"
                            placeholder="Write your bio"
                            name="bio"
                            value={data.bio}
                            onChange={(e) => handleChange(e)}
                          ></textarea>
                        </div>
                        <div className="form-group mb-0">
                          <label for="bio">Contact</label>{" "}
                          <input
                            id="contact"
                            className="form-control mb-0"
                            value={data.contactno}
                            name="contactno"
                            onChange={(e) => handleChange(e)}
                          ></input>
                        </div>
                        <div className="form-group mb-0">
                          <label for="photographer">
                            Become a Photographer/User:
                          </label>
                          <br></br>
                          {data.photographer === "true" ? (
                            <input
                              type="button"
                              id="photographer"
                              className="btn mb-0"
                              value={"Photographer"}
                              name="photographer"
                              onClick={() => handleTogglePhotographer(false)}
                            />
                          ) : (
                            <input
                              type="button"
                              id="photographer"
                              className="btn mb-0"
                              value={"User"}
                              name="photographer"
                              onClick={() => handleTogglePhotographer(true)}
                            />
                          )}
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
    </>
  );
};

export default ProfileEdit;
