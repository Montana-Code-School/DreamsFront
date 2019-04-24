import React from 'react';
import {CardImg, CardText, CardBody,
  CardTitle, Button } from 'reactstrap';
import { CardS, ImageContainerS } from './styled';


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
      {!image && <Button onClick={(e) => addFavDreamArticle(e, { headline, snippet, multimedia, web_url } )}><i style={{color: "springgreen"}} className="fas fa-heart"></i></Button>}
    </CardBody>
  </CardS>

export default ArticleView
