import React, { useState } from "react";
import Navbar from "../Component/Navbar";
import cover from "../assets/images/author-cover.png";

const Contact = () => {
  const [contact, setContact] = useState({});
  const uid = localStorage.getItem("id");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/contactins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: uid,
          emailid: contact.emailid,
          subject: contact.subject,
          message: contact.message,
        }),
      });
      if (!response.ok) {
        throw new Error("HTTP ERROR : " + response.status);
      } else {
        alert("your message sent successfully");
      }
      const data = await response.data;
      if (data.error) {
        console.error(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Navbar />
      <div className="author-area">
        <img className="author-cover" src={cover}></img>
      </div>
      <div className="pt-120 pb-120 d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="section-title text-white text-center">
                <h2>Get In Touch</h2>
                <p>
                  The top NFTs on Anefty, ranked by volume, floor price and
                  other statistics. "Multiple" if you want to sell by ones
                  collectibles upload your work likes image, video, audio times
                  for Anefty.
                </p>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="card">
                <div className="card-body contact-form-wrap">
                  <form
                    className="contact-form"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <h3 className="pb-1">Quick Contact Us</h3>
                    <div className="form-group">
                      <label for="email">Email address</label>{" "}
                      <input
                        type="email"
                        name="emailid"
                        className="form-control"
                        onChange={(e) => handleChange(e)}
                        id="emailid"
                        placeholder="support@anefty.com"
                      />
                    </div>

                    <div className="form-group">
                      <label for="subject">Subject</label>{" "}
                      <input
                        type="text"
                        name="subject"
                        className="form-control"
                        onChange={(e) => handleChange(e)}
                        id="subject"
                        placeholder="Services Request"
                      />
                    </div>
                    <div className="form-group">
                      <label for="message">Message</label>{" "}
                      <textarea
                        id="message"
                        name="message"
                        className="form-control"
                        onChange={(e) => handleChange(e)}
                        placeholder="Write your Message"
                      ></textarea>
                    </div>
                    <div className="pt-2">
                      <button type="submit" className="btn">
                        <img
                          src="assets/img/icons/btn_submit.svg"
                          alt=""
                          className="svg"
                        />{" "}
                        Send Message
                      </button>
                    </div>
                    <div className="form-response mt-3"></div>
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

export default Contact;
