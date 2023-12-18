import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginPage extends Component {
  state = {username: '', password: '', errorText: ''}

  onUsernameChange = event => {
    this.setState({username: event.target.value})
  }

  onPasswordChange = event => {
    this.setState({password: event.target.value})
  }

  onSubmitData = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const resp = await fetch('https://apis.ccbp.in/login', options)
    const res = await resp.json()
    if (resp.ok) {
      const jwt = {jwtToken: res.jwt_token}
      Cookies.set('jwt_token', jwt.jwtToken, {expires: 30})
      const {history} = this.props
      this.setState({username: '', password: '', errorText: ''})
      history.replace('/')
    } else {
      this.setState({errorText: res.error_msg})
    }
  }

  onGuestAccount = async () => {
    const username = 'rahul'
    const password = 'rahul@2021'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const resp = await fetch('https://apis.ccbp.in/login', options)
    const res = await resp.json()
    const jwt = {jwtToken: res.jwt_token}
    Cookies.set('jwt_token', jwt.jwtToken, {expires: 30})
    const {history} = this.props
    this.setState({username: '', password: '', errorText: ''})
    history.replace('/')
  }

  render() {
    const {username, password, errorText} = this.state
    const jwt = Cookies.get('jwt_token')
    if (jwt !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="LoginMainContainer">
        <div className="loginForm-Container">
          <div className="loginFormCredential-Container">
            <img
              src="https://res.cloudinary.com/chinna25/image/upload/v1693462253/Group_7420_1_xhkarr.png"
              alt="logo"
              className="login-logo"
            />
            <h1 className="logo-main-heading">Tasty Kitchens</h1>
            <h1 className="login-heading">Login</h1>
            <form className="form-container" onSubmit={this.onSubmitData}>
              <label htmlFor="username" className="login-label-text">
                USERNAME
              </label>
              <br />
              <input
                id="username"
                value={username}
                onChange={this.onUsernameChange}
                className="logininput-field"
                placeholder="Username : rahul"
                type="text"
              />
              <br />
              <label htmlFor="password" className="login-label-text">
                PASSWORD
              </label>
              <br />
              <input
                id="password"
                value={password}
                className="logininput-field"
                onChange={this.onPasswordChange}
                placeholder="Password : rahul@2021"
                type="password"
              />
              <br />
              {errorText.length > 0 && (
                <p className="loginerror-text">{errorText}</p>
              )}
              <button type="submit" className="login-button">
                Login
              </button>
              <br />
              <button
                onClick={this.onGuestAccount}
                type="button"
                className="login-button"
              >
                Guest
              </button>
            </form>
          </div>
        </div>
        <div className="logo-second-container">
          <img
            src="https://res.cloudinary.com/chinna25/image/upload/v1693632818/f4wtrw38mwa6fzu4kegn.jpg"
            alt="items"
            className="login-items-image"
          />
          <img
            src="https://res.cloudinary.com/chinna25/image/upload/v1694068142/Rectangle_1457_wsux2l.png"
            alt="items"
            className="mobile-login-items-image"
          />
          <h1 className="login-heading mobile-login-heading">Login</h1>
        </div>
      </div>
    )
  }
}
export default LoginPage
