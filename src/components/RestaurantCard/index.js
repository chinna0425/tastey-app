import React from 'react'
import {Link} from 'react-router-dom'
import {BsFillStarFill} from 'react-icons/bs'
import './index.css'

const RestaurantsCard = props => {
  const {eachCard} = props
  const {imageUrl, name, cuisine, userRating, id} = eachCard
  const {rating, totalReviews} = userRating
  return (
    <Link to={`/restaurant/${id}`} className="card-link-style">
      <li className="restaurant-card-item">
        <img
          src={imageUrl}
          alt="1"
          className="card-item-image"
          loading="lazy"
        />
        <div className="text-container">
          <h1 className="card-item-title">{name}</h1>
          <p className="card-item-cuisine">{cuisine}</p>
          <div className="card-rating-container">
            <BsFillStarFill className="card-item-icon-rating" />
            <p className="card-item-rating">
              {rating}{' '}
              <span className="card-span-element">
                ({totalReviews} ratings)
              </span>
            </p>
          </div>
        </div>
      </li>
    </Link>
  )
}
export default React.memo(RestaurantsCard)
