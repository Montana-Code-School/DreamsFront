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
  color: snow;
`
export const CardS = styled(Card)`
  background: rgba(255, 255, 255, 0.3);
  width: 33%;
  margin: 10px;
`
export const SrchOptionsDivS = styled.div`
  display: flex;
`
export const RadioButtonS = styled.div`
  padding: 10px;
`

export const LinkS = styled(Link)`
  font-family: serif;
  font-size: xx-large;
  color: hotpink;
  padding: 5px;
  &:hover{
  transition: .25s ease-in-out;
  color: deeppink;
  }
`
