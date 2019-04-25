import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../Constants/routes';

class ErrorOnSignOut extends Component { 
  componentDidMount() {
    this.props.firebase.doSignOut()
    this.props.history.push(ROUTES.SIGN_IN)
  }
  render(){
    return(<div></div>)
  }
};

export default withFirebase(ErrorOnSignOut);
