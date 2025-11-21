import {Link} from 'react-router-dom'
import './index.css'

const NotFoundpage = () => (
  <div className="not-found-page-container">
    <img
      src="https://res.cloudinary.com/chinna25/image/upload/v1694067333/Group_1_f33dke.png"
      alt="not-found"
      loading="lazy"
    />
    <h1 className="not-found-no-orders-title">Page Not Found</h1>
    <p className="not-found-empty-para">
      We are sorry,the page you requested could not be found.
    </p>
    <p className="not-found-empty-para">Please go back to the homepage.</p>
    <Link to="/">
      <button type="button" className="not-found-place-order-style">
        Home Page
      </button>
    </Link>
  </div>
)
export default NotFoundpage
