import React from 'react';
import { CardImg, CardText, CardBody,
  CardTitle } from 'reactstrap';
import { CardS, ImageContainerS, ButtonS } from './styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const ArticleView = ({ image, multimedia, web_url, headline, snippet, addFavDreamArticle }) =>
  <CardS>
    <ImageContainerS>
      <CardImg
        alt=''
        src={ multimedia ? (`https://www.nytimes.com/${multimedia[0].url}`) : (`https://www.nytimes.com/${image}`) }
      />
    </ImageContainerS>
    <CardBody>
      <CardTitle>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={typeof headline === "object" ? `https://www.nytimes.com/${headline.main}` : `https://www.nytimes.com/${headline}`}>
          {typeof headline === "object" ? headline.main : headline}
        </a>
      </CardTitle>
      <CardText>{snippet}</CardText>
      {!image && <ButtonS onClick={(e) => addFavDreamArticle(e, { headline, snippet, multimedia, web_url } )}><FontAwesomeIcon color='springgreen' icon={faHeart} /></ButtonS>}
    </CardBody>
  </CardS>

export default ArticleView
