import React, { Component } from 'react';
import ArticleView from '../../ArticleView';

import { AuthUserContext, withAuthorization } from '../Session';

const { REACT_APP_BACKEND_URL } = process.env;

class FavoritePage extends Component {
  constructor(props){
    super(props);
    this.state = {
      articles: [],
    }
  }
  componentDidMount(){
   fetch(`${REACT_APP_BACKEND_URL}/articles/all`)
   .then(res => res.json())
   .then((articles) => {
     console.log(articles);
     this.setState({ articles });

   })
  }

  render(){
    return(
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h1>Your Favorites</h1>
            {this.state.articles.map((article) =>
            <ArticleView key={article._id} {...article} addFavDreamArticle={this.addFavDreamArticle}/>
            )}
          </div>
        )}
      </AuthUserContext.Consumer>
    )
  }
}

const condition = authUser => !!authUser;
const authorizedFavoritePage = withAuthorization(condition)(FavoritePage);

export default authorizedFavoritePage
