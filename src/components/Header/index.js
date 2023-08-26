import './index.css'
import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="header-background">
      <Link to="/">
        <div className="header-logo-card">
          <img
            className="header-logo"
            src="https://res.cloudinary.com/dmmkzeslp/image/upload/v1692865041/Group_7730_p3vctx.svg"
            alt="website logo"
          />
          <p className="header-logo-text">ook Hub</p>
        </div>
      </Link>

      <div className="anchor-elements-card">
        <Link to="/">
          <p className="home-anchor-element">Home</p>
        </Link>
        <Link to="books">
          <p className="bookshelves-anchor-element">BookShelves</p>
        </Link>

        <button className="logout-button" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default withRouter(Header)
