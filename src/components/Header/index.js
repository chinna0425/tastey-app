import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import Popup from 'reactjs-popup'
import {FaBars} from 'react-icons/fa'
import {AiFillCloseCircle} from 'react-icons/ai'
import ContextData from '../../ContextData'

import './index.css'

const HeaderNavbar = props => (
  <ContextData.Consumer>
    {value => {
      const {activePage, isActive, hambergerActive, hambergerOpen} = value
      const onLogOutPage = () => {
        const {history} = props
        Cookies.remove('jwt_token')
        history.replace('/login')
      }
      const changePageHome = () => {
        activePage({status: 'HOME'})
      }
      const changePageCart = () => {
        activePage({status: 'CART'})
      }
      const onHambrgerOpen = () => {
        hambergerOpen({open: true})
      }
      const onHambrgerClose = () => {
        hambergerOpen({open: false})
      }

      return (
        <nav className="nav-main-container" id="navbar">
          <div className="nav-inner-container">
            <Link to="/" className="nav-link-style" onClick={changePageHome}>
              <div className="header-logo-container">
                <img
                  src="https://res.cloudinary.com/chinna25/image/upload/v1693462253/Group_7420_1_xhkarr.png"
                  alt="logo"
                />
                <h1 className="header-main-heading">Tastey Kitchen</h1>
              </div>
            </Link>
            <div className="header-nav-items">
              <Link
                to="/"
                className={`header-nav-item-links ${
                  isActive ? 'active-color' : null
                }`}
                onClick={changePageHome}
              >
                Home
              </Link>
              <Link
                to="/cart"
                className={`header-nav-item-links ${
                  !isActive ? 'active-color' : null
                }`}
                onClick={changePageCart}
              >
                Cart
              </Link>

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
              <Link
                to="/"
                className={`header-nav-item-links ${
                  isActive ? 'active-color' : null
                }`}
                onClick={changePageHome}
              >
                Home
              </Link>
              <Link
                to="/cart"
                className={`header-nav-item-links ${
                  !isActive ? 'active-color' : null
                }`}
                onClick={changePageCart}
              >
                Cart
              </Link>

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
