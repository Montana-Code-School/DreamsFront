import styled from 'styled-components';
import { Card } from 'reactstrap';
import { Link } from 'react-router-dom';


export const PS = styled.p`
  font-family: serif;
  color: snow;
`
export const DefaultArticleSectionS = styled.div`
  font-family: serif;
  color: white;
  display: inline-flex;
  flex-wrap: wrap;
`
export const DreamArticleSectionS = styled.div`
  font-family: serif;
  color: white;
  display: inline-flex;
  flex-wrap: wrap;
`
export const SleepArticleSectionS = styled.div`
  font-family: serif;
  color: white;
  display:flex;
`
export const LabelS = styled.label`
  font-family: serif;
  color: deeppink;
  margin: 10px;
`
export const CardS = styled(Card)`
  background: rgba(255, 255, 255, 0.3);
  width: 33%;
  margin: 10px;
`
export const SrchOptionsDivS = styled.div`
  display: flex;
  position: relative;
`
export const RadioButtonS = styled.div`
  padding: 10px;
  position: relative;
  font-family: serif;
  font-size: x-large;

`
export const LinkS = styled(Link)`
  font-family: serif;
  font-size: x-large;
  color: hotpink;
  padding: 5px;
  position: relative;
  &:hover{
    transition: .25s ease-in-out;
    color: deeppink;
  }
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
export const FavoritesButtonS = styled.button`
  margin: 25px;
  padding: 10px;
  z-index: 20;
  font-family: serif;
  color: white;
  font-size: x-large;
  font-weight: 900;
  border-style: double;
  border-color: darkcyan;
  text-align: left;
  margin-bottom: 2rem;
  margin-top: 1.8rem;
  position: relative;
  background: rgba(255,255,255,0.3);
  border-radius: 6px;
  &::placeholder{
  color: white;
  font-weight: 900;
  font-size: x-large;
  }
  &:hover{
  transition: 1s ease-in-out;
  background-color: palevioletred;
  }
`
