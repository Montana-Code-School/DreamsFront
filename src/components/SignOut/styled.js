import styled from 'styled-components';
import { DropdownItem } from 'reactstrap';

export const SignOutS = styled(DropdownItem)`
  background-color: white;
  width: 4.35rem;
  height: 4.35rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: small;
  color: black;
  position: inherit;
  margin-left: 1.5rem;
  z-index: 50;
  border: double;
  border-color: darkgoldenrod;
  padding: 20px;
  margin-right: 30px;
  border-radius: 200px;
  border-style: double;
  &:hover{
    transition: .5s ease-in-out;
    background-color: palevioletred;
  }
`
