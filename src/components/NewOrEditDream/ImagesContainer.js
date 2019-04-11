import React, { useState, useEffect } from 'react';
import styled from "styled-components";

import { archtypesFull } from './archetypes';

function ImageContainer({url, removeImage, keyword, lastViewedIndex, gatherSavedPlaces}) {
  const [count, setCount] = useState(lastViewedIndex ? lastViewedIndex : 0);
  let key = `${keyword}`;
  let keyCapitalized = "";
  for (let i = 0; i < key.length; i++) {
    if(i === 0){
      keyCapitalized += key[i].toUpperCase();
    } else {
      keyCapitalized += key[i]
    }
  }
  let imgIndex = (((count) % url.length)+url.length) % url.length;
  let baseURL = "https://cdn.pixabay.com/photo/";
  useEffect(() => {
    gatherSavedPlaces(keyword, imgIndex);
  }, [imgIndex]);

  return (
    <ThumbDiv>
      <div>
        <ImageCaptioning
          className={`${keyword}ImageGenerated`}
          src={baseURL.concat(url[imgIndex])}
          alt="..."
          lastViewedIndex={lastViewedIndex}
        />
        <ButtonXS onClick={(e) => removeImage(keyword)}>X</ButtonXS>
        <ButtonRS onClick={() => setCount(count + 1)} className={`${keyword}SlideRight`} >&#x27E9;</ButtonRS>
        <ButtonLS onClick={() => setCount(count - 1)}>&#x27E8;</ButtonLS>
        <PS>{`${keyCapitalized}: ${archtypesFull[keyCapitalized]}`}</PS>
      </div>
    </ThumbDiv>
  )
}

const PS = styled.p`
  color: snow;
  margin-left: 15px;
`

const ButtonXS = styled.button`
  position: absolute;
  top: 12px;
  right: -7px;
  border-radius: 12px;
  border-color: transparent;
  background-color: transparent;
  color: white;
  opacity: 0.8;
`
const ButtonRS = styled.button`
  position: absolute;  
  top: 32px;
  right: -15px;
  border-color: transparent;
  background-color: transparent;
  font-size: 20pt;
  color: white;
  opacity: 0.8;
`
const ButtonLS = styled.button`
  position: absolute;  
  top: 32px;
  left: 7px;
  border-radius: 12px;
  border: transparent;
  background-color: transparent;
  font-size: 20pt;
  font-stretch: ultra-condensed;
  color: white;
  opacity: 0.8;
`

const ImageCaptioning = styled.img`
  width: 100%;
  height: 100%;
  margin: 10px;
  border-radius: 15px;
  opacity: 0.75;
  -webkit-box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  -moz-box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  &:hover {
    transition: 0.5s ease-in-out;
    opacity: 1.0;
  }
`

const ThumbDiv = styled.div`
  position: relative;
  display: inline-block;
  align-items: center;
  padding: 3px 3px 3px 3px;
  font-size: 80%;
  width: 150px;
  text-align: center;
  margin-bottom: 5px;
`

export default ImageContainer;
