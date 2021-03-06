import React from 'react';
import { CardImg, CardText, CardBody,
  CardTitle } from 'reactstrap';
import { CardS, ImageContainerS, ButtonS, ButtonXS } from './styled';
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

const ArticleView = ({
  _id,
  image,
  multimedia,
  web_url,
  webUrl,
  headline,
  snippet,
  addFavDreamArticle,
  deFavorite
}) =>
  <CardS>
    {getImageOrNot(multimedia, image)}
    <CardBody>
      <CardTitle>
        <a
          style={{fontFamily:"serif", fontSize:"x-large", color:"snow"}}
          target="_blank"
          rel="noopener noreferrer"
          href={web_url || webUrl}>
          {typeof headline === "object" ? headline.main : headline}
        </a>
      </CardTitle>
      <CardText
        style={{fontFamily:"serif", fontSize:"large", color:"snow"}}
      >{snippet}
      </CardText>
      {!image && <ButtonS
      onClick={(e) => addFavDreamArticle(e, { headline, snippet, multimedia, web_url } )}>
      <FontAwesomeIcon color='turquoise' icon={faHeart} /></ButtonS>}
        {image && <ButtonXS onClick={() => deFavorite(_id)}>X</ButtonXS>}
    </CardBody>
  </CardS>
export default ArticleView
