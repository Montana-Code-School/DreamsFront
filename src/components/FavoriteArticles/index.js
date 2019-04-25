import React, { Component } from 'react';

//styles
import ColorBlob from '../ColorBlob';
import { AuthButtonS } from '../styledComponents/authButtons';
import { DefaultArticleSectionS, BlobContainer1S } from './styled';

import ArticleView from '../ArticleView';
import { AuthUserContext, withAuthorization } from '../Session';
import * as ROUTES from '../../Constants/routes';


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

  GoToArticlePage = () => {
    this.props.history.push(ROUTES.LITERATURE);
  }

  render(){
    return(
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <BlobContainer1S>
              <ColorBlob/>
            </BlobContainer1S>
            <h1 style={{fontFamily:"serif", color:"snow"}}>Your Favorites</h1>
            <AuthButtonS
              onClick={this.GoToArticlePage}
            >Back To Article Search
            </AuthButtonS>
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
