import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaLessThan, FaGreaterThan} from 'react-icons/fa'

import './index.css'

class Counter extends Component {
  constructor(props) {
    super(props)
    const {onIncreaseOffSet} = this.props
    this.state = {
      activePage: 0,
      finalPage: 0,
      onIncreaseOffSet,
    }
  }

  componentDidMount() {
    this.getTotalItems()
  }

  getTotalItems = async () => {
    const jwt = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const resp = await fetch(`https://apis.ccbp.in/restaurants-list`, options)
    const res = await resp.json()
    const {total} = res
    this.setState(prev => ({
      activePage: prev.activePage + 1,
      finalPage: Math.ceil(total / 9),
    }))
  }

  onIncrement = () => {
    const {activePage, finalPage, onIncreaseOffSet} = this.state
    if (activePage + 1 >= 1 && activePage < finalPage) {
      const active = activePage + 1
      this.setState(prev => ({
        activePage: prev.activePage + 1,
      }))
      onIncreaseOffSet((active - 1) * 9)
    }
  }

  onDecrement = () => {
    const {activePage, finalPage, onIncreaseOffSet} = this.state
    const active = activePage - 1
    if (activePage >= 2 && activePage <= finalPage) {
      this.setState(prev => ({
        activePage: prev.activePage - 1,
      }))
      onIncreaseOffSet((active - 1) * 9)
    }
  }

  render() {
    const {activePage, finalPage} = this.state

    return (
      <div className="counter-container">
        <span className="counter-inc-dec-style">
          <FaLessThan onClick={this.onDecrement} />
        </span>
        <div className="counter-numbers">
          <span className="span-ele-style">
            {activePage} of <span className="span-ele-style">{finalPage}</span>
          </span>
        </div>
        <span className="counter-inc-dec-style">
          <FaGreaterThan onClick={this.onIncrement} />
        </span>
      </div>
    )
  }
}

export default Counter
