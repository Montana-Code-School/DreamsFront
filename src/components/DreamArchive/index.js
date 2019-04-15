import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

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

const PS = styled.p`
  color: snow;
`

const ArchiveDivS = styled.div`
  position: relative;
  top: -85px;
  left: -10px;
`

const BlobInputContainerS = styled.div`
  display: inline-block;
  position: relative;
`

const ArchiveTitle = styled.h1`
  font-family: serif;
  color: gray;
  font-size: xx-large;
  font-weight: 900;
  background: transparent;
`
const DreamTitle = styled.h2`
  font-family: serif;
  color: gray;
  font-size: xx-large;
  font-weight: 900;
`

const BlobInputContainerSS = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250%;
  height: 50%;
  transform: scale(10);
  overflow: hidden;
`

const StyledImg = styled.img`
  height: 100%;
  margin: 10px;
  border-radius: 15px;
  opacity: 0.75;
  -webkit-box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  -moz-box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  &:hover{
    transition: 1s ease-in-out;
    opacity: 1.0;
  }
`

const StyledHR = styled.hr`
  border: 0.5px solid rgba(0,0,0,.1);
  width: 100%;
`

const TitleRowDiv = styled.div`
  display: flex;
  justify-content: inherit;
`

const ContentRowDiv = styled.div`
  font-family: serif;
  color: gray;
  font-size: x-large;
  font-weight: 900;
`

const ImgRowDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const PageStyle = styled.div`
  margin-left: 25px;
`

const DreamDivS = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 60%;
  padding: 15px;
  border-radius: 1em 5em 1em 5em / 2em 1em 2em 1em;
  margin-bottom: 25px;
  font-size: small;
  border-style: double;
  border-width: 4px;
  -webkit-box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
  -moz-box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
  box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
`

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
