import React from "react";
import "./Footer.css";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            A Fullstack template for building web applications with React and
            Node.js
          </p>
          <p className="copyright">© {year} bawfng04. All rights reserved.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/example">Example</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/Register">Register</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>bawfng04</p>
          <p>Ho Chi Minh city - Vietnam</p>
          <p>Phone: (+84) 90 123 6608</p>
          <p>Email: nguyendinhbang53az@gmail.com</p>
        </div>

        <div className="footer-section">
          <h3>Follow Me</h3>
          <div className="social-links">
            <a href="#https://www.facebook.com/bawfng04">
              <FaFacebook />
            </a>
            <a href="#https://www.instagram.com/bawfng04/">
              <FaInstagram />
            </a>
            <a href="#https://www.linkedin.com/in/bawfng04/">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
