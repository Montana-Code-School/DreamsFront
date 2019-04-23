import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DefaultArticleSectionS,DreamArticleSectionS, SleepArticleSectionS, LabelS } from './styled';
import * as ROUTES from '../../Constants/routes';
import ArticleView from '../../ArticleView';

const { REACT_APP_BACKEND_URL } = process.env;
const baseURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?`
const filterSections = `&fq=news_desk:(%22health%22%20%22science%22)`
const key = `&api-key=OQKttP42ZWiOZdLWaBXQ1nfvbUKkU4Hb`

class LitPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      dreamArticles: [],
      sleepArticles: [],
      articles: [],
      searchOption: "",
    }
  }

  componentDidMount(){
    axios.get(`${baseURL}&q=dreams&q=sleep${filterSections}${key}`)
    .then(res => {
      const articles = res.data.response.docs;
      console.log(articles)
      this.setState({ articles });
    })
  }

  getDreamArts() {
    const search = this.userInputSearch();
    axios.get(`${baseURL}&q=dreams ${search}${filterSections}${key}`)
    .then(res => {
      const dreamArticles = res.data.response.docs;
      console.log(dreamArticles)
      this.setState({ dreamArticles });
    })
  }

  getSleepArts() {
    const search = this.userInputSearch();
    axios.get(`${baseURL}&q=sleep ${search}${filterSections}${key}`)
      .then(res => {
        const sleepArticles = res.data.response.docs;
        this.setState({ sleepArticles });
      })
  }

  //getting value of input and passing input to onClickSearch.
  userInputSearch = () => {
    const input = document.querySelector('#userSrch').value;
    const userSrchQuery = input.trim();
    return userSrchQuery;
  }

  // enables search button to get dream and/or sleep articles according to which radio button is selected.
  onClickSearch = (e) => {
    e.preventDefault();
    const el = document.querySelector('input[name="srchOptions"]:checked')
    const currentSrchOpt = el.value;
    if(currentSrchOpt === "dreamArticles"){
      return this.getDreamArts();
    }
    if(currentSrchOpt === "sleepArticles"){
      return this.getSleepArts();
    }
    this.getSleepArts();
    this.getDreamArts();
  }

  //enables radio buttons to be selected.
  handleSrchCategoryChange = (e) => {
    this.setState({searchOption: e.target.value});
  }

  addFavDreamArticle = (e, article) => {
    e.preventDefault();
     const articleBody = {
      headline: article.headline.main,
      webUrl: article.web_url,
      snippet: article.snippet,
      image: article.multimedia[0].url,
    }
    fetch(`${REACT_APP_BACKEND_URL}/articles`, {
      method:"POST",
      body: JSON.stringify(articleBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  //what about URLSearchParams?

  render() {
    console.log(this.state.dreamArticles)
    return (
      <div>
        <Link
          to={ROUTES.FAVORITES}
        >Your Favorite Articles
        </Link>
        <br/>
        <input
          type="text" id="userSrch"
          placeholder="Search.."
        />
        <button
          onClick={this.onClickSearch}
        >Search Articles</button>
        <div>
          <input
            type="radio"
            checked={this.state.searchOption === "dreamArticles"}
            name="srchOptions"
            value="dreamArticles"
            id="dreamBox"
            onChange={this.handleSrchCategoryChange}
          />

          <LabelS htmlFor="sleepBox">Search Dream Articles</LabelS>
        </div>

        <div>
          <input
            type="radio"
            checked={this.state.searchOption === "sleepArticles"}
            name="srchOptions"
            value="sleepArticles"
            id="sleepBox"
            onChange={this.handleSrchCategoryChange}
          />
          <LabelS htmlFor="dreamBox">Search Sleep Articles</LabelS>
        </div>
        {!!this.state.articles.length &&
          <DefaultArticleSectionS>
            {this.state.articles.map((article) =>
              <ArticleView key={article._id} {...article} addFavDreamArticle={this.addFavDreamArticle}/>
            )}
          </DefaultArticleSectionS>
        }

        {!!this.state.dreamArticles.length &&
          <DreamArticleSectionS>
            {this.state.dreamArticles.map((article) =>
              <ArticleView key={article._id} {...article} addFavDreamArticle={this.addFavDreamArticle}/>
            )}
          </DreamArticleSectionS>
        }
        {!!this.state.sleepArticles.length &&
          <SleepArticleSectionS>
            {this.state.sleepArticles.map(article =>
              <ArticleView key={article._id} {...article} addFavDreamArticle={this.addFavDreamArticle}/>
            )}
          </SleepArticleSectionS>
        }
      </div>
    )
  }
}

export default LitPage
