import './index.css'
import {withRouter, Link} from 'react-router-dom'

const NotFound = () => (
  <div className="not-found-background">
    <img className="not-found-image" src="" alt="not found" />
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-paragraph">
      we are sorry, the page you requested could not be found, Please go back to
      the homepage.
    </p>

    <Link to="/" className="link">
      <button type="button" className="not-found-btn">
        Go Back to Home
      </button>
    </Link>
  </div>
)

export default withRouter(NotFound)
