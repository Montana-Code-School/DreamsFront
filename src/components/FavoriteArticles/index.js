import React, { Component } from 'react';
import ArticleView from '../../ArticleView';

import { AuthUserContext, withAuthorization } from '../Session';

import { DefaultArticleSectionS } from './styled';

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

  deFavorite = (_id) => {
    fetch(`${REACT_APP_BACKEND_URL}/articles`, {
      method:"DELETE",
      body: JSON.stringify({_id}),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then((data) => {
      let _articles = [...this.state.articles];
      for (let i = 0; i < _articles.length; i++) {
        if (data._id === _articles[i]._id){
          _articles.splice(i, 1)
        }
      }
      this.setState({articles: _articles})
    })
  }

  render(){
    return(
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h1>Your Favorites</h1>
            <DefaultArticleSectionS>
              {this.state.articles.map((article) =>
                <ArticleView 
                  key={article._id} 
                  _id={article._id}
                  {...article} 
                  addFavDreamArticle={this.addFavDreamArticle}
                  deFavorite={this.deFavorite}
                />
              )}
            </DefaultArticleSectionS>
          </div>
        )}
      </AuthUserContext.Consumer>
    )
  }
}

const condition = authUser => !!authUser;
const authorizedFavoritePage = withAuthorization(condition)(FavoritePage);

export default authorizedFavoritePage
