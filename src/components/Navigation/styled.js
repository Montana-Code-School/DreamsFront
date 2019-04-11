import styled from 'styled-components'
import {
  Navbar,
  Nav,
  NavLink,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

export const NavListS = styled(Nav)`
  z-index: 50;
`
export const NavStyleS = styled.div`
  border-bottom: 1px solid gray;
  display: grid;
  justify-content: center;
  font-size: small;
  text-align: center;
  padding-bottom: 4rem;
  padding-top: 2rem;
`
export const NavbarS = styled(Navbar)`
  display: grid;
  font-weight: 600;
`

export const ThetaFlowS = styled.div`
  font-family: serif;
  font-size: 3rem;
  color: white;
  letter-spacing: 2rem;
`
export const NavDivUnderTitleS = styled.div`
  margin-right: .6rem;
`
export const DropdownItemS = styled(DropdownItem)`
  &:hover{
    transition: .5s ease-in-out;
    background-color: transparent;
  }
`

export const DropDownMenuS = styled(DropdownMenu)`
  z-index: 50;
  border: none;
  background-color: transparent;
  left: -28px;
  font-size: small;
`
export const ESpanS = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: xx-large;
  margin-top: -1.9rem;
`

export const DropDownS = styled(UncontrolledDropdown)`
  z-index: 50;
  background-color: white;
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
  width: 4.35rem;
  height: 4.35rem;

`
export const DreamOptionS = styled(NavLink)`
  z-index: 50;
  &:hover{
    transition: .5s ease-in-out;
    background-color: goldenrod;
  }
  background-color: white;
  padding: 20px;
  margin-right: 30px;
  border-radius: 40px;
  border-style: double;
  border-color: darkcyan;
  width: 4.35rem;
  height: 4.35rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  line-height: 1;
`

export const ArchiveOptionS = styled(NavLink)`
    z-index: 50;
  &:hover{
    transition: .5s ease-in-out;
    background-color: turquoise;
  }
  background-color: white;
  padding: 20px;
  margin-right: 30px;
  border-radius: 40px;
  border-style: double;
  border-color: hotpink;
  width: 4.35rem;
  height: 4.35rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  line-height: 1;
`
