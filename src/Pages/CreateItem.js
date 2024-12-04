import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import storage from "../firebaseConfig";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";

const CreateItem = () => {
  const [data, setData] = useState([]);
  const [formData, setFormdata] = useState({});
  const date = new Date();
  const [cost, setCost] = useState("free");
  const [tempImg, settempImg] = useState(
    "https://pixsector.com/cache/517d8be6/av5c8336583e291842624.png"
  );
  const [uploadProgress, setUploadProgress] = useState(0);

  const uid = localStorage.getItem("id");
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/display");
        if (!response.ok) {
          throw new Error("http error" + response.status);
        }
        const data = await response.json();
        setData(data);
        console.log(data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchData();
  }, []); //
  useEffect(() => {
    console.log(cost);
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
    console.log(formData);
  };

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData, formData,data]); // Run only once after initial render
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imgurl) {
      alert("Select An Image");
      return;
    }

    try {
      const storageRef = ref(
        storage,
        `Images/${formData.imgname.trim().toLowerCase()}.jpg`
      );
      const uploadTask = uploadBytesResumable(storageRef, formData.imgurl);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("OPPS! Something Went Wrong", error);
          alert("OPPS! Something Went Wrong " + error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          let mrpValue = 0;
          let discountValue = 0;

          if (cost === "paid") {
            mrpValue = formData.mrp;
            discountValue = formData.discount;
          }

          const response = await fetch("http://localhost:5000/api/imageins", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userid: uid,
              imgname: formData.imgname,
              imgurl: downloadURL,
              status: "false",
              addedDt: date,
              totalDownloads: 0,
              totalviews: 0,
              mrp: mrpValue,
              discount: discountValue,
              subcatid: formData.subcatid,
              description: formData.description,
            }),
          });

          if (!response.ok) {
            console.error(response);
            alert("Failed to upload image");
          } else {
            alert("Image uploaded successfully");
            setFormdata({
              imgname: "",
              imgurl: null,
              addedDt: "",
              totalDownloads: "",
              totalviews: "",
              mrp: "",
              discount: "",
              subcatid: "",
              description: "",
            });
          }
        }
      );
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while uploading image");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <h1 className="text-center text-white mt-5">Upload Snaps</h1>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="border m-5 mx-auto d-block w-75"
      >
        <div className="m-5">
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
          <div className="row">
            <div className="col-md-6 p-4">
              <img
                src={tempImg}
                className="w-100 object-fit-cover rounded-4"
                style={{ height: "600px", width: "300px" }}
                alt={tempImg}
              ></img>
            </div>
            <div className="col-md-6">
              <div className="mt-4">
                <label>
                  Select Image<span className="mandatory">*</span> :
                </label>
                <label
                  className="btn btn-primary d-block w-100 rounded-1 btn-lg"
                  htmlFor="imgurl"
                >
                  Select Image
                </label>
                <input
                  id="imgurl"
                  className="form-control d-none"
                  style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                  type="file"
                  onChange={(e) => {
                    setFormdata((prevData) => ({
                      ...prevData,
                      imgurl: e.target.files[0],
                    }));
                    settempImg(URL.createObjectURL(e.target.files[0]));
                  }}
                  name="imgurl"
                />
              </div>
              <div className="mt-4">
                <label>
                  Enter Name<span className="mandatory">*</span> :
                </label>
                <input
                  className="form-control text-capitalize"
                  style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                  type="text"
                  onChange={(e) => handleChange(e)}
                  name="imgname"
                />
              </div>

              <div className="mt-4">
                <label>
                  Enter Description<span className="mandatory">*</span> :
                </label>
                <textarea
                  className="form-control text-capitalize"
                  style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                  onChange={(e) => handleChange(e)}
                  name="description"
                />
              </div>
              <div className="mt-4">
                <label className="">
                  Select Sub Category<span className="mandatory">*</span> :
                </label>
                <select
                  className="form-control text-light"
                  name="subcatid"
                  style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                  onChange={(e) => {
                    setFormdata((prevData) => ({
                      ...prevData,
                      subcatid: parseInt(e.target.value),
                    }));
                  }}
                >
                  <option value="">Select SubCategory</option>
                  {data.map((item) => (
                    
                    <option className="text-dark" key={item.subcatid} value={item.subcatid}>
                      {item.subcatname}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label>
                Choose Cost:<span className="mandatory">*</span> :
              </label>
              &nbsp;
              <input
                className="m-2"
                type="radio"
                checked={cost == "free" ? true : false}
                onChange={(e) => {
                  setCost("free");
                }}
                name="category"
                value={"free"}
              />
              Free &nbsp;
              <input
                className="m-2"
                type="radio"
                checked={cost == "paid" ? true : false}
                onChange={(e) => {
                  setCost("paid");
                }}
                name="category"
                value={"paid"}
              />
              Paid
            </div>
            <div className={cost === "paid" ? "" : "d-none"}>
              <div className="mt-4">
                <label>Enter Discount :</label>
                <input
                  className="form-control"
                  style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                  type="number"
                  onChange={(e) => handleChange(e)}
                  name="discount"
                />
              </div>
              <div className="mt-4">
                <label>
                  Enter Amount<span className="mandatory">*</span> :
                </label>
                <input
                  className="form-control"
                  style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                  type="number"
                  onChange={(e) => handleChange(e)}
                  name="mrp"
                />
              </div>
            </div>
            <input
              type="submit"
              value="Create"
              className="mt-4 w-100 btn btn-primary"
            />
          </div>
        </div>
      </form>

      <Footer />
    </>
  );
};

export default CreateItem;
