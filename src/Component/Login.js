import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "./dark-logo.png";
const Login = () => {
  var token = localStorage.getItem("token");
  const navigate = useNavigate(); // Corrected
  const [data, setData] = useState({
    emailid: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevValue) => ({ ...prevValue, [name]: value }));
  };

  useEffect(() => {
    console.log(data);
    // if (!token == null) {
    //   //   alert("Not Logged In");
    // } else {
    //   alert("Welcome User");
    // }
  }, [data, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!resp.ok) {
        if (resp.status === 401) {
          alert("Email ID or password not Found");
          const responseData = await resp.json();
          if (responseData.error) {
            alert(responseData.error); // Display the error message in an alert box
          }
        } else {
          throw new Error("HTTP error " + resp.status);
        }
        // if (resp.status === "true") {
        //   alert("you have been blocked");
        // }
      } else {
        const responseData = await resp.json();
        if (responseData.error) {
          alert(responseData.error); // Display the error message
        } else {
          console.log(responseData);
          localStorage.setItem("token", responseData.token);
          localStorage.setItem("id", responseData.id);
          sessionStorage.setItem("photographer", responseData.photographer);
          navigate("/");
        }
      }
    } catch (err) {
      if (err.status == 401) {
        alert("Email ID or password not Found");
      } else {
        console.log(err.status);
      }
    }
  };
  return (
    <>
      <div className="main-wrapper main-wrapper2">
        <div className="account-content">
          <div className="container ">
            <div className="account-logo">
              <a href="admin-dashboard.html">
                <img src={logo}></img>
              </a>
            </div>

            <div className="account-box ">
              <div className="account-wrapper  grd">
                <h3 className="account-title text-dark">Login</h3>

                <form action="" onSubmit={(e) => handleSubmit(e)}>
                  <div className="input-block mb-4">
                    <label className="col-form-label text-dark">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter Email"
                      className="form-control text-light"
                      name="emailid"
                      onChange={(e) => handleChange(e)}
                    ></input>
                  </div>
                  <div className="input-block mb-4">
                    <div className="row align-items-center">
                      <div className="col">
                        <label className="col-form-label text-dark">
                          Password
                        </label>
                      </div>
                      <div className="col-auto">
                        <Link to={"/forgot"} className="text-light">
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                    <div className="position-relative">
                      <input
                        type="password"
                        placeholder="Enter Password"
                        className="form-control"
                        name="password"
                        onChange={(e) => handleChange(e)}
                      ></input>
                      <span
                        className="fa-solid fa-eye-slash"
                        id="toggle-password"
                      ></span>
                    </div>
                  </div>
                  <div className="input-block mb-4 text-center">
                    <input
                      type="submit"
                      className="btn btn-primary account-btn"
                      value={"Login"}
                    ></input>
                  </div>
                  <div className="account-footer">
                    <p className="text-dark">
                      Don't have an account yet?{" "}
                      <Link to={"/signup"}>Register</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <form className="w-50 mx-auto" onSubmit={(e) => handleSubmit(e)}>
        <h1>Login Page</h1>
        <div className="mb-4">
          <input
            type="email"
            placeholder="enter emailid"
            className="form-control"
            name="emailid"
            onChange={(e) => handleChange(e)}
          ></input>
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="enter password"
            className="form-control"
            name="password"
            onChange={(e) => handleChange(e)}
          ></input>
        </div>
        <input
          type="submit"
          className="btn btn-primary"
          value={"Login"}
        ></input>
      </form> */}
      {/* <Link to={"/display"}>Display</Link> */}
    </>
  );
};

export default Login;
