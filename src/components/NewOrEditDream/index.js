import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNewOrUpdateDream, deleteDream, saveDream } from '../../store/actions';

import { withAuthorization } from '../Session';
import * as ROUTES from '../../Constants/routes';
import ColorBlob from '../ColorBlob';
import Chat from '../Chatbot';
import SpeechRec from './SpeechRec'
import ImageContainer from './ImagesContainer';
import { commonWords, archetypes } from './archetypes';
import { BlobInputContainerS } from '../Style';
import {
  ThumbsDiv,
  PageStyle,
  DreamInput,
  DreamTextarea,
  SaveButton,
  DeleteButton,
  ArchetypesButton,
  NoKeysH4,
} from './styled';
import questionPhrases from './questionPhrases';

let nlp = require('compromise');

const { REACT_APP_BACKEND_URL } = process.env;

class NewDreamPage extends Component {
  constructor(props){
    super(props);
    if(this.isNew){
      this.state = {
        title: '',
        content: '',
        _id: '',
        imgUrlArr: [],
        editing: false,
        noKeyWordsInDream: false,
        keysArr: [],
        lemmas: {},
        nouns: [],
        persons: [],
        chatbotSteps: [],
        chatReady: false,
        elizaArchs: [],
      }
    } else {
      const { title, content, _id, images } = this.props.currentDream
      this.state = {
        title: title || '',
        content: content || '',
        _id: _id || '',
        imgUrlArr: images || [],
        editing: false,
        noKeyWordsInDream: false,
        keysArr: [],
        lemmas: {},
        nouns: [],
        persons: [],
        chatbotSteps: [],
        chatReady: false,
        elizaArchs: [],
      }
    }
  }
  isNew = this.props.match.path === ROUTES.NEW_DREAM;
  userId = this.props.firebase.auth.O;

  componentDidMount(){
    //if Edit Dream
    if(!this.isNew && this.state.imgUrlArr.length){
      const imgUrlArr = this.state.imgUrlArr.map((image) => {
        return image;
      });
      this.setState({imgUrlArr});
    }
  }

  handleChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({[e.target.name]: e.target.value});
  }

  handleSpeechRec = (speechRecText) => {
    this.setState({content: speechRecText})
  }

  textAreaOnFocus = () => {
    this.setState({editing: true});
  }

  textAreaOnBlur = () => {
  }

  stemParse = (text) => {
    return fetch(`${REACT_APP_BACKEND_URL}/stem`, {
      method: 'POST',
      body: JSON.stringify({text}),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then((lemmas) => {
        return lemmas;
      })
  }

  chunkParse = (text) => {
    return fetch(`${REACT_APP_BACKEND_URL}/chunk`, {
      method: 'POST',
      body: JSON.stringify({text}),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then((chunks) => {
        return chunks;
      })
  }

  personParse = (chunks) => {
    // get the persons
    let persons = chunks.slice();
    let personArr = [];
    for (let i = 0; i < persons.length; i++) {
      if (persons[i].includes("PERSON")){
        persons[i] = persons[i].replace("PERSON ", "");
        persons[i] = persons[i].replace(/(\/NNP)+/g, "");
        persons[i] = persons[i].replace(/[^\w\d ]/g, '').trimStart();
        !personArr.includes(persons[i]) && personArr.push(persons[i]);
      }
    }
    this.setState({persons: personArr});
    this.makeChatbotSteps(personArr);
    // speechSynthesis.speak(new SpeechSynthesisUtterance(`How did you first meet ${personArr[0]}?`))
  }

  nounParse = (chunks) => {
    // get the nouns
    let nouns = chunks.slice();
    let nounArr = [];
    for (let i = 0; i < nouns.length; i++) {
      if(nouns[i].includes("NNS") && !nouns[i].includes("NNP")){
        nouns[i] = nouns[i].replace(/(\/NNS)+\b/g, "");
        nouns[i] = nouns[i].replace(/[^\w\d ]/g, '').trimStart();
        !nounArr.includes(nouns[i]) && nounArr.push(nouns[i]);
      } else if (nouns[i].includes("NN") && !nouns[i].includes("NNP")){
        nouns[i] = nouns[i].replace(/(\/NN)+\b/g, "");
        nouns[i] = nouns[i].replace(/[^\w\d ]/g, '').trimStart();
        !nounArr.includes(nouns[i]) && nounArr.push(nouns[i]);
      }
    }
    this.setState({nouns: nounArr});
    let revNouns = nounArr.reverse()
    this.makeChatbotSteps(revNouns);
    //speechSynthesis.speak(new SpeechSynthesisUtterance('Hey'))
  }

  parseDreamContent = async () => {
    // remove common words
    let dream = this.state.content;
    dream = dream.replace(/[^\w\d ]/g, '');
    let dreamWords = dream.split(' ');
    dreamWords = dreamWords.filter( (word) => {
      return commonWords.indexOf(word) === -1;
    });

    // tag and chunk
    let dreamWordsString = dreamWords.join(' ');
    const result = await this.stemParse(dreamWordsString);
    let lemmas = result.text.split(" ")
    const chunks = await this.chunkParse(dreamWordsString);
    let chunksArr = chunks.text.split("\n");
    this.nounParse(chunksArr);
    this.personParse(chunksArr);

    // match against archetypes
    // match against lemmas
    // skipping already existing keywords
    let currentKeywords = this.state.imgUrlArr.map( obj => obj.keyword);
    let keysArr = [];
    for (let i = 0; i < dreamWords.length; i++){
      let word = dreamWords[i].toLowerCase();
      if ((archetypes.includes(word) && !keysArr.includes(word) && !currentKeywords.includes(word))){
        keysArr.push(word);
      }
    }
    for (let i = 0; i < lemmas.length; i++){
      let word = lemmas[i];
      if ((archetypes.includes(word) && !keysArr.includes(word) && !currentKeywords.includes(word))){
        keysArr.push(word);
      }
    }
    if (keysArr.length) {
      this.setState({noKeyWordsInDream: false, keysArr});
      console.log("keysarr ", keysArr)
    }
    this.setState({elizaArchs: currentKeywords.concat(keysArr)})
    return keysArr;
  };

  archButtonHandler= async () => {
    const keyWords = await this.parseDreamContent();
    this.makeChatbotSteps(this.state.imgUrlArr.map( obj => obj.keyword));
    if (!keyWords.length && !this.state.imgUrlArr.length){
      this.setState({noKeyWordsInDream: true});
    }
    if (!keyWords.length) {
       return; 
    }
    let promiseArr = [];
    for (let i = 0; i < keyWords.length; i++) {
      let data = this.buildPromiseArr(keyWords[i]);
      promiseArr.push(data);
    }
    if(!promiseArr.length) return;
    this.promiseResolver(promiseArr);
  }

  // build pixabay search URL
  buildPromiseArr = (searchValue) => {
    const baseURL = 'https://pixabay.com/api/?key=11543969-d5ffb78383da99ab7336a1888';
    const imageType = '&image_type=photo&pretty=true&per_page=200';
    const searchTerm = '&q=' + searchValue;
    const completeURL = baseURL + searchTerm + imageType;
    return fetch(completeURL).then(res => {
      return new Promise((resolve) => {
        res.json().then((data) => {
          data.keyword = searchValue;
          resolve(data);
        })
      })
    });
  }

  promiseResolver = (arr) => {
    // https://cdn.pixabay.com/photo/
    let thumbsArr = this.state.imgUrlArr.slice();
    Promise.all(arr).then((values) => {
      for (let i = 0; i < values.length; i++) {
        let oldUrls = thumbsArr.map( obj => obj.url)
        let URLsList = [];
        for (let j = 0; j < values[i].hits.length; j++) {
          let debasedUrl = values[i].hits[j].previewURL.replace("https://cdn.pixabay.com/photo/", "")
          URLsList.push(debasedUrl)
        }
        URLsList = URLsList.join(",")
        let newValue = {
          url: URLsList,
          keyword: values[i].keyword
        };
        if (!oldUrls.includes(newValue.url)) thumbsArr.push(newValue);
      }
      this.setState({imgUrlArr: thumbsArr, editing: false});
    });
  }

  gatherSavedPlaces = (key, index) => {
    const { imgUrlArr: _imgUrlArr} = this.state;
    for (let i = 0; i < _imgUrlArr.length; i++) {
      if (_imgUrlArr[i].keyword === key){
        _imgUrlArr[i] = { ..._imgUrlArr[i], lastViewedIndex: index}
      }
    }
    const images = _imgUrlArr
      .map( obj => ({url: obj.url, keyword: obj.keyword, _id: obj._id, lastViewedIndex: obj.lastViewedIndex}));
    this.setState({imgUrlArr: images});
  }

  addDream = (e) => {
    e.preventDefault();
    const { _id, title, content, imgUrlArr: images } = this.state;
    const { userId } = this;
    if (!title || !content) {
      return;
    }
    const body = { title, content, userId, images };
    if(!this.isNew) body._id = _id;
    // Post to DB
    const onSaveComplete = new Promise((resolve, reject) => {
      this.props.saveDream(body, this.isNew, resolve);
    });
    onSaveComplete.then(() => this.props.history.push(ROUTES.DREAM_ARCHIVE));
  }

  deleteDream = (e) => {
    e.preventDefault();
    const { _id } = this.state;
    if(_id){
      fetch(`${REACT_APP_BACKEND_URL}/dreams`, {
        method: "DELETE",
        body: JSON.stringify({ _id }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        this.props.deleteDream(_id);
        this.props.history.push(ROUTES.DREAM_ARCHIVE);
      })
    }
  }

  removeImage = (keyword) => {
    let thumbsUrlObjs = this.state.imgUrlArr.filter( obj => obj.keyword !== keyword);
    this.setState({imgUrlArr: thumbsUrlObjs})
  }

  makeChatbotSteps = (stepsToAdd) => {
    console.log("steps to add ", stepsToAdd);
    let newSteps = [...this.state.chatbotSteps];
    // make first step and last step
    if (!newSteps.length) {
      newSteps.push({id: 1, message: "Excuse me, my english is not very good, but lets talk about your dream", trigger: 2},
      {
        id: 2,
        message: 'Excuse me, I have to go now. You know how to contact me. Good luck.',
        end: true,
      } );
    }
    // insert new steps at penultimate index
    if(stepsToAdd.length) {
      for (let i = 0; i < stepsToAdd.length; i++) {
        if (stepsToAdd[i].includes(" ")){
          let choiceOfPersons = stepsToAdd[i].split(" ");
          newSteps.splice(newSteps.length-1, 0, 
            {
              id: i,
              message: `didn't you used to live in a van down by the river with ${choiceOfPersons[0]} and ${choiceOfPersons[1]}?`,
              trigger: i+1,
            },
            {
              id: i+1,
              user: true,
              trigger: i+2,
            }
          )
        } else {
          newSteps.splice(newSteps.length-1, 0, 
            {
              id: i,
              message: `${questionPhrases[Math.floor(Math.random() * questionPhrases.length)]}${stepsToAdd[i]}?`,
              trigger: i+1,
            },
            {
              id: i+1,
              user: true,
              trigger: i+2,
            }
          )
        }
      }
    }
    // re-index ids and triggers
    for (let i = 0; i < newSteps.length; i++) {
      newSteps[i].id = i+1;
      if (i === newSteps.length-1){
        newSteps[i].end = true;
      } else {
        newSteps[i].trigger = i+2;
      }
      
    }
    this.setState({chatbotSteps: newSteps})
  }

  elizaBot = (input) =>{
    let doc = nlp(input)
    //our canned-templates
    if(doc.has('i #Adverb? (am|feel) #Adverb? #Adjective')){
        let feeling = doc.match('i #Adverb? am #Adverb? [#Adjective]').out('normal')
        return `When did you become ${feeling}?`
    } else if(doc.has('(father|mother|dad|mom)')){
      let whichParent = doc.match('(father|mother|dad|mom)').out('normal')
      return `Why don't you tell me about your ${whichParent}.`
    } else {
        return 'can you elaborate on that?'
    }
  }

  render () {
    console.log("keysarr ", this.state.keysArr);
    return(
      <PageStyle>
        <form
          onSubmit={ (e) => {e.preventDefault()} }
        >
        <BlobInputContainerS>
          <ColorBlob
            watchValue={this.state.content}
            leftAlign={-11}
            topAlign={4}
          />
          <SpeechRec 
            handleChange={this.handleChange}
            handleSpeechRec={this.handleSpeechRec}
            textAreaOnFocus={this.textAreaOnFocus}
            initialContent={this.state.content}
          />
        </BlobInputContainerS>
        <br/>
        <BlobInputContainerS>
          <ColorBlob
          leftAlign={-9}
          topAlign={6}
          />
          <DreamInput
            type="text"
            id="DreamTitle"
            name="title"
            value={this.state.title}
            onChange={this.handleChange}
            placeholder="Enter Dream Title (required)"
            onKeyUp={(e) => e.keyCode === 13 && e.target.blur()}
          />
        </BlobInputContainerS>
        <br />
        {this.state.content &&
          <ArchetypesButton
              id="archButton"
              onClick={ (e) => {this.archButtonHandler(e)}}
            >Interpret <br/> Dream
          </ArchetypesButton>
        }
        <br />
        {(this.state.noKeyWordsInDream && !!this.state.content.length) &&
        <NoKeysH4>No keywords currently present in dream -- unable to generate images.</NoKeysH4>}
        {(!this.state.noKeyWordsInDream) &&
          <div>
           <ThumbsDiv id='image-container'>
            {this.state.imgUrlArr.map( (obj) =>
                <ImageContainer
                  id={`${obj.keyword}ImageContainer`}
                  key={obj.keyword}
                  url={obj.url.split(',')}
                  keyword={obj.keyword}
                  lastViewedIndex={obj.lastViewedIndex}
                  removeImage={this.removeImage}
                  gatherSavedPlaces={this.gatherSavedPlaces}
                />
            )}
            </ThumbsDiv>
          </div>
        }
        {(!!this.state.title && !!this.state.content) &&
          <SaveButton
            className="savebutton"
            type="button"
            name="addDream"
            onClick={ (e) => {this.addDream(e)}}
          >Save <br/> Dream
          </SaveButton>
        }
        </form>
        {!this.isNew &&
          <DeleteButton name="deleteDream" onClick={this.deleteDream}>Delete</DeleteButton>
        }
        <div><button onClick={()=>this.setState({chatReady: !this.state.chatReady})}>Chat</button></div>
        {/* {this.state.chatReady && <Chat steps={this.state.chatbotSteps}/> } */}
        {this.state.chatReady && <Chat eliza={this.elizaBot} archetypes={this.state.elizaArchs}/> }
      </PageStyle>
    );
  }
}

// PropTypes

NewDreamPage.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  _id: PropTypes.string,
  userId: PropTypes.string,
  imgUrlArr: PropTypes.array,
};


const condition = authUser => !!authUser;

const authWrap = withAuthorization(condition)(NewDreamPage);

const mapStateToProps = state => {
  return {
    currentDream: state.currentDream
  }
};

const mapDispatchToProps = dispatch => ({
  addNewOrUpdateDream: (newDream) => dispatch(addNewOrUpdateDream(newDream)),
  deleteDream: (id) => dispatch(deleteDream(id)),
  saveDream: (dream, isNew, promise) => dispatch(saveDream(dream, isNew, promise))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(authWrap)
