import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaLessThan, FaGreaterThan} from 'react-icons/fa'

import './index.css'

class Counter extends Component {
  constructor(props) {
    super(props)
    const {initialPage = 1} = this.props
    this.state = {
      activePage: initialPage,
      finalPage: 0,
    }
  }

  componentDidMount() {
    this.getTotalItems()
  }

  getTotalItems = async () => {
    const jwt = Cookies.get('jwt_token')
    const options = {headers: {Authorization: `Bearer ${jwt}`}}
    const resp = await fetch(`https://apis.ccbp.in/restaurants-list`, options)
    const res = await resp.json()
    const {total} = res
    this.setState({finalPage: Math.ceil(total / 9)})
  }

  onIncrement = () => {
    const {activePage, finalPage} = this.state
    const {onIncreaseOffSet, limit = 9} = this.props
    if (activePage < finalPage) {
      const newPage = activePage + 1
      this.setState({activePage: newPage})
      localStorage.setItem('activePage', newPage)
      onIncreaseOffSet((newPage - 1) * limit)
    }
  }

  onDecrement = () => {
    const {activePage} = this.state
    const {onIncreaseOffSet, limit = 9} = this.props
    if (activePage > 1) {
      const newPage = activePage - 1
      this.setState({activePage: newPage})
      localStorage.setItem('activePage', newPage)
      onIncreaseOffSet((newPage - 1) * limit)
    }
  }

  render() {
    const {activePage, finalPage} = this.state

    return (
      <div className="counter-container">
        <button
          type="button"
          onClick={this.onDecrement}
          className="counter-inc-dec-style"
        >
          <FaLessThan aria-label="lessthan" />
        </button>
        <div className="counter-numbers">
          <span className="span-ele-style">
            {activePage} of <span className="span-ele-style">{finalPage}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={this.onIncrement}
          className="counter-inc-dec-style"
        >
          <FaGreaterThan aria-label="greater" />
        </button>
      </div>
    )
  }
}

export default Counter
