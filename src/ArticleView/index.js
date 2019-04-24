import React from 'react';
import {CardImg, CardText, CardBody,
  CardTitle, Button } from 'reactstrap';
import { CardS, ImageContainerS } from './styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const checkMultimedia = (multimedia, image) => {
  if (multimedia){
    return multimedia.length && `https://www.nytimes.com/${multimedia[0].url}`
  } else if (image) {
    return `https://www.nytimes.com/${image}`
  }
}

const getImageOrNot = (multimedia, image) => {
  if ((multimedia && !multimedia.length) && !image) return null;
  return (
    <ImageContainerS>
      <CardImg
        alt=''
        src={checkMultimedia(multimedia, image)}
      />
    </ImageContainerS>
  )
}

const ArticleView = ({ image, multimedia, web_url, webUrl, headline, snippet, addFavDreamArticle }) =>
  <CardS>
    {getImageOrNot(multimedia, image)}
    <CardBody>
      <CardTitle>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={web_url || webUrl}>
          {typeof headline === "object" ? headline.main : headline}
        </a>
      </CardTitle>
      <CardText>{snippet}</CardText>
      {!image && <Button onClick={(e) => addFavDreamArticle(e, { headline, snippet, multimedia, web_url } )}><FontAwesomeIcon color='springgreen' icon={faHeart} /></Button>}
    </CardBody>
  </CardS>

export default ArticleView
