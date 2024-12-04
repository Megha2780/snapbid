import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [data, setData] = useState({
    emailid: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevValue) => ({ ...prevValue, [name]: value }));
  };

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <>
      <div className="main-wrapper main-wrapper2">
        <div className="account-content">
          <div className="container">
            <div className="account-logo">
              <a href="admin-dashboard.html">
                <h2>SnapBid</h2>
              </a>
            </div>

            <div className="account-box">
              <div className="account-wrapper">
                <h3 className="account-title">Forgot Password?</h3>
                <p className="account-subtitle">
                  Enter your email to get a password reset link
                </p>

                <form>
                  <div className="input-block mb-4">
                    <label className="col-form-label">Email Address</label>
                    <input
                      className="form-control"
                      name="emailid"
                      type="text"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <div className="input-block mb-4 text-center">
                    <input
                      className="btn btn-primary account-btn"
                      type="submit"
                      value={"Reset Password"}
                    />
                  </div>
                  <div className="account-footer">
                    <p>
                      Remember your password? <Link to={"/login"}>Login</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
