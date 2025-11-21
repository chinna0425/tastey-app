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
  state = {
    status: dataStatus.initial,
    foodresults: [],
    bannerData: {},
  }

  abortController = null
  _isMounted = false

  componentDidMount() {
    this._isMounted = true
    this.getFetchedData()
  }

  componentWillUnmount() {
    this._isMounted = false
    if (this.abortController) this.abortController.abort()
  }

  safeSetState = (newState, cb) => {
    if (this._isMounted) this.setState(newState, cb)
  }

  convertFoodItems = foodItems =>
    foodItems.map(item => ({
      cost: item.cost,
      id: item.id,
      name: item.name,
      foodType: item.food_type,
      rating: item.rating,
      imageUrl: item.image_url,
    }))

  getFetchedData = async () => {
    const {
      match: {params},
    } = this.props
    const {id} = params
    const jwt = Cookies.get('jwt_token')
    const options = {
      headers: {Authorization: `Bearer ${jwt}`},
    }

    this.abortController = new AbortController()
    const signal = this.abortController.signal

    this.safeSetState({status: dataStatus.initial})

    try {
      const fetchedData = await fetch(
        `https://apis.ccbp.in/restaurants-list/${id}`,
        {...options, signal},
      )
      const resp = await fetchedData.json()

      if (fetchedData.ok) {
        const bannerData = {
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

        const foodresults = this.convertFoodItems(bannerData.foodItems)
        this.safeSetState({bannerData, foodresults, status: dataStatus.success})
      } else {
        this.safeSetState({status: dataStatus.failure})
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('[EachRestaurantDetails] Fetch error:', err)
        this.safeSetState({status: dataStatus.failure})
      }
    }
  }

  renderLoading = () => (
    <div className="each-restaurant-loader-container" data-testid="loader">
      <Loader type="Bars" color="#F7931E" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div className="each-restaurant-data-notfound-container">
      <img
        src="https://www.digitalmesh.com/blog/wp-content/uploads/2020/05/404-error.jpg"
        alt="no-data"
        className="no-data-image"
      />
      <h1 className="sort-left-title not-fond-title">The Page NotFound</h1>
      <p className="sort-left-desc">Please reload the page once again.</p>
      <button
        type="button"
        className="retry-button-style"
        onClick={this.getFetchedData}
      >
        Retry
      </button>
    </div>
  )

  renderSuccess = () => {
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

  renderContent = () => {
    const {status} = this.state
    switch (status) {
      case dataStatus.success:
        return this.renderSuccess()
      case dataStatus.failure:
        return this.renderFailure()
      default:
        return this.renderLoading()
    }
  }

  render() {
    return (
      <>
        <HeaderNavbar />
        <div className="each-restaurant-container">{this.renderContent()}</div>
        <Footer />
      </>
    )
  }
}

export default EachRestaurantDetails
