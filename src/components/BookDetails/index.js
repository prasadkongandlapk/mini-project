import './index.css'
import Cookies from 'js-cookie'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {AiTwotoneStar} from 'react-icons/ai'
import Header from '../Header'
import Footer from '../Footer'

const status = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class BookDetails extends Component {
  state = {apiStatus: status.loading, isMenubarClicked: false, showFooter: true}

  componentDidMount() {
    this.getBook()
  }

  onClickDeleteLinkBtn = () => {
    this.setState({isMenubarClicked: false})
  }

  onClickTryAgain = () => {
    this.getBook()
  }

  getBook = async () => {
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {bookid} = params

    const bookUrl = `https://apis.ccbp.in/book-hub/books/${bookid}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(bookUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const formattedData = {
        id: data.book_details.id,
        authorName: data.book_details.author_name,
        coverPic: data.book_details.cover_pic,
        aboutBook: data.book_details.about_book,
        rating: data.book_details.rating,
        readStatus: data.book_details.read_status,
        title: data.book_details.title,
        aboutAuthor: data.book_details.about_author,
      }
      this.setState({data: formattedData, apiStatus: status.success})
    } else {
      this.setState({apiStatus: status.failure, showFooter: false})
    }
  }

  loadingView = () => (
    <div className="book-loader" testid="loader">
      <Loader type="TailSpin" width={40} color="blue" />
    </div>
  )

  failureView = () => (
    <div className="book-failure-view">
      <img
        className="books-page-failure-img"
        src="https://res.cloudinary.com/dh22wd8lt/image/upload/v1692938236/Group_7522_ebgftt.png"
        alt="failure view"
      />
      <p className="book-failure-text">
        Something went wrong, Please try again.
      </p>
      <button
        onClick={this.onClickTryAgain}
        type="button"
        className="book-try-again-btn"
      >
        Try again
      </button>
    </div>
  )

  successView = () => {
    const {data} = this.state
    return (
      <div className="book-card">
        <div className="book-image-card">
          <img className="book-image" src={data.coverPic} alt={data.title} />
          <div className="book-details">
            <h5 className="book-title">{data.title}</h5>
            <p className="book-author">{data.authorName}</p>
            <div className="book-rating-bg">
              <p className="book-avg-rating">Avg Rating </p>
              <AiTwotoneStar className="book-star-icon" />
              <p className="book-rating">{data.rating}</p>
            </div>
            <p className="book-status">
              Status:
              <span className="book-read-span">{data.readStatus}</span>
            </p>
          </div>
        </div>
        <hr />
        <h1 className="book-author-title">About Author</h1>
        <p className="book-description">{data.aboutAuthor}</p>
        <h1 className="book-author-title">About Book</h1>
        <p className="book-description">{data.aboutBook}</p>
      </div>
    )
  }

  renderResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case status.loading:
        return this.loadingView()
      case status.failure:
        return this.failureView()
      case status.success:
        return this.successView()
      default:
        return null
    }
  }

  onLogoutInSmallDevices = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  onMenubar = () => {
    this.setState({isMenubarClicked: true})
  }

  linksForSmall = () => (
    <div className="anchor-elements-card-small-devices">
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
        <button
          onClick={this.onLogoutInSmallDevices}
          className="logout-button"
          type="button"
        >
          Logout
        </button>
      </li>

      <li>
        <button
          onClick={this.onClickDeleteLinkBtn}
          className="remove-links-button"
          type="button"
        >
          <img
            className="links-delete-img"
            src="https://res.cloudinary.com/dmmkzeslp/image/upload/v1694063512/Solid_cuhp7e.svg"
            alt="delete"
          />
        </button>
      </li>
    </div>
  )

  render() {
    const {showFooter, isMenubarClicked} = this.state
    return (
      <div className="book-bg">
        <Header onMenubarClick={this.onMenubar} />

        <div className="book-bg-without-header">
          {isMenubarClicked ? <div>{this.linksForSmall()}</div> : ''}
          <div>{this.renderResult()}</div>
          {showFooter ? (
            <div className="book-footer">
              <Footer />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }
}

export default BookDetails
