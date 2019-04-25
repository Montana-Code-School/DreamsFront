import React from 'react';
import { Link } from 'react-router-dom';
import {
  Collapse,
  NavbarToggler,
  NavItem,
  DropdownToggle,
 } from 'reactstrap';

import {
  NavListS,
  NavStyleS,
  NavbarS,
  ThetaFlowS,
  NavDivUnderTitleS,
  DropdownItemS,
  DropDownMenuS,
  ESpanS,
  DropDownS,
  DreamOptionS,
  ArchiveOptionS } from './styled'

import SignOutButton from '../SignOut';
import * as ROUTES from '../../Constants/routes';
import { AuthUserContext } from '../Session';

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <NavStyleS>
        <NavbarS light expand="md">
        <div><ThetaFlowS href="/">THETA</ThetaFlowS></div>
        <NavDivUnderTitleS>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <AuthUserContext.Consumer>
              {authUser =>
                authUser ?
                  <NavigationAuth />
                  : <NavigationNonAuth />
              }
            </AuthUserContext.Consumer>
          </Collapse>
          </NavDivUnderTitleS>
        </NavbarS>
      </NavStyleS>
    );
  }
}

const NavigationAuth = () => (
  <NavListS className="ml-auto" navbar>
    <NavItem>
      <DreamOptionS tag={Link} to={ROUTES.NEW_DREAM}>New <br/> Dream</DreamOptionS>
    </NavItem>
    <NavItem>
      <DreamOptionS tag={Link} to={ROUTES.LITERATURE}>Explore</DreamOptionS>
    </NavItem>
    <NavItem>
      <ArchiveOptionS tag={Link} to={ROUTES.DREAM_ARCHIVE}>Archive</ArchiveOptionS>
    </NavItem>
    <DropDownS nav inNavbar>
      <DropdownToggle nav>
        <ESpanS>...</ESpanS>
      </DropdownToggle>
      <DropDownMenuS>
        <DropdownItemS>
          <DreamOptionS tag={Link} to={ROUTES.ACCOUNT}>Account</DreamOptionS>
        </DropdownItemS>
        <DropdownItemS/>
        <SignOutButton />
      </DropDownMenuS>
    </DropDownS>
  </NavListS>
)

const NavigationNonAuth = () => (
  null
);

