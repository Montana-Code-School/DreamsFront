import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import { AppBackgroundS, ContentS } from './styled.js';
import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import AccountPage from '../Account';
import NewOrEditDream from '../NewOrEditDream';
import ArchivePage from '../DreamArchive';
import LitPage from '../Literature';
import FavoritePage from '../FavoriteArticles';

import Chat from '../Chatbot';
import ErrorSignOut from '../ErrorSignOut';

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
        <Route path={ROUTES.LITERATURE} component={LitPage} />
        <Route path={ROUTES.FAVORITES} component={FavoritePage}/>
        <Route path={ROUTES.ERROR_SIGN_OUT} component={ErrorSignOut} />
        <Route path={ROUTES.CHAT} component={Chat} />
      </ContentS>
    </AppBackgroundS>
  </Router>
);

export default withAuthentication(App);
