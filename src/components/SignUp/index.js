import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

//styles
import { AuthButtonS } from '../styledComponents/authButtons';
import { AuthFormTitleS } from '../styledComponents/formTitles';
import { InputS } from '../styledComponents/inputs';
import { SignUpS, BlobContainer1S, StyledDivS } from './styled'
import ColorBlob from '../ColorBlob'

import { SignInLink } from '../SignIn'
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../Constants/routes';

const SignUpPage = () => (
  <StyledDivS>
    <AuthFormTitleS
    formTitleBottomMargin={-80}
    formTitleTopMargin={0}
    id="test-title-signup">
    Sign Up</AuthFormTitleS>
    <SignUpForm />
  </StyledDivS>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = (event) => {
    event.preventDefault();
    const { email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.props.history.push(ROUTES.NEW_DREAM);
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form onSubmit={this.onSubmit}>
        <BlobContainer1S id='happy'>
          <ColorBlob
          leftAlign={-3}
          topAlign={2}
          />
        </BlobContainer1S>
        <InputS
          inputPadding={5}
          id="test-input-username"
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Full Name"
        />
        <InputS
          inputPadding={5}
          id="test-input-email"
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <br/>
        <InputS
          id="test-input-passwordone"
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <InputS
          id="test-input-passwordtwo"
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        />
        <AuthButtonS id="test-button-signup-submit" disabled={isInvalid} type="submit">
          Sign Up
        </AuthButtonS>
        <SignInLink/>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <SignUpS>
    {`Don't have an account?`} <Link id="test-link-signup" to={ROUTES.SIGN_UP}>Sign Up</Link>
  </SignUpS>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
  )(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
