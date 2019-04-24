import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DefaultArticleSectionS,DreamArticleSectionS, SleepArticleSectionS,LabelS, CardS } from './styled';
import * as ROUTES from '../../Constants/routes';
import {CardImg, CardText, CardBody,
  CardTitle, Button } from 'reactstrap';
import ArticleView from '../../ArticleView';

const { REACT_APP_BACKEND_URL } = process.env;
const baseURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?`
const filterSectionDreams = `&fq=subject:(dreams)`
const filterSectionSleep = `&fq=subject:(sleep)`
const filterSectionDefault = `&fq=subject.contains:(sleep,dreams)`
const key = `&api-key=OQKttP42ZWiOZdLWaBXQ1nfvbUKkU4Hb`

class LitPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      dreamArticles: [],
      sleepArticles: [],
      favoritedArticles: [],
      articles: [],
      searchOption: "",
    }
  }

  componentDidMount(){
    const getArticles = axios.get(`${baseURL}&q=dreams&q=sleep${filterSectionDefault}${key}`)
    const getFavArticles = axios.get(`${REACT_APP_BACKEND_URL}/articles/all`)
    Promise.all([getArticles, getFavArticles])
    .then((results) => {
      // loop thru article array(which is an object) and check against favorite article array and return modified array.
      // have to loop thru objects in article array to get web_url key
      // if articles.web_url === favoritedArticles.web_url,  articles.splice(0, 1, favoritedArticles.web_url) return articles;
      const articles = results[0].data.response.docs;
      const favoritedArticles = results[1].data;
      articles.forEach((article, index) => {
        favoritedArticles.forEach((favArticle)=> {
          if(article.web_url === favArticle.webUrl){
            articles.splice(index, 1, favArticle);
          }
        })
      })
      this.setState({favoritedArticles, articles});
    });
  }

  getDreamArts() {
    const search = this.userInputSearch();
    axios.get(`${baseURL}&q=dreams ${search}${filterSectionDreams}${key}`)
    .then(res => {
      const dreamArticles = res.data.response.docs;
      this.setState({ dreamArticles });
    })
  }

  getSleepArts() {
    const search = this.userInputSearch();
    axios.get(`${baseURL}&q=sleep ${search}${filterSectionSleep}${key}`)
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
