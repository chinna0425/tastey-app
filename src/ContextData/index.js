import React from 'react'

const ContextData = React.createContext({
  cartData: [],
  addCartItem: () => {},
  onIncrementQuantity: () => {},
  onDecrementQuantity: () => {},
  activePage: () => {},
  isActive: true,
  hambergerOpen: () => {},
  hambergerActive: false,
  onDeleteCartItem: () => {},
  onDeleteEachCartItem: () => {},
})
export default ContextData
