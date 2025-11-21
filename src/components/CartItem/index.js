import React, {useContext} from 'react'
import {GrFormSubtract} from 'react-icons/gr'
import {AiOutlinePlus} from 'react-icons/ai'
import {MdDelete} from 'react-icons/md'
import {BiRupee} from 'react-icons/bi'
import ContextData from '../../ContextData'
import './index.css'

const CartItem = ({eachCart}) => {
  const {id, name, imageUrl, foodType, quantity, cost} = eachCart
  const {onIncrementQuantity, onDecrementQuantity, onDeleteEachCartItem} =
    useContext(ContextData)

  const totalCost = cost * quantity

  return (
    <li className="cart-item-flex-each">
      <div className="mobile-cart-image-container">
        <img src={imageUrl} alt={name} className="mobile-cart-item-image" />
      </div>
      <div className="cart-item-flex-inner-each">
        <div className="cart-item-image-text">
          <div className="cart-image-container">
            <img src={imageUrl} alt={name} className="cart-item-image" />
          </div>
          <h1 className="cart-item-title-style">{name}</h1>
        </div>
        <div className="increment-decrement-container cart-items-button-set">
          <button
            type="button"
            className="add-increment-decrement"
            onClick={() => onDecrementQuantity({id})}
          >
            <GrFormSubtract aria-label="subtract" className="add-sub-icons" />
          </button>
          <span className="quantity-style">{quantity}</span>
          <button
            type="button"
            className="add-increment-decrement"
            onClick={() => onIncrementQuantity({id})}
          >
            <AiOutlinePlus aria-label="plus" className="add-sub-icons" />
          </button>
        </div>
        <p className="cartitem-bill">
          <BiRupee />
          {totalCost}.00
        </p>
      </div>
      <button
        className="delete-button-cross"
        type="button"
        onClick={() => onDeleteEachCartItem({id})}
        aria-label="delete-icon"
      >
        <MdDelete />
      </button>
    </li>
  )
}

export default React.memo(CartItem)
