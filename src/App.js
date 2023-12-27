import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import LoginPage from './components/LoginPage'
import Home from './components/HomePage'
import EachRestaurantDetails from './components/EachRestaurantDetails'
import CartPage from './components/CartPage'
import ConfirmOrder from './components/ConfirmOrder'
import ContextData from './ContextData'
import ProtectedRoute from './components/ProtectedRoute'
import NotFoundPage from './components/NotFoundPage'
import './App.css'

const ir = localStorage.getItem('cartItems')
const ie = JSON.parse(ir)
let modified = []
if (ir !== null) {
  modified = ie
}

class App extends Component {
  state = {
    cartData: modified,
    active: true,
    hambergerActive: false,
  }

  addToLocalStorage = data => {
    localStorage.setItem('cartItems', JSON.stringify(data))
  }

  onDeleteCartItem = () => {
    localStorage.removeItem('cartItems')
    this.setState({cartData: []})
  }

  addCartItem = data => {
    const {cartData} = this.state
    const matched = cartData.filter(eachSet => eachSet.id === data.id)
    const matched1 = cartData.map(eachSet => {
      if (eachSet.id === data.id) {
        return {
          ...eachSet,
          quantity: data.quantity,
        }
      }
      return {...eachSet}
    })
    if (matched.length >= 1) {
      this.setState({cartData: matched1})
      this.addToLocalStorage(matched1)
    } else {
      const adding = [...cartData, data]
      this.setState({cartData: adding})
      this.addToLocalStorage(adding)
    }
  }

  hambergerOpen = data => {
    if (data.open) {
      this.setState({hambergerActive: true})
    } else {
      this.setState({hambergerActive: false})
    }
  }

  onIncrementQuantity = data => {
    const {cartData} = this.state
    const matched = cartData.map(eachSet => {
      if (eachSet.id === data.id) {
        return {
          ...eachSet,
          quantity: eachSet.quantity + 1,
        }
      }
      return {...eachSet}
    })
    this.setState({cartData: matched})
    this.addToLocalStorage(matched)
  }

  onDecrementQuantity = data => {
    const {cartData} = this.state
    const matched = cartData.map(eachSet => {
      if (eachSet.id === data.id && eachSet.quantity >= 2) {
        return {
          ...eachSet,
          quantity: eachSet.quantity - 1,
        }
      }
      return {...eachSet}
    })
    this.setState({cartData: matched})
    this.addToLocalStorage(matched)
  }

  activePage = data => {
    if (data.status === 'HOME') {
      this.setState({active: true})
    } else {
      this.setState({active: false})
    }
  }

  onDeleteEachCartItem = data => {
    const {cartData} = this.state
    const extractData = cartData.filter(eachDel => eachDel.id !== data.id)
    this.setState({cartData: extractData})
    this.addToLocalStorage(extractData)
  }

  render() {
    const {cartData, active, hambergerActive} = this.state
    return (
      <ContextData.Provider
        value={{
          addCartItem: this.addCartItem,
          cartData,
          onIncrementQuantity: this.onIncrementQuantity,
          onDecrementQuantity: this.onDecrementQuantity,
          activePage: this.activePage,
          isActive: active,
          hambergerOpen: this.hambergerOpen,
          hambergerActive,
          onDeleteCartItem: this.onDeleteCartItem,
          onDeleteEachCartItem: this.onDeleteEachCartItem,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute
            exact
            path="/restaurant/:id"
            component={EachRestaurantDetails}
          />
          <ProtectedRoute exact path="/cart" component={CartPage} />
          <ProtectedRoute exact path="/orderconfirm" component={ConfirmOrder} />
          <Route exact path="/not-found" component={NotFoundPage} />
          <Redirect to="/not-found" />
        </Switch>
      </ContextData.Provider>
    )
  }
}
export default App
