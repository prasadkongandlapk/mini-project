import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {username: '', showError: '', password: '', error: ''}

  onSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onError = error => {
    this.setState({showError: true, error})
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSuccess(data.jwt_token)
    } else {
      this.onError(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, showError, error} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-background">
        <img
          className="login-page-image"
          src="https://res.cloudinary.com/dmmkzeslp/image/upload/v1692863030/Rectangle_1467_hv1tr8.jpg"
          alt="login"
        />
        <div className="login-credentials-card">
          <div className="logo">
            <img
              className="logo-img"
              src="https://res.cloudinary.com/dmmkzeslp/image/upload/v1692865041/Group_7730_p3vctx.svg"
              alt="website logo"
            />
            <p className="logo-text">ook Hub</p>
          </div>
          <form onSubmit={this.onSubmitForm}>
            <div className="username-card">
              <label className="login-label" htmlFor="username">
                username*
              </label>
              <input
                onChange={this.onChangeUsername}
                className="login-input"
                id="username"
                type="text"
                value={username}
                placeholder="Username"
              />
            </div>

            <div className="password-card">
              <label className="login-label" htmlFor="password">
                Password*
              </label>
              <input
                onChange={this.onChangePassword}
                className="login-input"
                placeholder="Password"
                id="password"
                type="password"
                value={password}
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
            {showError && <p className="error-msg">{error}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
