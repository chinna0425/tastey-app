import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginPage extends Component {
  state = {
    username: '',
    password: '',
    errorText: '',
    loading: false,
  }

  // AbortController instance for cancelling fetch on unmount / cancel previous requests
  abortController = null
  _isMounted = false

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
    if (this.abortController) {
      try {
        this.abortController.abort()
      } catch (e) {
        // ignore
      }
    }
  }

  onUsernameChange = event => {
    this.setState({username: event.target.value})
  }

  onPasswordChange = event => {
    this.setState({password: event.target.value})
  }

  safeSetState = (newState, cb) => {
    // only set state if component still mounted
    if (this._isMounted) {
      this.setState(newState, cb)
    }
  }

  /**
   * doLogin: improved behaviour
   * - prevents parallel requests
   * - aborts previous request
   * - logs status / body for debugging
   * - tries JSON parse, falls back to text
   * - surfaces helpful error message for network/CORS issues
   */
  doLogin = async (username, password) => {
    const {loading} = this.state
    if (loading) return

    // Start loading and clear previous error
    this.safeSetState({loading: true, errorText: ''})

    // Abort previous request if present
    if (this.abortController) {
      try {
        this.abortController.abort()
      } catch (e) {
        // ignore
      }
    }

    // Create new controller for this request
    this.abortController = new AbortController()
    const signal = this.abortController.signal

    try {
      const userDetails = {username, password}
      const options = {
        method: 'POST',
        body: JSON.stringify(userDetails),
        signal,
      }

      console.log('[Login] Sending request to /login', userDetails)
      const resp = await fetch('https://apis.ccbp.in/login', options)

      // Log basic response info
      console.log(
        '[Login] fetch completed. status:',
        resp.status,
        'ok:',
        resp.ok,
      )

      // Try parse JSON, fallback to text if parse fails
      let res = {}
      try {
        res = await resp.json()
      } catch (jsonErr) {
        const txt = await resp.text().catch(() => '')
        console.warn('[Login] Failed to parse JSON, raw text:', txt)
        res = {rawText: txt}
      }

      console.log('[Login] response body:', res)

      // If component unmounted while waiting, stop (no state updates)
      if (!this._isMounted) {
        console.log(
          '[Login] component unmounted before response; ignoring result',
        )
        return
      }

      // Success case: server responded with ok and jwt_token
      if (resp.ok && res.jwt_token) {
        console.log('[Login] success — setting cookie')
        // set secure flag only when on HTTPS
        const cookieOptions =
          typeof window !== 'undefined' &&
          window.location &&
          window.location.protocol === 'https:'
            ? {expires: 30, secure: true, sameSite: 'Lax'}
            : {expires: 30, sameSite: 'Lax'}

        Cookies.set('jwt_token', res.jwt_token, cookieOptions)

        // Clear fields and navigate
        this.safeSetState({username: '', password: '', errorText: ''}, () => {
          const {history} = this.props
          if (history && typeof history.replace === 'function') {
            history.replace('/')
          } else {
            // Fallback: rely on Redirect in render
            console.warn(
              '[Login] history.replace not available; relying on Redirect',
            )
          }
        })
      } else {
        // Prefer common server error keys; otherwise show statusText or rawText
        const msg =
          res.error_msg ||
          res.error_message ||
          res.error ||
          (res.rawText ? res.rawText : null) ||
          resp.statusText ||
          `Login failed (status ${resp.status})`

        console.warn('[Login] server-side error:', msg)
        this.safeSetState({errorText: msg})
      }
    } catch (err) {
      // Log full error object — useful for CORS / network diagnostics
      console.error('[Login] fetch threw error:', err)

      if (err && err.name === 'AbortError') {
        // request was aborted — expected during cancellation/unmount
        console.log('[Login] request aborted by AbortController')
      } else {
        // Common runtime errors in fetch show up as TypeError: Failed to fetch (CORS/network)
        const friendly =
          err && err.message
            ? `Network error: ${err.message}`
            : 'Network error. Please try again.'
        this.safeSetState({errorText: friendly})
      }
    } finally {
      // always stop spinner (only if still mounted)
      this.safeSetState({loading: false})
    }
  }

  onSubmitData = event => {
    event.preventDefault()
    const {username, password, loading} = this.state
    if (loading) return
    if (!username.trim() || !password) {
      this.setState({errorText: 'Please enter username and password'})
      return
    }
    this.doLogin(username.trim(), password)
  }

  onGuestAccount = () => {
    const {loading} = this.state
    if (loading) return
    // use the guest credentials
    this.doLogin('rahul', 'rahul@2021')
  }

  render() {
    const {username, password, errorText, loading} = this.state
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
              alt="Tasty Kitchens logo"
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
                aria-label="username"
                autoComplete="username"
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
                aria-label="password"
                autoComplete="current-password"
              />
              <br />
              {errorText.length > 0 && (
                <p className="loginerror-text" role="alert">
                  {errorText}
                </p>
              )}

              {/* Login button with spinner */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
                aria-busy={loading}
              >
                <span className={`btn-spinner ${loading ? 'show' : ''}`} />
                <span className="btn-text">
                  {loading ? 'Logging in...' : 'Login'}
                </span>
              </button>
              <br />
              {/* Guest button with spinner */}
              <button
                onClick={this.onGuestAccount}
                type="button"
                className="login-button"
                disabled={loading}
              >
                <span className={`btn-spinner ${loading ? 'show' : ''}`} />
                <span className="btn-text">
                  {loading ? 'Please wait...' : 'Guest'}
                </span>
              </button>
            </form>
          </div>
        </div>
        <div className="logo-second-container">
          <img
            src="https://res.cloudinary.com/chinna25/image/upload/v1693632818/f4wtrw38mwa6fzu4kegn.jpg"
            alt="Food items illustration"
            className="login-items-image"
          />
          <img
            src="https://res.cloudinary.com/chinna25/image/upload/v1694068142/Rectangle_1457_wsux2l.png"
            alt="Decorative items"
            className="mobile-login-items-image"
          />
          <h1 className="login-heading mobile-login-heading">Login</h1>
        </div>
      </div>
    )
  }
}

export default LoginPage
