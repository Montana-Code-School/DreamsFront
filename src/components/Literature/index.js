import React, { Component } from 'react';
import axios from 'axios';
import { DreamArticleSectionS, SleepArticleSectionS,LabelS } from './styled';

const baseURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?`
const filterSections = `&fq=news_desk:(%22health%22%20%22science%22)`
const key = `&api-key=OQKttP42ZWiOZdLWaBXQ1nfvbUKkU4Hb`

class LitPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      dreamArticles: [],
      sleepArticles: [],
      searchOption: "",
    }
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

  //what about URLSearchParams?

  render() {
    console.log(this.state.dreamArticles)
    return (
      <div>
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

      {!!this.state.dreamArticles.length &&
        <DreamArticleSectionS>Dream Articles
          {this.state.dreamArticles.map(article => {
            return (
              <div key={article._id}>
                <a id="fullDreamArticle"
                   target="_blank"
                   rel="noopener noreferrer"
                   href={article.web_url}>{article.headline.main}
                </a>
                <p>{article.snippet}</p>
                <img
                  height={100}
                  width={100} alt=''
                  src={`https://www.nytimes.com/${article.multimedia[0].url}`}>
                </img>
              </div>
            )
          }
          )}
        </DreamArticleSectionS>
      }
      {!!this.state.sleepArticles.length &&
        <SleepArticleSectionS>Sleep Articles
            {this.state.sleepArticles.map(article => {
              return (
                <div key={article._id}>
                  <a id="fullSleepArticle"
                     target="_blank"
                     rel="noopener noreferrer"
                     href={article.web_url}>{article.headline.main}
                  </a>
                  <p>{article.snippet}</p>
                  <img height={100}
                       width={100}
                       alt=''
                       src={`https://www.nytimes.com/${article.multimedia[0].url}`}>
                  </img>
                </div>
              )
            }
            )}
        </SleepArticleSectionS>
      }
      </div>
    )
  }
}

export default LitPage





