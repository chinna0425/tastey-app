import Header from '../Header'
import ContextData from '../../ContextData'
import './index.css'

const ConfirmOrder = props => (
  <ContextData.Consumer>
    {value => {
      const {activePage} = value
      const onOrderToHomePage = () => {
        const {history} = props
        activePage({status: 'HOME'})
        history.replace('/')
      }
      return (
        <>
          <Header />
          <div className="order-page-main-container">
            <div className="order-page-inner-container">
              <img
                src="https://res.cloudinary.com/chinna25/image/upload/v1694011393/check-circle.1_1_hjli6v.png"
                alt="success"
              />
              <h1 className="order-page-title">Payment Successful</h1>
              <p className="order-page-para">Thank You for your ordering</p>
              <p className="order-page-para">
                Your Payment is Successfully Completed.
              </p>
              <button
                type="button"
                onClick={onOrderToHomePage}
                className="order-page-home-button"
              >
                Go To Home Page
              </button>
            </div>
          </div>
        </>
      )
    }}
  </ContextData.Consumer>
)
export default ConfirmOrder
