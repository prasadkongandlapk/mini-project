import './index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'

const status = {
  loading: 'LOADING',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class Home extends Component {
  state = {
    topRatedBooks: [],
    showFooter: true,
    topRatedBooksApiStatus: status.loading,
    isMenubarClicked: false,
  }

  componentDidMount() {
    this.getTopRatedBooks()
  }

  onClickDeleteLinkBtn = () => {
    this.setState({isMenubarClicked: false})
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
        showFooter: false,
      })
    }
  }

  onMenubar = () => {
    this.setState({isMenubarClicked: true})
  }

  onClickTryAgain = () => {
    this.getTopRatedBooks()
  }

  onLoading = () => (
    <div className="loader-home" testid="loader">
      <Loader type="TailSpin" width={30} color="#0284c7" />
    </div>
  )

  onSuccess = () => {
    const {topRatedBooks} = this.state
    const settings = {
      dots: false,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 360,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: false,
            infinite: true,
          },
        },
      ],
    }
    return (
      <ul className="top-rated-books-ul-order">
        <Slider {...settings}>
          {topRatedBooks.map(eachBook => (
            <li className="top-rated-books-list" key={eachBook.id}>
              <img
                className="cover-pic"
                src={eachBook.coverPic}
                alt={eachBook.title}
              />
              <h1 className="home-top-rated-book-title">{eachBook.title}</h1>
              <p className="home-top-rated-book-author">
                {eachBook.authorName}
              </p>
            </li>
          ))}
        </Slider>
      </ul>
    )
  }

  onFailure = () => (
    <div className="home-page-failure-view-card">
      <img
        className="home-page-failure-img"
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

  onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  onLogoutInSmallDevices = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

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

  linksForSmall = () => (
    <div className="anchor-elements-card-small-devices">
      <Link to="/" className="link">
        <li>
          <h1 className="home-anchor-element">Home</h1>
        </li>
      </Link>
      <Link to="/shelf" className="link">
        <li>
          <h1 className="bookshelves-anchor-element">BookShelves</h1>
        </li>
      </Link>
      <li>
        <button
          className="logout-button"
          onClick={this.onLogoutInSmallDevices}
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

  onClickFindBooks = () => {
    const {history} = this.props
    history.replace('/shelf')
  }

  render() {
    const {showFooter, isMenubarClicked} = this.state
    return (
      <div className="home-background">
        <Header onMenubarClick={this.onMenubar} />
        {isMenubarClicked ? <div>{this.linksForSmall()}</div> : ''}

        <div className="home-heading-description-bg">
          <h1 className="home-main-heading">Find Your Next Favorite Books?</h1>
          <p className="home-description">
            You are in the right place.Tell us what titles or genres you have
            enjoyed in the past, and we will give you surprisingly insightful
            recommendations.
          </p>
        </div>
        <button
          onClick={this.onClickFindBooks}
          className="find-books-btn-small-devices"
          type="button"
        >
          Find Books
        </button>
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
        {showFooter ? (
          <div className="home-footer">
            <Footer />
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}

export default Home
