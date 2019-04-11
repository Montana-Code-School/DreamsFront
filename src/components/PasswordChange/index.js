import React, { Component }from 'react';
import { Link } from 'react-router-dom';

//styles
import { PasswordS } from './styled';
import { AuthButtonS } from '../styledComponents/authButtons';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../Constants/routes';


const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
  submitted: false,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE, submitted: true });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render(){
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

    return (
      <form onSubmit={this.onSubmit}>
        <PasswordS
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
        />
        <PasswordS
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
        />
        <AuthButtonS disabled={isInvalid} type="submit">
          Reset My Password
        </AuthButtonS>
        <br />
        {this.state.submitted &&
        <h2>Your password has been successfully changed! <Link to={ROUTES.SIGN_IN}>Sign In</Link></h2>}

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default withFirebase(PasswordChangeForm);
