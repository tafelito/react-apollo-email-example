import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'

class CreatePost extends React.Component {
  static propTypes = {
    history: React.PropTypes.object,
    mutate: React.PropTypes.func,
    data: React.PropTypes.object,
  };

  state = {
    description: '',
    imageUrl: '',
  };

  render() {
    if (this.props.data.loading) {
      return <div>Loading</div>
    }

    // redirect if no user is logged in
    if (!this.props.data.user) {
      console.warn('only logged in users can create new posts')
      this.props.router.replace('/')
    }

    return (
      <div className='w-100 pa4 flex justify-center'>
        <div style={{maxWidth: 400}} className=''>
          <input
            className='w-100 pa3 mv2'
            value={this.state.description}
            placeholder='Description'
            onChange={e => this.setState({description: e.target.value})}
          />
          <input
            className='w-100 pa3 mv2'
            value={this.state.imageUrl}
            placeholder='Image Url'
            onChange={e => this.setState({imageUrl: e.target.value})}
          />
          {this.state.imageUrl &&
            <img src={this.state.imageUrl} alt='' className='w-100 mv3' />}
          {this.state.description &&
            this.state.imageUrl &&
            <button
              className='pa3 bg-black-10 bn dim ttu pointer'
              onClick={this.handlePost}
            >
              Post
            </button>}
        </div>
      </div>
    )
  }

  handlePost = () => {
    const {description, imageUrl} = this.state
    this.props.mutate({variables: {description, imageUrl}}).then(() => {
      this.props.history.replace('/')
    })
  };
}

const createPost = gql`
  mutation createPost ($description: String!, $imageUrl: String!) {
    createPost(description: $description, imageUrl: $imageUrl) {
      id
      description
      imageUrl
    }
  }
`

const userQuery = gql`
  query userQuery {
    user {
      id
    }
  }
`

const FeedQuery = gql`query FeedQuery{
  allPosts(orderBy: createdAt_DESC) {
    id
    imageUrl
    description
  }
}`

export default graphql(createPost, {
  options: {
    update: (proxy, {data: {createPost}}) => {
      const data = proxy.readQuery({query: FeedQuery})
      data.allPosts.unshift(createPost)
      proxy.writeQuery({query: FeedQuery, data})
    },
  },
})(graphql(userQuery, {options: {fetchPolicy: 'network-only'}})(CreatePost))

// export default graphql(createPost, {name: 'createPost'})(
//   graphql(userQuery, {options: {fetchPolicy: 'network-only'}})(
//     graphql(FeedQuery, {name: 'listPosts'})(CreatePost),
//   ),
// )
