import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'
import HeaderNavbar from '../Header'
import RestaurantBanner from '../RestaurantBanner'
import EachFoodCard from '../EachFoodCard'
import Footer from '../Footer'

const dataStatus = {success: 'SUCCESS', initial: 'INITIAL', failure: 'FAILURE'}
class EachRestaurantDetails extends Component {
  state = {status: dataStatus.initial, foodresults: [], bannerData: {}}

  componentDidMount() {
    this.getFetchedData()
  }

  getFetchedData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwt = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const fetchedData = await fetch(
      `https://apis.ccbp.in/restaurants-list/${id}`,
      options,
    )
    const resp = await fetchedData.json()
    if (fetchedData.ok) {
      const convertedData = {
        costForTwo: resp.cost_for_two,
        cuisine: resp.cuisine,
        name: resp.name,
        imageUrl: resp.image_url,
        location: resp.location,
        id: resp.id,
        rating: resp.rating,
        reviewsCount: resp.reviews_count,
        foodItems: resp.food_items,
      }

      const {foodItems} = convertedData
      const convertedFoods = foodItems.map(eachItem => ({
        cost: eachItem.cost,
        id: eachItem.id,
        name: eachItem.name,
        foodType: eachItem.food_type,
        rating: eachItem.rating,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        bannerData: convertedData,
        foodresults: convertedFoods,
        status: dataStatus.success,
      })
    } else {
      this.setState({status: dataStatus.failure})
    }
  }

  onLoadingData = () => (
    <div className="each-restaurant-loader-container" data-testid="loader">
      <Loader type="Bars" color="#F7931E" height="50" width="50" />
    </div>
  )

  onRetryData = () => {
    this.setState({status: dataStatus.initial}, this.getFetchedData)
  }

  getSuccessData = () => {
    const {bannerData, foodresults} = this.state
    return (
      <>
        <RestaurantBanner bannerData={bannerData} />
        <ul className="each-restau-unorder-list">
          {foodresults.map(eachSet => (
            <EachFoodCard eachSet={eachSet} key={eachSet.id} />
          ))}
        </ul>
      </>
    )
  }

  onFailureData = () => (
    <div className="each-restaurant-data-notfound-container">
      <img
        src="https://www.digitalmesh.com/blog/wp-content/uploads/2020/05/404-error.jpg"
        alt="no-data"
        className="no-data-image"
      />
      <h1 className="sort-left-title not-fond-title">The Page NotFound</h1>
      <p className="sort-left-desc">Please Reload the page once again.</p>
      <button
        type="button"
        className="retry-button-style"
        onClick={this.onRetryData}
      >
        Retry
      </button>
    </div>
  )

  onShowingData = () => {
    const {status} = this.state
    switch (status) {
      case dataStatus.success:
        return this.getSuccessData()
      case dataStatus.failure:
        return this.onFailureData()
      default:
        return this.onLoadingData()
    }
  }

  render() {
    return (
      <>
        <HeaderNavbar />
        <div className="each-restaurant-container">
          {this.onShowingData()}
          <Footer />
        </div>
      </>
    )
  }
}
export default EachRestaurantDetails
