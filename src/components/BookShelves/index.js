import './index.css'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {AiOutlineSearch, AiTwotoneStar} from 'react-icons/ai'

import Header from '../Header'

const status = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const BookshelvesBtn = props => {
  const {details, isActiveBtn, onClickCategories} = props
  const {label, id} = details
  const onClickCategoriesBtn = () => {
    onClickCategories(id)
  }
  const activeBtn = isActiveBtn === id ? 'active-btn' : 'category-btn'
  return (
    <li>
      <button
        className={activeBtn}
        type="button"
        onClick={onClickCategoriesBtn}
      >
        {label}
      </button>
    </li>
  )
}

class BookShelves extends Component {
  state = {
    isSearchBtnClicked: false,
    isActive: bookshelvesList[0].id,
    apiStatus: status.loading,
    bookshelfName: 'ALL',
    booksData: [],
    searchText: '',
  }

  componentDidMount() {
    this.getBooks()
  }

  onClickTryAgain = () => {
    this.getBooks()
  }

  getBooks = async () => {
    const {bookshelfName, searchText} = this.state
    const booksApiUrl = `https://apis.ccbp.in/book-hub/books?shelf=${bookshelfName}&search=${searchText}`

    const token = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(booksApiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      const formattedData = data.books.map(each => ({
        id: each.id,
        title: each.title,
        readStatus: each.read_status,
        rating: each.rating,
        authorName: each.author_name,
        coverPic: each.cover_pic,
      }))
      this.setState({booksData: formattedData, apiStatus: status.success})
    } else {
      this.setState({apiStatus: status.failure})
    }
  }

  loadingView = () => (
    <div className="loader-bookshelves" data-testid="loader">
      <Loader type="ThreeDots" width={40} color="blue" />
    </div>
  )

  successView = () => {
    const {booksData} = this.state
    return (
      <ul className="all-books-api-result-card">
        {booksData.map(eachBook => (
          <Link to="/books/:bookid">
            <li className="each-book-card">
              <img
                className="each-book-image"
                src={eachBook.coverPic}
                alt={eachBook.title}
              />
              <div className="each-book-details">
                <h5 className="each-book-title">{eachBook.title}</h5>
                <p className="each-book-author">{eachBook.authorName}</p>
                <div className="rating-bg">
                  <p>Avg Rating </p>
                  <AiTwotoneStar className="star-icon" />
                  <p>{eachBook.rating}</p>
                </div>
                <p className="status">
                  Status:
                  <span className="read-span">{eachBook.readStatus}</span>
                </p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  onChangeInput = event => {
    const {isSearchBtnClicked} = this.state
    if (isSearchBtnClicked === true) {
      this.setState({searchText: event.target.value})
    }
  }

  onClickSearchBtn = () => {
    this.setState(prevState => ({
      isSearchBtnClicked: !prevState.isSearchBtnClicked,
    }))
  }

  failureView = () => (
    <div className="bookshelves-failure-view">
      <img
        className="books-page-failure-img"
        src="https://res.cloudinary.com/dh22wd8lt/image/upload/v1692938236/Group_7522_ebgftt.png"
        alt="failure view"
      />
      <p className="bookshelves-failure-text">
        Something went wrong, Please try again.
      </p>
      <button
        onClick={this.onClickTryAgain}
        type="button"
        className="bookshelves-try-again-btn"
      >
        Try again
      </button>
    </div>
  )

  renderResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case status.loading:
        return this.loadingView()
      case status.success:
        return this.successView()
      case status.failure:
        return this.failureView()

      default:
        return null
    }
  }

  onClickCategories = id => {
    bookshelvesList.map(each => {
      if (each.id === id) {
        this.setState({bookshelfName: each.value, isActive: id}, this.getBooks)
      }
      return null
    })
  }

  render() {
    const {booksData, searchText, isActive} = this.state
    return (
      <div className="bookshelves-background">
        <Header />
        <div className="bookshelves-card">
          <ul className="bookshelves-category-buttons-card">
            <p className="bookshelves-buttons-heading">BookShelves</p>
            {bookshelvesList.map(eachBookBtn => (
              <BookshelvesBtn
                key={eachBookBtn.id}
                onClickCategories={this.onClickCategories}
                details={eachBookBtn}
                isActiveBtn={isActive}
              />
            ))}
          </ul>
          <div>
            <div className="title-and-search-bar">
              <h1 className="all-books-text">All Books</h1>

              <div className="search-bg">
                <input
                  className="search-bar"
                  type="text"
                  value={searchText}
                  placeholder="Search"
                  onChange={this.onChangeInput}
                />
                <button
                  type="button"
                  onClick={this.onClickSearchBtn}
                  className="search-btn"
                >
                  <AiOutlineSearch className="search-icon" />
                </button>
              </div>
            </div>
            <div className="api-render-card">{this.renderResult()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default BookShelves
