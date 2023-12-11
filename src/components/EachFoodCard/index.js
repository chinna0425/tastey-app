import {Component} from 'react'
import {GrFormSubtract} from 'react-icons/gr'
import {AiOutlinePlus} from 'react-icons/ai'
import {BiRupee} from 'react-icons/bi'
import {BsFillStarFill} from 'react-icons/bs'
import './index.css'
import ContextData from '../../ContextData'

class EachFoodCard extends Component {
  state = {quantity: 1, active: false}

  render() {
    return (
      <ContextData.Consumer>
        {value => {
          const {addCartItem} = value
          const {eachSet} = this.props
          const {quantity, active} = this.state
          const {cost, id, name, foodType, rating, imageUrl} = eachSet

          const onIncrementCount = () => {
            const increase = quantity + 1
            const data = {imageUrl, foodType, quantity: increase, id, cost}
            addCartItem(data)
            this.setState(prev => ({
              quantity: prev.quantity + 1,
            }))
          }

          const onDecrementCount = () => {
            const decrease = quantity - 1
            const data = {imageUrl, foodType, quantity: decrease, id, cost}
            addCartItem(data)
            this.setState(prev => {
              const va = prev.quantity
              if (va <= 1) {
                return {quantity: 1}
              }
              return {quantity: prev.quantity - 1}
            })
          }

          const onDisableAdd = () => {
            const data = {imageUrl, foodType, quantity, id, cost}
            addCartItem(data)
            this.setState({active: true})
          }

          return (
            <li className="each-food-card-container">
              <img src={imageUrl} alt={name} className="card-image" />
              <div>
                <h1 className="food-card-title">{name}</h1>
                <p className="food-card-para-style">
                  <BiRupee /> {cost}
                </p>
                <p className="food-card-para-style">
                  <BsFillStarFill className="food-card-rating-symbol" />{' '}
                  {rating}
                </p>
                {active ? (
                  <div className="increment-decrement-container">
                    <button
                      type="button"
                      onClick={onDecrementCount}
                      key={id}
                      className="add-increment-decrement"
                    >
                      <GrFormSubtract
                        aria-label="form-substract"
                        className="add-sub-icons"
                      />
                    </button>
                    <span className="quantity-style">{quantity}</span>
                    <button
                      type="button"
                      onClick={onIncrementCount}
                      className="add-increment-decrement"
                    >
                      <AiOutlinePlus
                        aria-label="form-plus"
                        className="add-sub-icons"
                      />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="food-card-add"
                    onClick={onDisableAdd}
                    key={id}
                  >
                    Add
                  </button>
                )}
              </div>
            </li>
          )
        }}
      </ContextData.Consumer>
    )
  }
}
export default EachFoodCard
