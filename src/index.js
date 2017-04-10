import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import CreatePost from './components/CreatePost'
import CreateUser from './components/CreateUser'
import LoginUser from './components/LoginUser'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import ApolloClient, {createNetworkInterface} from 'apollo-client'
import {ApolloProvider} from 'react-apollo'
import 'tachyons'

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj184h3ug3qcz0189cthl9w7z',
})

networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {}
      }

      // get the authentication token from local storage if it exists
      if (localStorage.getItem('graphcoolToken')) {
        req.options.headers.authorization = `Bearer ${localStorage.getItem('graphcoolToken')}`
      }
      next()
    },
  },
])

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: o => o.id,
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <Switch>
        <Route exact={true} path='/' component={App} />
        <Route path='/create' component={CreatePost} />
        <Route path='/login' component={LoginUser} />
        <Route path='/signup' component={CreateUser} />
      </Switch>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
)
