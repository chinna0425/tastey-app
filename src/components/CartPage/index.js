import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BiRupee} from 'react-icons/bi'
import Header from '../Header'
import ContextData from '../../ContextData'
import CartItem from '../CartItem'
import './index.css'

class CartPage extends Component {
  onEachCartItem = () => (
    <ContextData.Consumer>
      {value => {
        const {cartData} = value
        const onTotalBill = () => {
          let total = 0
          const bill = cartData.map(eachCost => {
            total += eachCost.quantity * eachCost.cost
            return total
          })
          return total
        }
        return (
          <>
            <ul className="unorder-list-cartpage-container">
              {cartData.map(eachCart => (
                <CartItem eachCart={eachCart} key={eachCart.id} />
              ))}
            </ul>
            <hr className="hr-line" />
            <div className="total-bill-counter">
              <div className="total-bill-inner-counter">
                <h1 className="order-total-title">Order Total :</h1>
                <div>
                  <h1 className="order-total-title grand-total">
                    <BiRupee />
                    {onTotalBill()}.00
                  </h1>
                  <Link to="/orderconfirm">
                    <button type="button" className="place-order-style">
                      Place Order
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )
      }}
    </ContextData.Consumer>
  )

  render() {
    return (
      <ContextData.Consumer>
        {value => {
          const {cartData, onDeleteCartItem, activePage} = value
          const removeFromCart = () => {
            onDeleteCartItem()
          }
          const goToHomePage = () => {
            activePage({status: 'HOME'})
            const {history} = this.props
            history.replace('/')
          }
          return (
            <>
              <Header />
              {cartData.length > 0 ? (
                <div className="cart-clear-all-container">
                  <div className="cart-clear-all-inner-container">
                    <button
                      type="button"
                      className="clear-all"
                      onClick={removeFromCart}
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              ) : null}
              {cartData.length > 0 ? (
                <div className="cartpage-container">
                  <div className="descriptions-container">
                    <h1 className="cart-title">Item</h1>
                    <h1 className="cart-title">Quantity</h1>
                    <h1 className="cart-title">Price</h1>
                  </div>
                  {this.onEachCartItem()}
                </div>
              ) : (
                <div className="cart-page-loader-container">
                  <div className="cart-page-inner-container">
                    <img
                      src="https://res.cloudinary.com/chinna25/image/upload/v1694065979/Layer_2_pepuaf.png"
                      alt="no-cart-items"
                      className="cart-empty-image"
                    />
                    <h1 className="cart-page-no-orders-title">
                      No Orders Yet!
                    </h1>
                    <p className="cart-empty-para">
                      Your cart is empty Add something from the menu.
                    </p>
                    <button
                      type="button"
                      onClick={goToHomePage}
                      className="place-order-style"
                    >
                      Order now
                    </button>
                  </div>
                </div>
              )}
            </>
          )
        }}
      </ContextData.Consumer>
    )
  }
}
export default CartPage
