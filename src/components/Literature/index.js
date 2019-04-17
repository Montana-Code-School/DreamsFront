import React, { Component } from 'react';
import axios from 'axios';
import { DreamArticleSectionS, SleepArticleSectionS,LabelS } from './styled';


class LitPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      dreamArticles: [],
      sleepArticles: [],
      searchOption: "dreamArticles",
    }
  }

  getDreamArts() {
    axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?&q=dreams&fq=news_desk:(%22health%22%20%22science%22)&api-key=OQKttP42ZWiOZdLWaBXQ1nfvbUKkU4Hb`)
    .then(res => {
      const dreamArticles = res.data.response.docs;
      this.setState({ dreamArticles });
    })
  }

  getSleepArts() {
    axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?&q=sleep&fq=news_desk:(%22health%22%20%22science%22)&api-key=OQKttP42ZWiOZdLWaBXQ1nfvbUKkU4Hb`)
      .then(res => {
        const sleepArticles = res.data.response.docs;
        this.setState({ sleepArticles });
      })
  }

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

  handleSrchCategoryChange = (e) => {
    this.setState({searchOption: e.target.value});
  }

  //user will be searching nyt api with search bar not just the lit page. Use URLSearchParams.

  render() {
    return (
      <div>
        <input type="text" placeholder="Search.."/>
        <button
          onClick={this.onClickSearch}
        >Search Articles</button>
        <div>
          <input
            type="radio"
            checked={this.state.searchOption === "dreamArticles"}
            name="srchOptions" value="dreamArticles" id="dreamBox"
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

        <div>
          <input
            type="radio"
            checked={this.state.searchOption === "bothArticleSections"}
            name="srchOptions"
            value="bothArticleSections"
            id="bothBox"
            onChange={this.handleSrchCategoryChange}
          />
          <LabelS htmlFor="bothBox">Both</LabelS>
        </div>


      <DreamArticleSectionS>Dream Articles
      {this.state.dreamArticles.map(article => {
        return (
          <div key={article._id}>
            <a id="fullDreamArticle" target="_blank" rel="noopener noreferrer" href={article.web_url}>{article.headline.main}</a>
            <p>{article.snippet}</p>
            <img height={100} width={100} alt=''src={`https://www.nytimes.com/${article.multimedia[0].url}`}></img>
          </div>
        )
      }
      )}
      </DreamArticleSectionS>

      <SleepArticleSectionS>Sleep Articles
          {this.state.sleepArticles.map(article => {
            return (
              <div key={article._id}>
                <a id="fullSleepArticle" target="_blank" rel="noopener noreferrer" href={article.web_url}>{article.headline.main}</a>
                <p>{article.snippet}</p>
                <img height={100} width={100} alt='' src={`https://www.nytimes.com/${article.multimedia[0].url}`}></img>
              </div>
            )
          }
          )}
      </SleepArticleSectionS>
      </div>
    )
  }
}

export default LitPage





