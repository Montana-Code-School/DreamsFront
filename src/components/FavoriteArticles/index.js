import React, { Component } from 'react';
import ArticleView from '../../ArticleView';
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
      <div>
        <h1>Your Favorites</h1>
        {this.state.articles.map((article) =>
         <ArticleView key={article._id} {...article} addFavDreamArticle={this.addFavDreamArticle}/>
        )}
      </div>
    )
  }
}

export default FavoritePage
