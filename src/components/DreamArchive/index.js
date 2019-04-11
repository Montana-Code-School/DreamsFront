import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  ArchiveDivS,
  BlobInputContainerS,
  ArchiveTitle, DreamTitle,
  BlobInputContainerSS,
  StyledImg,
  StyledHR,
  TitleRowDiv,
  ContentRowDiv,
  ImgRowDiv,
  PageStyle,
  DreamDivS } from './styled';

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
      return <p>{`Looks like you haven't journaled any dreams yet!
      Click New Dream to get started!`}</p>
    }
  }

  render() {
    let baseURL = "https://cdn.pixabay.com/photo/"
    return(
      <PageStyle>
        <BlobInputContainerS>
          <ColorBlob leftAlign={0} topAlign={0}/>
        </BlobInputContainerS>
        <AuthUserContext.Consumer>
          {authUser => (
            <ArchiveDivS>
              <ArchiveTitle id="test-dreamarchive-user-h1">Dream Archive for {authUser.email}</ArchiveTitle>
              <BlobInputContainerSS>
                <ColorBlob/>
              </BlobInputContainerSS>
              {this.loadingOrNoDreams()}
              {this.props.dreams.map( (dream, index) =>
                <DreamDivS key={dream._id} >
                  <TitleRowDiv>
                    <DreamTitle>{dream.title}</DreamTitle>
                    <Link
                      to={ROUTES.EDIT_DREAM}
                      onClick={() => this.props.selectDream(dream)}
                    >Edit Dream</Link>
                  </TitleRowDiv>
                  <StyledHR />
                  <ContentRowDiv>
                    <p>{dream.content}</p>
                  </ContentRowDiv>
                  <StyledHR />
                  <ImgRowDiv>
                    {!!dream.images.length &&
                      dream.images.map( (image) =>
                        <StyledImg
                          className={image.keyword+index}
                          src={baseURL.concat(image.url.split(",")[image.lastViewedIndex])}
                          key={image._id}
                          lastViewedIndex={image.lastViewedIndex}
                        />)
                    }
                  </ImgRowDiv>
                </DreamDivS>
              )}
            </ArchiveDivS>
          )}
        </AuthUserContext.Consumer>
      </PageStyle>
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
