import React from 'react';
import { withFirebase } from '../Firebase';
import { SignOutS } from './styled'

const SignOutButton = ({ firebase }) => (
  <SignOutS type="button" onClick={async () => {
    await firebase.deAuth()
    await firebase.doSignOut()
  }}>
    Sign Out
  </SignOutS>
);

export default withFirebase(SignOutButton);
