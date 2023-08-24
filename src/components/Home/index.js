import './index.css'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'

const status = {
  loading: 'LOADING',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class Home extends Component {
  state = {topRatedBooks: [], topRatedBooksApiStatus: status.loading}

  componentDidMount() {
    this.getTopRatedBooks()
  }

  getTopRatedBooks = async () => {
    const topRatedBooksUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(topRatedBooksUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const formattedData = data.books.map(each => ({
        id: each.id,
        authorName: each.author_name,
        coverPic: each.cover_pic,
        title: each.title,
      }))
      this.setState({
        topRatedBooks: formattedData,
        topRatedBooksApiStatus: status.success,
      })
    } else {
      this.setState({
        topRatedBooksApiStatus: status.failure,
      })
    }
  }

  onLoading = () => (
    <div className="loader-home" data-testid="loader">
      <Loader type="ThreeDots" />
    </div>
  )

  onSuccess = () => {
    const {topRatedBooks} = this.state
    const settings = {
      dots: false,
      slidesToShow: 3,
      slidesToScroll: 1,
    }
    return (
      <div className="success-api">
        <Slider {...settings}>
          <ul className="top-rated-books-ul-order">
            {topRatedBooks.map(each => (
              <li className="top-rated-books-list" key={each.id}>
                <img
                  className="cover-pic"
                  src={each.coverPic}
                  alt={each.title}
                />
                <p className="home-top-rated-book-title">{each.title}</p>
                <p>{each.authorName}</p>
              </li>
            ))}
          </ul>
        </Slider>
      </div>
    )
  }

  onFailure = () => (
    <div>
      <p className="home-failure-text">
        Something went wrong, Please try again.
      </p>
      <button type="button" className="home-try-abain-btn">
        Try again
      </button>
    </div>
  )

  renderApiResult = () => {
    const {topRatedBooksApiStatus} = this.state

    switch (topRatedBooksApiStatus) {
      case status.loading:
        return this.onLoading()
      case status.success:
        return this.onSuccess()
      case status.failure:
        return this.onFailure()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-background">
        <Header />
        <div className="home-without-header-background">
          <h1 className="home-main-heading">Find Your Next Favourite Books</h1>
          <p className="home-description">
            You are in the right place.Tell us what titles or genres you have
            enjoyed in the past, and we will give you surprisingly insightful
            recommendations.
          </p>
        </div>
        <div className="top-rated-books-background">
          <div className="top-rated-books-text-and-find-books-btn-card">
            <p className="top-rated-books-text">Top Rated Books</p>
            <button className="find-books-btn" type="button">
              Find Books
            </button>
          </div>
          {this.renderApiResult()}
        </div>
      </div>
    )
  }
}

export default Home
