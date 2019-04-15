import React, { Component } from 'react';
import axios from 'axios';

class LitPage extends Component {
  state = {
    dreamArticles: []
  }

  componentDidMount() {
    axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=dreams&api-key=OQKttP42ZWiOZdLWaBXQ1nfvbUKkU4Hb`)
      .then(res => {
        const dreamArticles = res.data.response.docs;
        console.log(dreamArticles);
        this.setState({ dreamArticles });
      })
  }

  render() {
    return (
      <div>
      {this.state.dreamArticles.map(article => <p>{article.headline.main}</p>)}
      </div>
    )
  }
}



export default LitPage





