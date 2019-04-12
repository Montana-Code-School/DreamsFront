import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import styled from "styled-components";

import darkness from './darkness.png';
import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import AccountPage from '../Account';
import NewOrEditDream from '../NewOrEditDream';
import ArchivePage from '../DreamArchive';
import Chat from '../Chatbot';

import * as ROUTES from '../../Constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <AppBackgroundS>
      <Navigation />
      <ContentS>
        <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.NEW_DREAM} component={NewOrEditDream} />
        <Route path={ROUTES.DREAM_ARCHIVE} component={ArchivePage} />
        <Route path={ROUTES.EDIT_DREAM} component={NewOrEditDream} />
        <Route path={ROUTES.CHAT} component={Chat} />
      </ContentS>
    </AppBackgroundS>
  </Router>
);

const AppBackgroundS = styled.div`
  position: relative;
  height: 100%;
  background-image: url(${darkness});
  background-repeat: repeat;
  overflow-x: hidden;
`
const ContentS = styled.div`
  padding: 1.75rem;
  width: 100%;
  height: 100%;
`

export default withAuthentication(App);
