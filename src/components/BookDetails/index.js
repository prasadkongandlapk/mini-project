import './index.css'
import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {AiTwotoneStar} from 'react-icons/ai'
import Header from '../Header'

const status = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class BookDetails extends Component {
  state = {apiStatus: status.loading}

  componentDidMount() {
    this.getBook()
  }

  getBook = async () => {
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const bookUrl = `https://apis.ccbp.in/book-hub/books/${id}`

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
      this.setState({apiStatus: status.failure})
    }
  }

  loadingView = () => (
    <div className="loader-book" data-testid="loader">
      <Loader type="ThreeDots" width={40} color="blue" />
    </div>
  )

  failureView = () => (
    <div className="book-failure-view">
      <img
        className="books-page-failure-img "
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
      <div>
        <div className="image-card">
          <img className="book-image" src={data.coverPic} alt={data.title} />
          <div className="book-details">
            <h5 className="book-title">{data.title}</h5>
            <p className="book-author">{data.authorName}</p>
            <div className="rating-bg">
              <p>Avg Rating </p>
              <AiTwotoneStar className="star-icon" />
              <p>{data.rating}</p>
            </div>
            <p className="status">
              Status:
              <span className="read-span">{data.readStatus}</span>
            </p>
          </div>
        </div>
        <hr />
        <h1 className="author-book-title">About Author</h1>
        <p className="book-description">{data.aboutAuthor}</p>
        <h1 className="author-book-title">About Book</h1>
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

  render() {
    return (
      <div className="book-bg">
        <Header />
        <div className="book-bg-without-header">
          <div className="book-card">{this.renderResult()}</div>
        </div>
      </div>
    )
  }
}

export default BookDetails
