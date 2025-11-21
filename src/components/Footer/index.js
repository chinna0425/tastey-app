import {BsTwitter, BsInstagram} from 'react-icons/bs'

import './index.css'

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-logo-flex">
        <img
          src="https://res.cloudinary.com/chinna25/image/upload/v1693844363/Frame_275_ktiaof.png"
          alt="tastey-logo"
          loading="lazy"
        />
        <h1 className="footer-heading-title">Tastey Kitchens </h1>
      </div>
      <p className="footer-para-desc">
        The only thing we are serious about is food.
      </p>
      <p className="footer-para-desc">Contact us on</p>
      <div>
        <img
          src="https://res.cloudinary.com/chinna25/image/upload/v1693844311/Vector_n0shha.png"
          alt="picsart"
          className="footer-picsart"
          loading="lazy"
        />
        <BsInstagram className="instagram" />
        <BsTwitter className="footer-icons item-margin" />
        <img
          src="https://res.cloudinary.com/chinna25/image/upload/v1693845669/App_Logo_Inspiraton_42_vgwlhf.png"
          alt="facebook"
          className="footer-picsart item-margin"
          loading="lazy"
        />
      </div>
    </div>
  )
}
