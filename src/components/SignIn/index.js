import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose'

//styled
import { AuthFormTitleS } from '../styledComponents/formTitles';
import { InputS } from '../styledComponents/inputs';
import { AuthButtonS } from '../styledComponents/authButtons';
import { PageStyleS, BlobContainer1S, SignInPageS, SignInLinkS } from './styled'
import ColorBlob from '../ColorBlob';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../Constants/routes';
const { REACT_APP_BACKEND_URL } = process.env;

/**
 * @param {string} name The cookie name.
 * @return {?string} The corresponding cookie value to lookup.
 */
function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

/**
 * @param {string} url The session login endpoint.
 * @param {string} idToken The ID token to post to backend.
 * @param {?string} csrfToken The CSRF token to send to backend.
 * @return {jQuery.jqXHR<string>} A jQuery promise that resolves on completion.
 */
const postIdTokenToAuth = function(url, idToken, csrfToken) {
  // POST to session login endpoint.
  
  return fetch(`${REACT_APP_BACKEND_URL}/auth`, {
    method: 'POST',
    body: JSON.stringify({idToken, csrfToken}),
    credentials: 'include',
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then((data) => {
    return data
  })
  .catch((error)=> {
    throw new Error(`postIdTokenToAuth, ${error}`);
  })
};

const handleSignedInUser = function(idToken, csrfToken) {
  return postIdTokenToAuth('/auth', idToken, csrfToken)
  .then(function(data) {
    return data
  }, function(error) {
    throw new Error(`handleSignedInUser, ${error}`);
  });
};

const SignInPage = () => (
  <SignInPageS>
    <AuthFormTitleS
    id="test-signin-h1"
    formTitleBottomMargin={-80}
    formTitleTopMargin={0}>
    Sign In</AuthFormTitleS>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </SignInPageS>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(async () => {
        const idToken = await this.props.firebase.getServerToken();
        const csrfToken = await getCookie('csrfToken');
        await handleSignedInUser(idToken, csrfToken)
        await this.setState({ ...INITIAL_STATE });
        await this.props.history.push(ROUTES.DREAM_ARCHIVE);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return(
      <PageStyleS>
         <BlobContainer1S>
          <ColorBlob/>
        </BlobContainer1S>
        <form onSubmit={this.onSubmit}>
          <InputS
            inputPadding={5}
            id="test-input-email"
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
          <InputS
            inputPadding={5}
            id="test-input-password"
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
          <AuthButtonS
            id="test-button-signin-submit"
            disabled={isInvalid}
            type="submit">
            Sign In
          </AuthButtonS>
          {error && <p>{error.message}</p>}
        </form>
      </PageStyleS>
    );
  }
}

const SignInLink = () => (
  <SignInLinkS>
    Already have an account? <Link id="test-link-signin" to={ROUTES.SIGN_IN}>Sign In</Link>
  </SignInLinkS>
);

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);



export default SignInPage;

export { SignInForm, SignInLink };
