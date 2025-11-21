import {NavLink, Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import Popup from 'reactjs-popup'
import {FaBars} from 'react-icons/fa'
import {AiFillCloseCircle} from 'react-icons/ai'
import ContextData from '../../ContextData'

import './index.css'

const HeaderNavbar = props => (
  <ContextData.Consumer>
    {value => {
      const {hambergerActive, hambergerOpen, cartData} = value
      const onLogOutPage = () => {
        const {history} = props
        hambergerOpen({open: false})
        Cookies.remove('jwt_token')
        history.replace('/login')
      }

      const cartItemsCount = cartData.length

      const onHambrgerOpen = () => {
        hambergerOpen({open: true})
      }
      const onHambrgerClose = () => {
        hambergerOpen({open: false})
      }

      const {location} = props
      const pathname = location.pathname
      const isRestaurantPath = pathname.startsWith('/restaurant')

      return (
        <nav className="nav-main-container" id="navbar">
          <div className="nav-inner-container">
            <NavLink to="/" exact className="header-nav-item-links">
              <div className="header-logo-container">
                <img
                  src="https://res.cloudinary.com/chinna25/image/upload/v1693462253/Group_7420_1_xhkarr.png"
                  alt="logo"
                />
                <h1 className="header-main-heading">Tastey Kitchen</h1>
              </div>
            </NavLink>
            <div className="header-nav-items">
              <NavLink
                to="/"
                exact
                className={`header-nav-item-links ${
                  isRestaurantPath ? 'active' : ''
                }`}
              >
                Home
              </NavLink>
              <NavLink to="/cart" exact className="header-nav-item-links">
                Cart <sup className="items-count">({cartItemsCount})</sup>
              </NavLink>

              <Popup
                modal
                trigger={
                  <button type="button" className="header-logout">
                    Logout
                  </button>
                }
              >
                {close => (
                  <div className="popup-container">
                    <h1 className="popup-title">Are you sure to Logout</h1>
                    <div>
                      <button
                        type="button"
                        onClick={() => close()}
                        className="cancel-button"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={onLogOutPage}
                        className="cancel-button confirm-button"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            </div>
            <div className="mobile-header-ham-berger">
              <FaBars className="list-opener" onClick={onHambrgerOpen} />
            </div>
          </div>
          {hambergerActive && (
            <div className="mobile-header-nav-items">
              <NavLink
                to="/"
                exact
                className={`header-nav-item-links ${
                  isRestaurantPath ? 'active' : ''
                }`}
              >
                Home
              </NavLink>
              <NavLink to="/cart" exact className="header-nav-item-links">
                Cart
              </NavLink>

              <Popup
                modal
                trigger={
                  <button type="button" className="header-logout">
                    Logout
                  </button>
                }
              >
                {close => (
                  <div className="popup-container">
                    <h1 className="popup-title">Are you sure to Logout</h1>
                    <div>
                      <button
                        type="button"
                        onClick={() => close()}
                        className="cancel-button"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={onLogOutPage}
                        className="cancel-button confirm-button"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
              <AiFillCloseCircle
                className="list-closer"
                onClick={onHambrgerClose}
              />
            </div>
          )}
        </nav>
      )
    }}
  </ContextData.Consumer>
)

export default withRouter(HeaderNavbar)
