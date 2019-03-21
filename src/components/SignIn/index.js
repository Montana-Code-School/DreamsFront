import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import styled from "styled-components";
import ColorBlob from "../ColorBlob";
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../Constants/routes';


const SignInPage = () => (
  <SignInText>
    <h1 id="test-signin-h1">SignIn</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </SignInText>
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
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.NEW_DREAM);
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
      <PageStyle>
         <BlobInputContainerSS>
          <ColorBlob/>
        </BlobInputContainerSS>
        <form onSubmit={this.onSubmit}>
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
          <button disabled={isInvalid} type="submit">
            Sign In
          </button>
          {error && <p>{error.message}</p>}
        </form>
      </PageStyle>
    );
  }
}


const BlobInputContainerSS = styled.div`
  z-index: -1;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250%;
  height: 50%;
  transform: scale(10);
`
const PageStyle = styled.div`
  margin-left: 20px;
  font-family: serif;
  color: gray;
  font-size: x-large;
  font-weight: 900;
`
const SignInText = styled.div`
  margin-left: 25px;
  font-family: serif;
  color: gray;
  font-size: x-large;
  font-weight: 900;
`

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);



export default SignInPage;

export { SignInForm };
