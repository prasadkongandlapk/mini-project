import './index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

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

  onClickTryAgain = () => {
    this.getTopRatedBooks()
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
      <div className="top-rated-books-ul-order">
        <Slider {...settings}>
          {topRatedBooks.map(each => (
            <div className="top-rated-books-list" key={each.id}>
              <img className="cover-pic" src={each.coverPic} alt={each.title} />
              <h1 className="home-top-rated-book-title">{each.title}</h1>
              <p>{each.authorName}</p>
            </div>
          ))}
        </Slider>
      </div>
    )
  }

  onFailure = () => (
    <div className="home-page-failure-view-card">
      <img
        className="home-page-failure-view"
        src="https://res.cloudinary.com/dh22wd8lt/image/upload/v1692938236/Group_7522_ebgftt.png"
        alt="failure view"
      />
      <p className="home-failure-text">
        Something went wrong, Please try again.
      </p>
      <button
        onClick={this.onClickTryAgain}
        type="button"
        className="home-try-again-btn"
      >
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

  onClickFindBooks = () => {
    const {history} = this.props
    history.replace('/bookshelves')
  }

  render() {
    return (
      <div className="home-background">
        <Header />
        <div className="home-without-header-background">
          <h1 className="home-main-heading">Find Your Next Favorite Books?</h1>
          <p className="home-description">
            You are in the right place.Tell us what titles or genres you have
            enjoyed in the past, and we will give you surprisingly insightful
            recommendations.
          </p>
        </div>
        <div className="top-rated-books-background">
          <div className="top-rated-books-text-and-find-books-btn-card">
            <li>
              <h1 className="top-rated-books-text">Top Rated Books</h1>
            </li>
            <li>
              <button
                onClick={this.onClickFindBooks}
                className="find-books-btn"
                type="button"
              >
                Find Books
              </button>
            </li>
          </div>
          {this.renderApiResult()}
        </div>
      </div>
    )
  }
}

export default Home
