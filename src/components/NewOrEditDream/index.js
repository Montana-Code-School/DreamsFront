import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNewOrUpdateDream, deleteDream, saveDream } from '../../store/actions';

import { withAuthorization } from '../Session';
import * as ROUTES from '../../Constants/routes';
import ColorBlob from '../ColorBlob';

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

  textAreaOnFocus = () => {
    this.setState({editing: true});
  }

  textAreaOnBlur = () => {
  }

  parseDreamContent = () => {
    //remove common words
    let lower = this.state.content.toLowerCase();
    lower = lower.replace(/[^\w\d ]/g, '');
    let dreamWords = lower.split(' ');
    dreamWords = dreamWords.filter( (word) => {
      return commonWords.indexOf(word) === -1;
    });
    // match against archetypes
    // skipping already existing keywords
    let currentKeywords = this.state.imgUrlArr.map( obj => obj.keyword);
    let keysArr = [];
    for (let i = 0; i < dreamWords.length; i++){
      let word = dreamWords[i];
      if ((archetypes.includes(word) && !keysArr.includes(word) && !currentKeywords.includes(word))){
        keysArr.push(word);
      }
    }
    if (keysArr.length) this.setState({noKeyWordsInDream: false});
    return keysArr;
  };

  archButtonHandler() {
    const keyWords = this.parseDreamContent();
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

  render () {
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
          <DreamTextarea
            onSubmit={ (e) => {e.preventDefault()}}
            type="textarea"
            rows="3"
            cols="25"
            name="content"
            id="DreamText"
            placeholder="Enter Dream Text (required)"
            value={this.state.content}
            onChange={e => this.handleChange(e)}
            onFocus={this.textAreaOnFocus}
            onBlur={this.textAreaOnBlur}
            onKeyUp={(e) => e.keyCode === 13 && e.target.blur()}
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
