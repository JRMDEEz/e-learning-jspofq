import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { firebaseHelper } from '../../../firebaseHelper';
import * as firebaseData from '../../../firebaseData';
import { AppComponent } from '../../app.component';
@Component({
  selector: 'welcome',
  templateUrl: '/student.template.html'
})
export class StudentViewComponent {
  userprofile =
    'https://firebasestorage.googleapis.com/v0/b/e-learning-88aa0.appspot.com/o/assets%2Fdefault-user.png?alt=media&token=ae184283-9555-45ed-bf96-9cab7391f4bc';
  private firebasehelper: firebaseHelper = firebaseHelper.getInstance();
  ngOnInit() {
    this.firebasehelper.getcurrentUser().then((user: firebase.default.User) => {
      this.firebasehelper
        .getUser(user.uid)
        .then((userData: firebaseData.User) => {
          if (userData.profile != null && userData.profile != undefined)
            this.userprofile = userData.profile;
        });
    });
  }
  signOut() {
    console.log('logging out');
    this.firebasehelper.signOut().then(result => {
      //this.loaded = true;
    });
  }
}
