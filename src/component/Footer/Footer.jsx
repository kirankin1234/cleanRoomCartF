import React from "react";
import "./Footer.css"; // Import the CSS file
import contact from '../Contact_Form/Contact_Form.jsx'
import logo from '../../assets/logo.png'

const Footer = () => {

    const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
    <img style={{width:'150px' , height:'80px',marginLeft: '-853px',marginTop:' 0px'}} src={logo} alt="logo "/>
      <div className="footer-container">
        <div className="footer-section">
          <h6>Cleanroom Cart</h6>
          <hr />
          <p>
            Address: A-302, Binawat Majestic,<br/> Sasane Nagar Rd., <br/>Haveli, Hadapsar,<br/> Pune-411028, Maharashtra <br />
            Email: <a href="mailto:info@cleanroomcart.com">info@cleanroomcart.com</a>
          </p>
        </div>

        <div className="footer-section">
          <h6>Quick Links</h6>
          <hr />
          <ul>
            <li><a href="/login">User Login</a></li>
            <li><a href='/contact_form'>Contact Us</a></li>
            <li><a href="/">Home</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h6>Categories</h6>
          <hr />
          <ul>
            <li><a href="">Cleanroom Apparel</a></li>
            <li><a href="">Cleanroom Equipment</a></li>
            <li><a href="">Cleanrom furniture</a></li>
            <li><a href="">Cleanroom mats</a></li>
            <li><a href="">Sterile supply</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {currentYear} Cleanroom Cart. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
