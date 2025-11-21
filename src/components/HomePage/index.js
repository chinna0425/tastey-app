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
  {id: 0, displayText: 'Highest', value: 'Highest'},
  {id: 2, displayText: 'Lowest', value: 'Lowest'},
]

const dataStatus = {success: 'SUCCESS', initial: 'INITIAL', failure: 'FAILURE'}

class Home extends Component {
  state = {
    restaurants: [],
    offset: 0,
    LIMIT: 9,
    sortOrder: sortByOptions[1].value,
    status: dataStatus.initial,
    loading: false,
    searchInput: '',
  }

  abortController = null

  componentDidMount() {
    this.jwtHeader = {
      headers: {Authorization: `Bearer ${Cookies.get('jwt_token')}`},
    }

    // Load saved page from localStorage
    const savedPage = parseInt(localStorage.getItem('activePage')) || 1
    const savedOffset = (savedPage - 1) * this.state.LIMIT

    this.setState({offset: savedOffset}, this.getFetchedData)
  }

  componentWillUnmount() {
    if (this.abortController) {
      try {
        this.abortController.abort()
      } catch {
        null
      }
    }
  }

  safeSetState = (newState, cb) => {
    if (this._isMounted) this.setState(newState, cb)
  }

  getFetchedData = async () => {
    const {offset, LIMIT, sortOrder, searchInput} = this.state
    this.setState({loading: true})

    if (this.abortController) {
      try {
        this.abortController.abort()
      } catch {
        null
      }
    }
    this.abortController = new AbortController()
    const signal = this.abortController.signal

    try {
      const url = `https://apis.ccbp.in/restaurants-list?search=${searchInput.toLowerCase()}&offset=${offset}&limit=${LIMIT}&sort_by_rating=${sortOrder}`
      const resp = await fetch(url, {...this.jwtHeader, signal})
      const res = await resp.json().catch(() => ({}))

      if (resp.ok) {
        const restaurants =
          res.restaurants?.map(item => ({
            id: item.id,
            name: item.name,
            cuisine: item.cuisine,
            imageUrl: item.image_url,
            userRating: {
              rating: item.user_rating.rating,
              totalReviews: item.user_rating.total_reviews,
            },
          })) || []

        this.setState({restaurants, status: dataStatus.success})
      } else if (res.error_message === 'Restaurant Not Found') {
        this.setState({restaurants: [], status: dataStatus.success})
      } else {
        this.setState({status: dataStatus.failure})
      }
    } catch (err) {
      if (err.name !== 'AbortError') this.setState({status: dataStatus.failure})
    } finally {
      this.setState({loading: false})
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

  onOrderChange = event => {
    this.setState(
      {sortOrder: event.target.value, status: dataStatus.initial},
      this.getFetchedData,
    )
  }

  onIncreaseOffSet = offsetVal => {
    const newPage = offsetVal / this.state.LIMIT + 1
    localStorage.setItem('activePage', newPage) // save page in localStorage
    this.setState(
      {offset: offsetVal, status: dataStatus.initial},
      this.getFetchedData,
    )
  }

  onRetryData = () => {
    this.setState(
      {searchInput: '', status: dataStatus.initial},
      this.getFetchedData,
    )
  }

  onLoadingData = () => (
    <div className="restaurants-loader-container" data-testid="loader">
      <Loader type="Bars" color="#F7931E" height="50" width="50" />
    </div>
  )

  NoData = ({imgUrl, title, desc}) => (
    <div className="home-data-notfound-container">
      <img
        src={imgUrl}
        alt="no-data"
        className="no-data-image"
        loading="lazy"
      />
      <h1 className="sort-left-title not-fond-title">{title}</h1>
      <p className="sort-left-desc">{desc}</p>
      <button
        type="button"
        className="retry-button-style"
        onClick={this.onRetryData}
      >
        Retry
      </button>
    </div>
  )

  onDataSuccess = () => {
    const {restaurants} = this.state
    return restaurants.length > 0 ? (
      <ul className="restaurants-container">
        {restaurants.map(eachCard => (
          <RestaurantsCard eachCard={eachCard} key={eachCard.id} />
        ))}
      </ul>
    ) : (
      <this.NoData
        imgUrl="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg?size=626&ext=jpg"
        title="No Search Results"
        desc="Try with new search text."
      />
    )
  }

  onDataFailure = () => (
    <this.NoData
      imgUrl="https://www.digitalmesh.com/blog/wp-content/uploads/2020/05/404-error.jpg"
      title="The Page NotFound"
      desc="Please Reload the page once again."
    />
  )

  onDataFetch = () => {
    const {status, loading} = this.state
    if (loading) return this.onLoadingData()
    switch (status) {
      case dataStatus.success:
        return this.onDataSuccess()
      case dataStatus.failure:
        return this.onDataFailure()
      default:
        return this.onLoadingData()
    }
  }

  render() {
    const {sortOrder, searchInput, restaurants, offset, LIMIT} = this.state
    const currentPage = offset / LIMIT + 1

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
                  <button
                    type="button"
                    onClick={this.onSearchSubmit}
                    className="search-buttons-style"
                  >
                    <BsSearch aria-label="search-icon" />
                  </button>
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

            {restaurants.length > 0 && (
              <Counter
                onIncreaseOffSet={this.onIncreaseOffSet}
                initialPage={currentPage} // pass initial page to Counter
                limit={LIMIT}
              />
            )}
          </div>
          <Footer />
        </div>
      </>
    )
  }
}

export default Home
