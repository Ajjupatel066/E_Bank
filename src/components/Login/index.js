import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = error => {
    this.setState({errorMsg: error, showErrorMsg: true})
  }

  submitLogin = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
    console.log(userDetails)
  }

  onChangeUserID = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  render() {
    const {userId, pin, showErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="app-container">
        <div className="responsive-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="website-login-img"
          />
          <form className="login-form" onSubmit={this.submitLogin}>
            <h1 className="heading">Welcome Back!</h1>
            <div className="input-container">
              <label htmlFor="userId" className="label-text">
                User ID
              </label>
              <input
                onChange={this.onChangeUserID}
                value={userId}
                id="userId"
                placeholder="Enter User ID"
                type="text"
                className="input-element"
              />
            </div>
            <div className="input-container">
              <label htmlFor="pin" className="label-text">
                PIN
              </label>
              <input
                id="pin"
                value={pin}
                placeholder="Enter User ID"
                type="password"
                className="input-element"
                onChange={this.onChangePin}
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
