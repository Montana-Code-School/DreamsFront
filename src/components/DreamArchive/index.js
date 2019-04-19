import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  ArchiveDivS,
  BlobContainer2S,
  ArchiveTitleS, DreamTitleS,
  BlobContainer1S,
  StyledImgS,
  StyledHRS,
  TitleRowDivS,
  ContentRowDivS,
  ImgRowDivS,
  PageStyleS,
  DreamDivS,
  PS } from './styled';

import * as ROUTES from '../../Constants/routes';
import { selectDream, fetchDreams } from '../../store/actions';
import ColorBlob from '../ColorBlob';
import { AuthUserContext, withAuthorization } from '../Session';

class ArchivePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.firebase.auth.O,
    };
  }

  componentDidMount() {
    const { userId } = this.state;
    this.props.fetchDreams(userId);
  }

  loadingOrNoDreams(){
    if(this.props.isFetchingDreams){
      return <p>Loading....</p>
    } else if (!this.props.dreams.length){
      return <PS>{`Looks like you haven't journaled any dreams yet!
      Click New Dream to get started!`}</PS>
    }
  }

  render() {
    let baseURL = "https://cdn.pixabay.com/photo/"
    return(
      <PageStyleS>
        <BlobContainer2S>
          <ColorBlob leftAlign={0} topAlign={0}/>
        </BlobContainer2S>
        <AuthUserContext.Consumer>
          {authUser => (
            <ArchiveDivS>
              <ArchiveTitleS id="test-dreamarchive-user-h1">Dream Archive for {authUser.email}</ArchiveTitleS>
              <BlobContainer1S>
                <ColorBlob/>
              </BlobContainer1S>
              {this.loadingOrNoDreams()}
              {this.props.dreams.map( (dream, index) =>
                <DreamDivS key={dream._id} >
                  <TitleRowDivS>
                    <DreamTitleS>{dream.title}</DreamTitleS>
                    <Link
                      to={ROUTES.EDIT_DREAM}
                      onClick={() => this.props.selectDream(dream)}
                    >Edit Dream</Link>
                    <Link
                      to={{
                        pathname: ROUTES.CHAT,
                        state: !!dream.images.length ?
                          dream.images.map(obj => obj.keyword) :
                          ["oh wait there are no archetypes in your dream."]
                      }}
                    >Discuss with Shaman</Link>
                  </TitleRowDivS>
                  <StyledHRS />
                  <ContentRowDivS>
                    <p>{dream.content}</p>
                  </ContentRowDivS>
                  <StyledHRS />
                  <ImgRowDivS>
                    {!!dream.images.length &&
                      dream.images.map( (image) =>
                        <StyledImgS
                          className={image.keyword+index}
                          src={baseURL.concat(image.url.split(",")[image.lastViewedIndex])}
                          key={image._id}
                          lastViewedIndex={image.lastViewedIndex}
                        />)
                    }
                  </ImgRowDivS>
                </DreamDivS>
              )}
            </ArchiveDivS>
          )}
        </AuthUserContext.Consumer>
      </PageStyleS>
    )
  }
}

const condition = authUser => !!authUser;

const authorizedArchivePage = withAuthorization(condition)(ArchivePage);

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  selectDream: (dream) => dispatch(selectDream(dream)),
  fetchDreams: (userID) => dispatch(fetchDreams(userID)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(authorizedArchivePage)
