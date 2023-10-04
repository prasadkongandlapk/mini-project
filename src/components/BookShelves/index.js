import './index.css'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsSearch, BsFillStarFill} from 'react-icons/bs'
import Footer from '../Footer'
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
    <div>
      <button
        className={activeBtn}
        type="button"
        onClick={onClickCategoriesBtn}
      >
        {label}
      </button>
    </div>
  )
}

class BookShelves extends Component {
  state = {
    isSearchBtnClicked: false,
    isActive: bookshelvesList[0].id,
    apiStatus: status.loading,
    bookshelfName: 'ALL',
    booksData: [],
    showFooter: true,
    searchText: '',
    isMenubarClicked: false,
    bookshelfHeading: bookshelvesList[0].label,
  }

  componentDidMount() {
    this.getBooks()
  }

  onClickDeleteLinkBtn = () => {
    this.setState({isMenubarClicked: false})
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
      this.setState({apiStatus: status.failure, showFooter: false})
    }
  }

  loadingView = () => (
    <div className="loader-bookshelves" testid="loader">
      <Loader type="TailSpin" width={42} height={42} color="blue" />
    </div>
  )

  successView = () => {
    const {booksData} = this.state
    return (
      <ul className="all-books-api-result-card">
        {booksData.map(eachBook => (
          <li key={eachBook.title}>
            <Link to={`/books/${eachBook.id}`} className="link">
              <div className="each-book-card">
                <img
                  className="each-book-image"
                  src={eachBook.coverPic}
                  alt={eachBook.title}
                />
                <div className="each-book-details">
                  <h5 className="each-book-title">{eachBook.title}</h5>
                  <p className="each-book-author">{eachBook.authorName}</p>
                  <div className="rating-bg">
                    <p className="avg-rating">Avg Rating </p>
                    <BsFillStarFill className="star-icon" />
                    <p className="rating">{eachBook.rating}</p>
                  </div>
                  <p className="status">
                    Status:
                    <span className="read-span">{eachBook.readStatus}</span>
                  </p>
                </div>
              </div>
            </Link>{' '}
          </li>
        ))}
      </ul>
    )
  }

  onChangeInput = event => {
    this.setState({searchText: event.target.value})
  }

  onClickSearchBtn = () => {
    const {booksData, searchText} = this.state
    this.setState(
      prevState => ({
        isSearchBtnClicked: !prevState.isSearchBtnClicked,
        booksData: booksData.filter(eachBook =>
          eachBook.title.toLowerCase().includes(searchText.toLowerCase()),
        ),
      }),
      this.getBooks,
    )
  }

  onMenubar = () => {
    this.setState({isMenubarClicked: true})
  }

  notFound = () => {
    const {searchText} = this.state
    return (
      <div className="bookshelves-failure-view">
        <img
          className="books-page-failure-img"
          src="https://res.cloudinary.com/dmmkzeslp/image/upload/v1693561561/Asset_1_1_wznbnf.png"
          alt="no books"
        />
        <p className="bookshelves-failure-text">
          Your search for {searchText} did not find any matches.
        </p>
      </div>
    )
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
    const {bookshelfHeading} = this.state
    bookshelvesList.map(each => {
      if (each.id === id) {
        this.setState(
          {
            bookshelfHeading: each.label,
            bookshelfName: each.value,
            isActive: id,
          },
          this.getBooks,
        )
      }
      return null
    })
  }

  onLogoutInSmallDevices = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
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
    const {
      apiStatus,
      isMenubarClicked,
      showFooter,
      booksData,
      searchText,
      isActive,
      bookshelfHeading,
    } = this.state
    const backgroundWhileLoading =
      apiStatus === status.loading
        ? 'bookshelves-card-while-loading'
        : 'bookshelves-card'

    return (
      <div className="bookshelves-background">
        <Header onMenubarClick={this.onMenubar} />

        <div className={backgroundWhileLoading}>
          <ul className="bookshelves-category-buttons-card">
            <h1 className="bookshelves-buttons-heading">Bookshelves</h1>

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
              <h1 className="all-books-text">{bookshelfHeading} Books</h1>
              {isMenubarClicked ? <div>{this.linksForSmall()}</div> : ''}
              <div className="search-bg">
                <input
                  className="search-bar"
                  type="search"
                  value={searchText}
                  placeholder="Search"
                  onChange={this.onChangeInput}
                />
                <button
                  testid="searchButton"
                  type="button"
                  onClick={this.onClickSearchBtn}
                  className="search-btn"
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
            </div>
            {apiStatus !== status.loading ? (
              <>
                <h1 className="bookshelves-buttons-heading-small-devices">
                  Bookshelves
                </h1>

                <div className="bookshelves-category-buttons-card-small-devices">
                  {bookshelvesList.map(eachBookBtn => (
                    <BookshelvesBtn
                      key={eachBookBtn.id}
                      onClickCategories={this.onClickCategories}
                      details={eachBookBtn}
                      isActiveBtn={isActive}
                    />
                  ))}
                </div>
              </>
            ) : (
              ''
            )}
            <div className="api-render-card">
              {this.renderResult()}
              {apiStatus !== status.loading && booksData.length === 0
                ? this.notFound()
                : ''}
            </div>
          </div>
        </div>
        {showFooter && apiStatus !== 'LOADING' && booksData.length !== 0 ? (
          <div className="bookshelves-footer">
            <Footer />
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}

export default BookShelves
