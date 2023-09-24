import './App.css'
import {Switch, Route} from 'react-router-dom'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import BookShelves from './components/BookShelves'
import BookDetails from './components/BookDetails'
import NotFound from './components/NotFound'

import Home from './components/Home'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/shelf" component={BookShelves} />
    <ProtectedRoute exact path="/books/:bookid" component={BookDetails} />
    <Route component={NotFound} />
  </Switch>
)

export default App
