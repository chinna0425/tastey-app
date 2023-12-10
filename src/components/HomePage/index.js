import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdOutlineSort} from 'react-icons/md'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import HeaderNavbar from '../Header'
import ReactSlider from '../ReactSlider'
import RestaurantsCard from '../RestaurantCard'
import Counter from '../Counter'
import Footer from '../Footer'

import './index.css'

const sortByOptions = [
  {
    id: 0,
    displayText: 'Highest',
    value: 'Highest',
  },
  {
    id: 2,
    displayText: 'Lowest',
    value: 'Lowest',
  },
]

const dataStatus = {success: 'SUCCESS', initial: 'INITIAL', failure: 'FAILURE'}
class Home extends Component {
  state = {
    restaurants: [],
    offset: 0,
    LIMIT: 9,
    sortOrder: sortByOptions[1].value,
    status: dataStatus.initial,
    searchInput: '',
  }

  componentDidMount() {
    this.getFetchedData()
  }

  getFetchedData = async () => {
    const {offset, LIMIT, sortOrder, searchInput} = this.state
    const jwt = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const resp = await fetch(
      `https://apis.ccbp.in/restaurants-list?search=${searchInput.toLowerCase()}&offset=${offset}&limit=${LIMIT}&sort_by_rating=${sortOrder}`,
      options,
    )
    const res = await resp.json()

    if (resp.ok) {
      const restaurants = res.restaurants.map(eachItem => ({
        cuisine: eachItem.cuisine,
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        name: eachItem.name,
        userRating: {
          rating: eachItem.user_rating.rating,
          totalReviews: eachItem.user_rating.total_reviews,
        },
      }))

      this.setState({restaurants, status: dataStatus.success})
    } else if (res.error_message === 'Restaurant Not Found') {
      this.setState({restaurants: [], status: dataStatus.success})
    } else {
      this.setState({status: dataStatus.failure})
    }
  }

  onOrderChange = event => {
    this.setState({sortOrder: event.target.value}, this.getFetchedData)
  }

  onLoadingData = () => (
    <div className="restaurants-loader-container" data-testid="loader">
      <Loader type="Bars" color="#F7931E" height="50" width="50" />
    </div>
  )

  onIncreaseOffSet = offSetVal => {
    this.setState(
      {offset: offSetVal, status: dataStatus.initial},
      this.getFetchedData,
    )
  }

  onDataSuccess = () => {
    const {restaurants} = this.state
    return (
      <>
        {restaurants.length > 0 ? (
          <ul className="restaurants-container">
            {restaurants.map(eachCard => (
              <RestaurantsCard eachCard={eachCard} key={eachCard.id} />
            ))}
          </ul>
        ) : (
          <div className="home-data-notfound-container">
            <img
              src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg?size=626&ext=jpg&ga=GA1.1.279979557.1694026057&semt=ais"
              alt="no-data"
              className="no-data-image"
            />
            <h1 className="sort-left-title not-fond-title">
              No Search Results
            </h1>
            <p className="sort-left-desc">Try with new search text.</p>
            <button
              type="button"
              className="retry-button-style"
              onClick={this.onRetryData}
            >
              Retry
            </button>
          </div>
        )}
      </>
    )
  }

  onDataFailure = () => (
    <div className="home-data-notfound-container">
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

  onDataFetch = () => {
    const {status} = this.state
    switch (status) {
      case dataStatus.success:
        return this.onDataSuccess()
      case dataStatus.failure:
        return this.onDataFailure()
      default:
        return this.onLoadingData()
    }
  }

  onSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchKeySubmit = event => {
    if (event.key === 'Enter') {
      this.setState({status: dataStatus.initial}, this.getFetchedData)
    }
  }

  onSearchSubmit = () => {
    this.setState({status: dataStatus.initial}, this.getFetchedData)
  }

  onRetryData = () => {
    this.setState(
      {searchInput: '', status: dataStatus.initial},
      this.getFetchedData,
    )
  }

  render() {
    const {sortOrder, searchInput, restaurants} = this.state
    return (
      <>
        <HeaderNavbar />
        <div className="home-main-container">
          <ReactSlider />
          <div className="home-middle-container">
            <div className="sort-container">
              <div>
                <h1 className="sort-left-title">Popular Restaurants</h1>
                <p className="sort-left-desc">
                  Select Your favourite restaurant special dish and make your
                  day happy...
                </p>
              </div>
              <div className="sort-right-with-search">
                <div className="search-container">
                  <input
                    type="search"
                    placeholder="Search here.."
                    className="search-input"
                    value={searchInput}
                    onChange={this.onSearchInput}
                    onKeyDown={this.onSearchKeySubmit}
                  />
                  <span className="search-buttons-style">
                    <BsSearch onClick={this.onSearchSubmit} />
                  </span>
                </div>
                <div className="sort-right-container">
                  <MdOutlineSort className="sort-icon-style" />
                  <p className="sort-para-sortby">Sort by</p>
                  <div>
                    <select
                      id="category"
                      value={sortOrder}
                      className="select-style"
                      onChange={this.onOrderChange}
                    >
                      <option value={sortByOptions[1].value}>Lowest</option>
                      <option value={sortByOptions[0].value}>Highest</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {this.onDataFetch()}
            {restaurants.length > 0 ? (
              <Counter onIncreaseOffSet={this.onIncreaseOffSet} />
            ) : null}
          </div>
          <Footer />
        </div>
      </>
    )
  }
}
export default Home
