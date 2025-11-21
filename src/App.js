import React, {Component, Suspense} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import ContextData from './ContextData'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

// Lazy-loaded route components
const LoginPage = React.lazy(() => import('./components/LoginPage'))
const Home = React.lazy(() => import('./components/HomePage'))
const EachRestaurantDetails = React.lazy(
  () => import('./components/EachRestaurantDetails'),
)
const CartPage = React.lazy(() => import('./components/CartPage'))
const ConfirmOrder = React.lazy(() => import('./components/ConfirmOrder'))
const NotFoundPage = React.lazy(() => import('./components/NotFoundPage'))

class App extends Component {
  state = {
    cartData: [],
    active: true,
    hambergerActive: false,
    hydrated: false,
  }

  componentDidMount() {
    try {
      const raw = localStorage.getItem('cartItems')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          this.setState({cartData: parsed})
        } else {
          localStorage.removeItem('cartItems')
          this.setState({cartData: []})
        }
      }
    } catch (e) {
      console.error('Failed to read cartItems from localStorage:', e)
      localStorage.removeItem('cartItems')
      this.setState({cartData: []})
    } finally {
      this.setState({hydrated: true})
    }
  }

  // Helper: sync cart to localStorage
  syncLocalStorage = cartData => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartData))
    } catch (e) {
      console.error('Failed to write cartItems to localStorage:', e)
    }
  }

  // Delete all cart items
  onDeleteCartItem = () => {
    localStorage.removeItem('cartItems')
    this.setState({cartData: []})
  }

  // Add or update item in cart
  addCartItem = data => {
    this.setState(prevState => {
      const {cartData} = prevState
      const existingItem = cartData.find(item => item.id === data.id)
      let newCart

      if (existingItem) {
        // Update existing item
        if (data.quantity < 1) {
          // Remove if quantity < 1
          newCart = cartData.filter(item => item.id !== data.id)
        } else {
          newCart = cartData.map(item =>
            item.id === data.id ? {...item, quantity: data.quantity} : item,
          )
        }
      } else {
        newCart = data.quantity > 0 ? [...cartData, data] : [...cartData]
      }

      this.syncLocalStorage(newCart)
      return {cartData: newCart}
    })
  }

  // Increment quantity
  onIncrementQuantity = data => {
    this.setState(prevState => {
      const newCart = prevState.cartData.map(item =>
        item.id === data.id ? {...item, quantity: item.quantity + 1} : item,
      )
      this.syncLocalStorage(newCart)
      return {cartData: newCart}
    })
  }

  // Decrement quantity
  onDecrementQuantity = data => {
    this.setState(prevState => {
      const newCart = prevState.cartData
        .map(item =>
          item.id === data.id ? {...item, quantity: item.quantity - 1} : item,
        )
        .filter(item => item.quantity > 0) // remove if quantity <= 0
      this.syncLocalStorage(newCart)
      return {cartData: newCart}
    })
  }

  // Delete single item from cart
  onDeleteEachCartItem = data => {
    this.setState(prevState => {
      const newCart = prevState.cartData.filter(item => item.id !== data.id)
      this.syncLocalStorage(newCart)
      return {cartData: newCart}
    })
  }

  hambergerOpen = data => {
    this.setState({hambergerActive: !!data.open})
  }

  activePage = data => {
    this.setState({active: data.status === 'HOME'})
  }

  render() {
    const {cartData, active, hambergerActive} = this.state

    return (
      <ContextData.Provider
        value={{
          cartData,
          addCartItem: this.addCartItem,
          onIncrementQuantity: this.onIncrementQuantity,
          onDecrementQuantity: this.onDecrementQuantity,
          onDeleteCartItem: this.onDeleteCartItem,
          onDeleteEachCartItem: this.onDeleteEachCartItem,
          activePage: this.activePage,
          isActive: active,
          hambergerOpen: this.hambergerOpen,
          hambergerActive,
        }}
      >
        <Suspense fallback={null}>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute
              exact
              path="/restaurant/:id"
              component={EachRestaurantDetails}
            />
            <ProtectedRoute exact path="/cart" component={CartPage} />
            <ProtectedRoute
              exact
              path="/orderconfirm"
              component={ConfirmOrder}
            />
            <Route exact path="/not-found" component={NotFoundPage} />
            <Redirect to="/not-found" />
          </Switch>
        </Suspense>
      </ContextData.Provider>
    )
  }
}

export default App
