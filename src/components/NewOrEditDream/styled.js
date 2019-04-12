import styled from 'styled-components';

export const ThumbsDivS = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-bottom: 5px;
`
export const PageStyleS = styled.div`
  margin-left: 25px;
  text-align: center;
`
export const DreamTextareaS = styled.textarea`
  z-index: 20;
  font-family: serif;
  color: white;
  font-size: large;
  font-weight: 900;
  border: white;
  border-radius: 6px;
  text-align: left;
  overflow: scroll;
  font-size: 2rem;
  line-height: 1.5;
  padding: 10px 0 0 10px;
  position: relative;
  background: rgba(255, 255, 255,.3);
  resize: none;
  &::placeholder{
    color: white;
    font-weight: 900;
  }
  &:focus{
    outline:none;
  }
`
