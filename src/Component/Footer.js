import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import insta1 from "./img/instagram/insta1.png";
import insta2 from "./img/instagram/insta2.png";
import insta3 from "./img/instagram/insta3.png";
import insta4 from "./img/instagram/insta4.png";
import insta5 from "./img/instagram/insta5.png";
import insta6 from "./img/instagram/insta6.png";
import mail from "./img/icons/mail.svg";
import insta from "./img/icons/instagram-round.svg"
import twitter from "./img/icons/twitter-round.svg";
import pinterest from "./img/icons/pinterest.svg";
import whatsapp from "./img/icons/whatsapp.svg";

import logo from "./logo2.png";
const Footer = () => {
  return (
    <>
      <div className="footer-overlay" data-bg-img="assets/img/bg/footer-bg.png">
        {/* <section className="newsletter-sec">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="newsletter-content text-white mb-30 mb-lg-0 text-center text-lg-start">
                  <h4>Stay in the Loop</h4>
                  <p>
                    Join our mail list className="link" to stay in the loop with
                    our newest feature release, NFTs
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                <form
                  action="https://themelooks.us13.list-manage.com/subscribe/post?u=79f0b132ec25ee223bb41835f&amp;id=f4e0e93d1d"
                  className="newslatter-form style--two"
                >
                  <div className="theme-input-group">
                    <input
                      className="form-control"
                      type="email"
                      placeholder="Email here…"
                    />{" "}
                    <button type="submit" className="submit-btn btn">
                      <img
                        src="assets/img/icons/mail.svg"
                        alt=""
                        className="svg"
                      />{" "}
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section> */}
        <footer className="footer">
          <div className="footer-main pb-3 bg-transparent">
            <div className="container">
              <div className="row">
                <div className="col-xl-4 col-lg-4 col-sm-6">
                  <div className="widget widget_about text-white style--two">
                    <img
                      src={logo}
                      style={{ height: "80px", width: "250px" }}
                      alt=""
                      className="footer-logo object-fit-cover"
                    />
                    <p>
                      Buy, Bid, Enjoy. Explore captivating images, purchase
                      instantly, or bid on exclusive pieces. Join us now!
                    </p>
                    <div className="socials d-flex align-items-center">
                      <Link
                        className="link"
                        to="https://www.twitter.com/"
                        target="_blank"
                      >
                        <img
                          src={twitter}
                          alt=""
                          className="svg"
                        />
                      </Link>
                      <Link
                        className="link"
                        to="https://www.instagram.com/"
                        target="_blank"
                      >
                        <img
                          src={insta}
                          alt=""
                          className="svg"
                        />
                      </Link>
                      <Link
                        className="link"
                        to="https://www.pinterest.com/"
                        target="_blank"
                      >
                        <img
                          src={pinterest}
                          alt=""
                          className="svg"
                        />
                      </Link>
                      <Link
                        className="link"
                        to="https://www.whatsapp.com/"
                        target="_blank"
                      >
                        <img
                          src={whatsapp}
                          alt=""
                          className="svg"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="widget widget_nav_menu">
                    <h4 className="widget_title">Marketplace</h4>
                    <ul>
                      <li>
                        <Link className="link" to={"/collections"}>
                          All Images
                        </Link>
                      </li>
                      <li>
                        <Link className="link" to="explore.html">
                          Trading Paint
                        </Link>
                      </li>
                      <li>
                        <Link className="link" to="explore.html">
                          Art Painting
                        </Link>
                      </li>
                      <li>
                        <Link className="link" to="explore.html">
                          Virtual Paints
                        </Link>
                      </li>
                      <li>
                        <Link className="link" to="explore.html">
                          Collectibles
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-4 col-sm-6">
                  <div className="widget widget_nav_menu">
                    <h4 className="widget_title">My Account</h4>
                    <ul>
                      <li>
                        <Link className="link" to="profile.html">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="link" to="author.html">
                          Author
                        </Link>
                      </li>
                      <li>
                        <Link className="link" to="collection.html">
                          My Collections
                        </Link>
                      </li>
                      <li>
                        <Link className="link" to="author.html">
                          Settings
                        </Link>
                      </li>
                      <li>
                        <Link className="link" to="activity.html">
                          Activity
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="widget widget_instagram">
                    <h4 className="widget_title">Follow Instagram</h4>
                    <div className="instagram-content">
                      <Link
                        className="link"
                        to="https://www.instagram.com/"
                        target="_blank"
                      >
                        <img src={insta1} alt="" />{" "}
                      </Link>
                      <Link
                        className="link"
                        to="https://www.instagram.com/"
                        target="_blank"
                      >
                        <img src={insta2} alt="" />{" "}
                      </Link>
                      <Link
                        className="link"
                        to="https://www.instagram.com/"
                        target="_blank"
                      >
                        <img src={insta3} alt="" />{" "}
                      </Link>
                      <Link
                        className="link"
                        to="https://www.instagram.com/"
                        target="_blank"
                      >
                        <img src={insta4} alt="" />{" "}
                      </Link>
                      <Link
                        className="link"
                        to="https://www.instagram.com/"
                        target="_blank"
                      >
                        <img src={insta5} alt="" />{" "}
                      </Link>
                      <Link
                        className="link"
                        to="https://www.instagram.com/"
                        target="_blank"
                      >
                        <img src={insta6} alt="" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
         
        </footer>
      </div>
      <Link to="#" className="back- to-top link">
        <i className="fas fa-long-arrow-alt-up"></i>
      </Link>
    </>
  );
};

export default Footer;
