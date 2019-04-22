import React from 'react';
import {CardImg, CardText, CardBody,
  CardTitle, Button } from 'reactstrap';
import { CardS } from './styled';

const ArticleView = ({ image, multimedia, web_url, headline, snippet, addFavDreamArticle }) =>
 <CardS>
    <CardImg
      top
      height={100}
      // width={100}
      alt=''
      src={multimedia ? (`https://www.nytimes.com/${multimedia[0].url}`) : (`https://www.nytimes.com/${image}`) }
    />
      <CardBody>
      <CardTitle>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={web_url}>{headline.main}
        </a>
      </CardTitle>
      <CardText>{snippet}</CardText>
      {!image && <Button onClick={(e) => addFavDreamArticle(e)}>Favorite</Button>}
    </CardBody>
  </CardS>

export default ArticleView
