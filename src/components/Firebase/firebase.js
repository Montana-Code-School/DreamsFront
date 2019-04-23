import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { resetDreams } from '../../store/actions'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

const { REACT_APP_BACKEND_URL } = process.env;

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) => 
    this.auth.signInWithEmailAndPassword(email, password);
  
  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  getServerToken = () => {
    return this.auth.currentUser.getIdToken(true).then(function(idToken) {
      return idToken;
    }).catch(function(error) {
      throw new Error("Token error");
      console.log(error);
    });
  }

  deAuth = function() {
    // POST to session login endpoint.
    return fetch(`${REACT_APP_BACKEND_URL}/logout`, {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => response.json())
    .then((data) => {
      console.log("deAuth server data", data)
      //  does this do anything ?
      // resetDreams();
      return data
    })
    .catch((error)=> {
      throw new Error(`deAuth, ${error}`);
    })
  };

  // *** User API ***

  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');

}

export default Firebase;
