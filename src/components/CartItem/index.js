import {GrFormSubtract} from 'react-icons/gr'
import {AiOutlinePlus} from 'react-icons/ai'
import {BiRupee} from 'react-icons/bi'
import './index.css'
import ContextData from '../../ContextData'

const CartItem = props => {
  const {eachCart} = props
  const {id, name, imageUrl, foodType, quantity, cost} = eachCart
  return (
    <ContextData.Consumer>
      {value => {
        const {onIncrementQuantity, onDecrementQuantity} = value

        const onIncrementCount = () => {
          onIncrementQuantity({id})
        }

        const onDecrementCount = () => {
          onDecrementQuantity({id})
        }
        return (
          <li className="cart-item-flex-each">
            <div className="mobile-cart-image-container">
              <img
                src={imageUrl}
                alt="name"
                className="mobile-cart-item-image"
              />
            </div>
            <div className="cart-item-flex-inner-each">
              <div className="cart-item-image-text">
                <div className="cart-image-container">
                  <img src={imageUrl} alt={name} className="cart-item-image" />
                </div>
                <h1 className="cart-item-title-style">{foodType}</h1>
              </div>
              <div className="increment-decrement-container cart-items-button-set">
                <button
                  type="button"
                  className="add-increment-decrement"
                  key={id}
                  onClick={onDecrementCount}
                >
                  <GrFormSubtract
                    aria-label="substract"
                    className="add-sub-icons"
                  />
                </button>
                <span className="quantity-style">{quantity}</span>
                <button
                  type="button"
                  onClick={onIncrementCount}
                  className="add-increment-decrement"
                >
                  <AiOutlinePlus aria-label="plus" className="add-sub-icons" />
                </button>
              </div>
              <p className="cartitem-bill">
                <BiRupee />
                {cost * quantity}.00
              </p>
            </div>
          </li>
        )
      }}
    </ContextData.Consumer>
  )
}
export default CartItem
