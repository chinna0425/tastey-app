import React, {Component} from 'react'
import {GrFormSubtract} from 'react-icons/gr'
import {AiOutlinePlus} from 'react-icons/ai'
import {BiRupee} from 'react-icons/bi'
import {BsFillStarFill} from 'react-icons/bs'
import './index.css'
import ContextData from '../../ContextData'

class EachFoodCard extends Component {
  state = {quantity: 1, active: false}

  componentDidMount() {
    const {eachSet} = this.props
    const {cartData} = this.context
    const cartItem = cartData?.find(item => item.id === eachSet.id)
    if (cartItem) {
      this.setState({quantity: cartItem.quantity, active: true})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {eachSet} = this.props
    const {cartData} = this.context
    const cartItem = cartData?.find(item => item.id === eachSet.id)

    if (
      cartItem &&
      (!prevState.active || prevState.quantity !== cartItem.quantity)
    ) {
      this.setState({quantity: cartItem.quantity, active: true})
    } else if (!cartItem && prevState.active) {
      this.setState({quantity: 1, active: false})
    }
  }

  updateCart = quantity => {
    const {eachSet} = this.props
    const {imageUrl, foodType, id, cost, name} = eachSet
    if (quantity <= 0) {
      this.context.onDeleteEachCartItem({id})
    } else {
      this.context.addCartItem({imageUrl, foodType, quantity, id, cost, name})
    }
  }

  onIncrementCount = () => {
    this.setState(prev => {
      const newQty = prev.quantity + 1
      this.updateCart(newQty)
      return {quantity: newQty, active: true}
    })
  }

  onDecrementCount = () => {
    this.setState(prev => {
      const newQty = prev.quantity - 1
      this.updateCart(newQty)
      if (newQty < 1) return {quantity: 1, active: false}
      return {quantity: newQty}
    })
  }

  onAddClick = () => {
    this.updateCart(1)
    this.setState({quantity: 1, active: true})
  }

  render() {
    const {eachSet} = this.props
    const {quantity, active} = this.state
    const {cost, name, rating, imageUrl} = eachSet

    return (
      <li className="each-food-card-container">
        <img src={imageUrl} alt={name} className="card-image" loading="lazy" />
        <div>
          <h1 className="food-card-title">{name}</h1>
          <p className="food-card-para-style">
            <BiRupee /> {cost}
          </p>
          <p className="food-card-para-style">
            <BsFillStarFill className="food-card-rating-symbol" /> {rating}
          </p>

          {active ? (
            <div className="increment-decrement-container">
              <button
                type="button"
                className="add-increment-decrement"
                onClick={this.onDecrementCount}
              >
                <GrFormSubtract
                  aria-label="decrement"
                  className="add-sub-icons"
                />
              </button>
              <span className="quantity-style">{quantity}</span>
              <button
                type="button"
                className="add-increment-decrement"
                onClick={this.onIncrementCount}
              >
                <AiOutlinePlus
                  aria-label="increment"
                  className="add-sub-icons"
                />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="food-card-add"
              onClick={this.onAddClick}
            >
              Add
            </button>
          )}
        </div>
      </li>
    )
  }
}

EachFoodCard.contextType = ContextData

export default EachFoodCard
