import styled from 'styled-components';

export const InputS = styled.input`
  padding: ${props => props.inputPadding}px;
  z-index: 20;
  width: 350px;
  font-family: serif;
  color: white;
  font-size: x-large;
  font-weight: 900;
  border: white;
  text-align: left;
  margin-right: 5px;
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
  &:focus{
    outline:none;
  }
`
