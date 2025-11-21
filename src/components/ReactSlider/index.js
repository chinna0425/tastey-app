import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'
import SliderItem from '../SliderItem'
import './index.css'

const dataStatus = {success: 'SUCCESS', initial: 'INITIAL', failure: 'FAILURE'}
const settings = {
  dots: true,
  arrows: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  speed: 30000,
  autoplaySpeed: 100,
  cssEase: 'linear',
}

class ReactSlider extends Component {
  state = {offers: [], status: dataStatus.initial}

  componentDidMount() {
    this.getCarousalItems()
  }

  getCarousalItems = async () => {
    const jwt = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const fetchCarousal = await fetch(
      'https://apis.ccbp.in/restaurants-list/offers',
      options,
    )
    const res = await fetchCarousal.json()

    if (fetchCarousal.ok) {
      const offers = res.offers.map(eachItem => ({
        imageUrl: eachItem.image_url,
        id: eachItem.id,
      }))
      this.setState({offers, status: dataStatus.success})
    } else {
      this.setState({status: dataStatus.failure})
    }
  }

  onLoadingData = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#F7931E" height="50" width="50" />
    </div>
  )

  onDataSuccess = () => {
    const {offers} = this.state
    return (
      <Slider {...settings}>
        {offers.map(each => (
          <SliderItem each={each} key={each.id} />
        ))}
      </Slider>
    )
  }

  onCheckData = () => {
    const {status} = this.state
    switch (status) {
      case dataStatus.success:
        return this.onDataSuccess()
      case dataStatus.failure:
        return <h1>Hello</h1>
      default:
        return this.onLoadingData()
    }
  }

  render() {
    return <div className="slick-container">{this.onCheckData()}</div>
  }
}
export default ReactSlider
