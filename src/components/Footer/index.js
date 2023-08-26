import './index.css'
import {BsGoogle, BsInstagram, BsTwitter} from 'react-icons/bs'
import {AiFillYoutube} from 'react-icons/ai'
import {BiLogoGoogle} from 'react-icons/bi'

const Footer = () => (
  <div>
    <div className="footer-icons">
      <BiLogoGoogle />
      <BsTwitter />
      <BsInstagram />
      <AiFillYoutube />
    </div>
    <p>Contact Us</p>
  </div>
)

export default Footer
