import styled from 'styled-components';

export const ArchiveDivS = styled.div`
  position: relative;
  top: -85px;
  left: -10px;
`

export const BlobInputContainerS = styled.div`
  display: inline-block;
  position: relative;
`

export const ArchiveTitle = styled.h1`
  font-family: serif;
  color: white;
  font-size: xx-large;
  font-weight: 900;
  background: transparent;
`
export const DreamTitle = styled.h2`
  font-family: serif;
  color: white;
  font-size: xx-large;
  font-weight: 900;
`

export const BlobInputContainerSS = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250%;
  height: 50%;
  transform: scale(10);
  overflow: hidden;
`

export const StyledImg = styled.img`
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

export const StyledHR = styled.hr`
  border: 0.5px solid rgba(0,0,0,.1);
  width: 100%;
`

export const TitleRowDiv = styled.div`
  display: flex;
  justify-content: inherit;
`

export const ContentRowDiv = styled.div`
  font-family: serif;
  color: white;
  font-size: x-large;
  font-weight: 900;
`

export const ImgRowDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const PageStyle = styled.div`
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
