import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firebaseHelper, SignInProvider } from '../../../firebaseHelper';
import * as firebaseData from '../../../firebaseData';
@Component({
  selector: 'welcome',
  templateUrl: '/welcome.template.html'
})
export class WelcomeViewComponent {
  private firebasehelper: firebaseHelper = firebaseHelper.getInstance();
  userType: firebaseData.UserType;
  invalidEmailMsg;
  invalidPassMsg;
  email = '';
  password = '';
  remember = false;
  signIn(signInProvider: SignInProvider) {
    this.invalidEmailMsg = null;
    this.invalidPassMsg = null;
    this.firebasehelper
      .logIn(this.email, this.password, this.remember)
      .then(user => {})
      .catch(error => {
        let authError = error as firebase.default.auth.Error;
        let errorCode = authError.code;
        let errorMessage = authError.message;
        console.log(errorCode);
        console.log(errorMessage);
        if (errorCode.includes('email') || errorCode == 'auth/user-not-found') {
          this.invalidEmailMsg = errorMessage;
        } else if (errorCode.includes('password')) {
          this.invalidPassMsg = errorMessage;
        } else {
          alert(errorMessage);
        }
      });
    /*this.firebasehelper
      .signIn(signInProvider)
      .then(result => {
        console.log(result);
        //this.loaded = true;
      })
      .catch(error => {
        //this.loaded = true;
        console.log(error);
      });*/
  }
  ngOnInit() {
    this.firebasehelper.getAuth().onAuthStateChanged(user => {
      if (user == null) {
        this.userType = firebaseData.UserType.guest;
      } else {
        this.firebasehelper
          .getUser(user.uid)
          .then((user: firebaseData.User) => {
            this.userType = user.type;
          });
      }
    });
  }
  signOut() {
    console.log('signing out');
    this.firebasehelper.signOut().then(result => {
      console.log(result);
      //this.loaded = true;
    });
  }
}
