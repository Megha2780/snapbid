import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [data, setData] = useState([]);
  const navigate=useNavigate();
  const [loading, setLoading] = useState(true); // Add loading state
  const date = new Date();
  const [formData, setFormData] = useState({});
  const tempImg =
    "https://pixsector.com/cache/517d8be6/av5c8336583e291842624.png";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/data");
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        const data = await response.json();
        setData(data);
        setLoading(false); // Set loading to false after data fetch
      } catch (err) {
        console.error(err.message);
        setLoading(false); // Set loading to false on error
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          emailid: formData.emailid,
          profilephoto: tempImg,
          coverphoto: tempImg,
          cityid: formData.cityid,
          bio: "",
          regdate: date,
          contactno: formData.contactno,
          status: "false",
          gender: formData.gender,
          photographer:"false",
        }),
      });
      if (!response.ok) {
        throw new Error("HTTP ERROR : " + response.status);
      }
      const data = await response.data;
      navigate("/login");
      if (data.error) {
        console.error(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        className="py-5 d-flex align-items-center"
        style={{ minHeight: "calc(100vh - 100px)" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="card login-register-card">
                <div className="card-body">
                  <div className="text-center mb-5">
                    <h2>Register New Account</h2>
                    <p>
                      Already have an account?{" "}
                      <Link to="/" className="c1 link">
                        Login Now!
                      </Link>
                    </p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="username" className="mb-2">
                            User name
                          </label>
                          <input
                            type="text"
                            id="username"
                            className="form-control"
                            placeholder="e.g Username"
                            name="username"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="email" className="mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="abc@gmail.com"
                            name="emailid"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="cityid" className="mb-2">
                            City
                          </label>
                          {loading ? ( // Check if data is still loading
                            <p>Loading cities...</p>
                          ) : (
                            <select
                              className="form-control"
                              name="cityid"
                              onChange={handleChange}
                            >
                              <option value="">Select City</option>
                              {data.map((item) => (
                                <option key={item.cityid} value={item.cityid}>
                                  {item.cityname}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="password" className="mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="*** **** *** ****"
                            name="password"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="phone_num" className="mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone_num"
                            className="form-control"
                            placeholder="+01 776-542154"
                            name="contactno"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="col-form-label">
                            Select Gender<span className="mandatory">*</span>
                          </label>
                          <br></br>
                          <input
                            type="radio"
                            className=""
                            value="Male"
                            name="gender"
                            onChange={handleChange}
                          />
                          &nbsp; Male &nbsp;&nbsp;
                          <input
                            type="radio"
                            value="Female"
                            name="gender"
                            onChange={handleChange}
                          />
                          &nbsp; Female &nbsp;&nbsp;
                          <input
                            type="radio"
                            value="Others"
                            name="gender"
                            onChange={handleChange}
                          />
                          &nbsp; Others
                        </div>
                      </div>
                      <div className="col-12 pt-2">
                        <button type="submit" className="btn">
                          Register Now
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
