import React, { Component } from 'react';
import styled from "styled-components";

import { withAuthorization } from '../Session';
import * as ROUTES from '../../Constants/routes';
import ColorBlob from '../ColorBlob';
import { withState } from 'recompose';

import { commonWords, archetypes } from './archetypes';

const { REACT_APP_BACKEND_URL } = process.env;

class NewDreamPage extends Component {
  state = {
    dreams: [],
    title:'',
    content:'',
    _id: '',
    userId: this.props.firebase.auth.O,
    keyWords: [],
    imgUrlArr: [],
  }

  handleChange = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({[event.target.name]: event.target.value});
  }

  parseDreamContent = (e) => {
    //remove common words
    let lower = this.state.content.toLowerCase();
    lower = lower.replace(/[^\w\d ]/g, '');
    let dreamWords = lower.split(' ');
    dreamWords = dreamWords.filter(function (word) {
      return commonWords.indexOf(word) === -1;
    });

    // match against archetypes
    let keysArr = this.state.keyWords.slice();
    for (let i = 0; i < dreamWords.length; i++){
      let word = dreamWords[i];
      if (archetypes.includes(word)){
        keysArr.push(word);
      }
    }
    this.setState({keyWords: keysArr});
    console.log("matched keywords set to state ", this.state.keyWords);
  }

  async archButtonHandler() {
    await this.parseDreamContent();
    const { keyWords } = this.state;
    console.log("awaited keywords", keyWords);
    if (this.state.keyWords === []) return;
    for (let i = 0; i < keyWords.length; i++) {
      this.buildCompleteURL(keyWords[i])
    }
  }

  // build pixabay search URL
  buildCompleteURL = (searchValue) => {
    const baseURL = 'https://pixabay.com/api/?key=11543969-d5ffb78383da99ab7336a1888';
    const imageType = '&image_type=photo&pretty=true';
    const searchTerm = '&q=' + searchValue;
    const completeURL = baseURL + searchTerm + imageType;
    this.callPixa(completeURL);
  }

  // call pixabay
  callPixa = (url) => {
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      let randomIndex = Math.floor(Math.random() * data.hits.length);
      this.imgUrlsToState(data.hits[randomIndex].previewURL)
      this.appendImg(data.hits[randomIndex])
    });
  }

  // add img urls to state
  imgUrlsToState = (url) =>{
    let thumbsArr = this.state.imgUrlArr.slice();
    thumbsArr.push(url);
    this.setState({imgUrlArr: thumbsArr});
    console.log("state imgURL set: ", this.state.imgUrlArr);
  }

  // add pixabay results to page
  appendImg(imageObject) {
    const htmlTemplate =`
        <div>
            <img src="${imageObject.previewURL}" alt="..." >
        </div>
      `
    const imgDiv = document.createElement('div');
    imgDiv.innerHTML = htmlTemplate;
    document.getElementById('image-container').append(imgDiv);
  }


  addDream = (e) => {
    e.preventDefault();
    const { title, content, userId, imgUrlArr} = this.state;
    if (!title || !content) {
      return;
    }
    // Post to DB
    if(title){
      fetch(`${REACT_APP_BACKEND_URL}/dreams`, {
        method: "POST",
        body: JSON.stringify({ title, content, userId, imgUrlArr }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then((myJson) => {
        console.log(myJson);
        // this.props.history.push(ROUTES.DREAM_ARCHIVE);
      });
    }
  }

  render () {

    return(
      <PageStyle>
        <form onSubmit={ (e) => {e.preventDefault()} }>
          <BlobInputContainer_S>
            <ColorBlob
              watchValue={this.state.title}
            />
            <DreamInput
              autoComplete="off"
              type="text"
              id="DreamTitle"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
              placeholder="title..."
            />
          </BlobInputContainer_S>
          <br/>
          <BlobInputContainer_S>
            <ColorBlob/>
            <DreamTextarea
              type="text"
              rows="15"
              cols="30"
              name="content"
              id="DreamText"
              placeholder="start writing..."
              value={this.state.content}
              onChange={this.handleChange}
            />
          </BlobInputContainer_S>
          <br/>
          <SaveButton
            name="addDream"
            onClick={ (e) => {this.addDream(e)}}
          >Generate Images
          </SaveButton>
          <ArchetypesButton
            onClick={ (e) => {this.archButtonHandler(e)}}
          >Did I dream of any Archetypes?
          </ArchetypesButton>

        </form>
        <ThumbsDiv id='image-container'></ThumbsDiv>
      </PageStyle>
    );
  }
}

const ArchetypesButton = styled.button`
  font-size: xx-large;
  color: gray;
  padding: 25px;
  border-radius: 1em 10em 10em 10em;
  margin-top: 15px;
  margin-bottom: 25px;
  font-family: serif;
  border-style: double;
  border-width: 4px;
  -webkit-box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
  -moz-box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
  box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
  &:hover{
    transition: 1s ease-in-out;
    background-color: turquoise;
  }
`

const ThumbsDiv = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 5px;
`

const PageStyle = styled.div`
  margin-left: 25px;
  text-align:center;
`
const BlobInputContainer_S = styled.div`
  display: inline-block;
`
const DreamInput = styled.input`
  padding: 10px;
  z-index: 20;
  font-family: serif;
  font-size: xx-large;
  border: white;
  text-align: left;
  margin-bottom: 2rem;
  margin-top: 1.8rem;
  position: relative;
  background: rgba(255,255,255,0.2);
  border-radius: 6px;
  &::placeholder{
    color: black;
  }
  &:focus{
    outline:none;
  }
`
const DreamTextarea = styled.textarea`
  z-index: 20;
  width: 950px;
  font-family: serif;
  border: white;
  text-align: left;
  overflow: scroll;
  font-size: 2rem;
  line-height: 1.5;
  padding: 10px 0 0 10px;
  position: relative;
  background: rgba(255, 255, 255,0);
  &::placeholder{
    color: black;
  }
  &:focus{
    outline:none;
  }
`

const SaveButton = styled.button`
  font-size: xx-large;
  color: gray;
  padding: 25px;
  border-radius: 1em 10em 10em 10em;
  margin-top: 15px;
  margin-bottom: 25px;
  font-family: serif;
  border-style: double;
  border-width: 4px;
  -webkit-box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
  -moz-box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
  box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
  &:hover{
    transition: 1s ease-in-out;
    background-color: turquoise;;
  }
`
const condition = authUser => !!authUser;

export default withAuthorization(condition)(NewDreamPage);
