import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const ConfirmOrder = () => (
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
        <Link to="/">
          <button type="button" className="order-page-home-button">
            Go To Home Page
          </button>
        </Link>
      </div>
    </div>
  </>
)
export default ConfirmOrder
