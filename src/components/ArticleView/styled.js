import styled from 'styled-components';
import { Card, Button } from 'reactstrap';

export const CardS = styled(Card)`
  background: rgba(255, 255, 255, 0.3);
  width: 31%;
  margin: 10px;
  justify-content: space-around;
  border: double;
  border-color: hotpink;
`
export const ImageContainerS = styled.div`
  height: 200px;
  width: 200px;
  align-self: center;
  margin-top: 1.25rem;
`
export const ButtonS = styled(Button)`
  &:hover{
    transition: 1s ease-in-out;
    background-color: deeppink;
  }
`


