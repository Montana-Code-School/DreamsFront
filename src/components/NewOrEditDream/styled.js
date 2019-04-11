import styled from 'styled-components';

export const ThumbsDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-bottom: 5px;
`

export const NoKeysH4 = styled.h4`
  color: snow;
`

export const PageStyle = styled.div`
  margin-left: 25px;
  text-align: center;
`

export const DreamInput = styled.input`
  padding: 10px;
  z-index: 20;
  width: 350px;
  font-family: serif;
  color: gray;
  font-size: x-large;
  font-weight: 900;
  border: white;
  text-align: left;
  margin-bottom: 2rem;
  margin-top: 1.8rem;
  position: relative;
  background: rgba(255,255,255,0.3);
  border-radius: 6px;
  &::placeholder{
    color: gray;
    font-weight: 900;
    font-size: x-large;
  }
  &:focus{
    outline:none;
  }
`
export const DreamTextarea = styled.textarea`
  z-index: 20;
  font-family: serif;
  color: gray;
  font-size: large;
  font-weight: 900;
  border: white;
  text-align: left;
  overflow: scroll;
  font-size: 2rem;
  line-height: 1.5;
  padding: 10px 0 0 10px;
  position: relative;
  background: rgba(255, 255, 255,.3);
  resize: none;
  &::placeholder{
    color: gray;
    font-weight: 900;
  }
  &:focus{
    outline:none;
  }
`

export const SaveButton = styled.button`
  font-size: x-large;
  padding: 15px;
  line-height: 1.5rem;
  color: gray;
  border-radius: 1em 10em 10em 10em;
  margin-top: 15px;
  margin-bottom: 25px;
  font-family: serif;
  border-style: double;
  border-width: 4px;
  -webkit-box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  -moz-box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  &:hover{
    transition: 1s ease-in-out;
    background-color: turquoise;;
  }
`

export const DeleteButton = styled.button`
  color: gray;
  padding: 15px;
  border-radius: 1em 10em 10em 10em;
  margin-bottom: 25px;
  margin-left: 10px;
  font-size: x-large;
  font-family: serif;
  border-style: double;
  border-width: 4px;
  -webkit-box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  -moz-box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  &:hover{
    transition: 1s ease-in-out;
    background-color: turquoise;;
  }
`

export const ArchetypesButton = styled.button`
  font-size: x-large;
  padding: 15px;
  line-height: 1.5rem;
  color: gray;
  border-radius: 1em 10em 10em 10em;
  margin-top: 15px;
  margin-bottom: 25px;
  font-family: serif;
  border-style: double;
  border-width: 4px;
  -webkit-box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  -moz-box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  box-shadow: 2px 2px 3px 1px rgba(181,181,181,0.26);
  &:hover{
    transition: 1s ease-in-out;
    background-color: turquoise;;
  }
`