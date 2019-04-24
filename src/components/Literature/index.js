import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// styles
import { InputS } from '../styledComponents/inputs';
import { DefaultArticleSectionS, LabelS, PS, SrchOptionsDivS, RadioButtonS, LinkS } from './styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import { AuthUserContext, withAuthorization } from '../Session';
import * as ROUTES from '../../Constants/routes';
import ArticleView from '../ArticleView';
import { AuthButtonS } from '../styledComponents/authButtons';

const { REACT_APP_BACKEND_URL } = process.env;
const baseURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?`
const filterSectionDefault = `&fq=subject.contains:(sleep,dreams)`
const key = `&api-key=OQKttP42ZWiOZdLWaBXQ1nfvbUKkU4Hb`

class LitPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      favoritedArticles: [],
      articles: [],
      searchOption: "dreams",
      searchResults: true,
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
      console.log(results);
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

  getArts() {
    const search = this.userInputSearch();
    axios.get(`${baseURL}&q=${search}&fq=subject:(${this.state.searchOption})${key}`)
    .then(res => {
      const articles = res.data.response.docs;
      if (!articles.length){
        this.setState({searchResults: false})
      } else if (articles.length) {
        this.setState({searchResults: true})
      }
      this.setState({ articles });
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
    this.setState({articles: []});
    this.getArts();
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
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <LinkS
              to={ROUTES.FAVORITES}
            ><FontAwesomeIcon color='springgreen' icon={faHeart} />
            Your Favorite Articles
            </LinkS>
            <br/>
            <InputS
              type="text" id="userSrch"
              placeholder="Search.."
              inputPadding={10}
            />
            <SrchOptionsDivS className='buttonDiv'>
            <RadioButtonS>
              <input
                type="radio"
                checked={this.state.searchOption === "dreams"}
                name="srchOptions"
                value="dreams"
                id="dreamBox"
                onChange={this.handleSrchCategoryChange}
              />
              <LabelS htmlFor="sleepBox">Search Dream Articles</LabelS>
            </RadioButtonS>
            <RadioButtonS>
              <input
                type="radio"
                checked={this.state.searchOption === "sleep"}
                name="srchOptions"
                value="sleep"
                id="sleepBox"
                onChange={this.handleSrchCategoryChange}
              />
              <LabelS htmlFor="dreamBox">Search Sleep Articles</LabelS>
            </RadioButtonS>
            </SrchOptionsDivS>
            <AuthButtonS
              onClick={this.onClickSearch}
            >Search Articles</AuthButtonS>
            {!this.state.searchResults && <PS>Sorry, your search turned up empty.</PS>}
            {!!this.state.articles.length &&
              <DefaultArticleSectionS>
                {this.state.articles.map((article) =>
                  <ArticleView key={article._id} {...article} addFavDreamArticle={this.addFavDreamArticle}/>
                )}
              </DefaultArticleSectionS>
            }
          </div>
        )}
      </AuthUserContext.Consumer>
    )
  }
}

const condition = authUser => !!authUser;
const authorizedLitPage = withAuthorization(condition)(LitPage);

export default authorizedLitPage
