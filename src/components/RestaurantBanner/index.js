import {BsFillStarFill} from 'react-icons/bs'
import {BiRupee} from 'react-icons/bi'
import './index.css'

const RestaurantBanner = props => {
  const {bannerData} = props
  const {
    imageUrl,
    name,
    id,
    location,
    rating,
    cuisine,
    costForTwo,
    reviewsCount,
  } = bannerData
  return (
    <div className="restaurant-banner">
      <div className="inner-banner-container" key={id}>
        <img src={imageUrl} alt={name} className="each-restau-banner-image" />
        <div>
          <h1 className="each-banner-heading">{name}</h1>
          <p className="each-banner-para">{cuisine}</p>
          <p className="each-banner-para">{location}</p>
          <div className="banner-ratings-cost-container">
            <div>
              <div className="banner-rating-container">
                <BsFillStarFill className="banner-rating-star" />
                <span className="each-banner-para">{rating}</span>
              </div>
              <p className="banner-rating-container each-banner-para">
                {reviewsCount}+ Rating
              </p>
            </div>
            <hr className="banner-line" />
            <div>
              <p className="banner-rating-container each-banner-para para-extra-style ">
                <BiRupee /> {costForTwo}
              </p>
              <p className="each-banner-para para-extra-style">Cost for two</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default RestaurantBanner
