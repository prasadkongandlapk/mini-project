import './index.css'
import {FaGoogle, FaInstagram, FaTwitter, FaYoutube} from 'react-icons/fa'

const Footer = () => (
  <div className="footer-icons-card">
    <div className="footer-icons">
      <FaGoogle className="footer-icon" />
      <FaInstagram className="footer-icon" />
      <FaTwitter className="footer-icon" />
      <FaYoutube className="footer-icon" />
    </div>
    <p className="contact-us">Contact us</p>
  </div>
)

export default Footer
