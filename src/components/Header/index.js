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
    <nav>
      <ul className="header-background">
        <Link to="/" className="link">
          <li className="header-logo-card">
            <img
              className="header-logo"
              src="https://res.cloudinary.com/dmmkzeslp/image/upload/v1692865041/Group_7730_p3vctx.svg"
              alt="website logo"
            />
            <p className="header-logo-text">ook Hub</p>
          </li>
        </Link>

        <div className="anchor-elements-card">
          <Link to="/" className="link">
            <li>
              <h1 className="home-anchor-element">Home</h1>
            </li>
          </Link>
          <Link to="/books" className="link">
            <li>
              <h1 className="bookshelves-anchor-element">BookShelves</h1>
            </li>
          </Link>
          <li>
            <button className="logout-button" type="button" onClick={onLogout}>
              Logout
            </button>
          </li>
        </div>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
