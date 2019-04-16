import styled from 'styled-components';

export const PS = styled.p`
  color: snow;
`

export const ArchiveDivS = styled.div`
  position: relative;
  top: -85px;
  left: -10px;
`

export const BlobContainer2S = styled.div`
  display: inline-block;
  position: relative;
`

export const ArchiveTitleS = styled.h1`
  font-family: serif;
  color: white;
  font-size: xx-large;
  font-weight: 900;
  background: transparent;
`
export const DreamTitleS = styled.h2`
  font-family: serif;
  color: white;
  font-size: xx-large;
  font-weight: 900;
`

export const BlobContainer1S = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250%;
  height: 50%;
  transform: scale(10);
  overflow: hidden;
`

export const StyledImgS = styled.img`
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

export const StyledHRS = styled.hr`
  border: 0.5px solid rgba(0,0,0,.1);
  width: 100%;
`

export const TitleRowDivS = styled.div`
  display: flex;
  justify-content: inherit;
`

export const ContentRowDivS = styled.div`
  color: white;
  display: block;
  font-family: serif;
  font-size: x-large;
  font-weight: 900;
  height: 100px;
  overflow: scroll;
`

export const ImgRowDivS = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const PageStyleS = styled.div`
  margin-left: 25px;
`

export const DreamDivS = styled.div`
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
