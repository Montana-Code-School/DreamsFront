import React, { Component } from 'react';
import { Link } from 'react-router-dom';

//styles
import { InputS } from '../styledComponents/inputs';
import { AuthButtonS } from '../styledComponents/authButtons';
import { ForgetLinkS, TitleForgetS } from './styled'

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../Constants/routes';

const PasswordForgetPage = () => (
  <div>
    <TitleForgetS>Recover Your Password</TitleForgetS>
    <PasswordForgetForm />
  </div>
)

const INITIAL_STATE = {
  email: '',
  error: null,
  submitted: false,
}

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;
    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE, submitted: true});
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
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <InputS
          name="email"
          value={this.state.email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <AuthButtonS disabled={isInvalid} type="submit">
          Reset My Password
        </AuthButtonS>
        <br />
        {this.state.submitted &&
        <h2>Check your email to reset your password, then <Link to={ROUTES.SIGN_IN}>Sign In</Link></h2>}

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const PasswordForgetLink = () => (
  <ForgetLinkS>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </ForgetLinkS>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
