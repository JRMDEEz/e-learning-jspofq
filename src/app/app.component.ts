import { Component } from '@angular/core';
import { firebaseHelper } from '../firebaseHelper';
import * as firebaseData from '../firebaseData';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'my-app',
  templateUrl: './app.template.html'
  //templateUrl: './views/teacher/home/home.template'
  //templateUrl: './views/student/student.template'
  //templateUrl: './views/home/home.template'
  //templateUrl: './views/welcome/welcome.template'
  //templateUrl: './views/welcome/home/welcome.home.template'
  //templateUrl: './views/module/module.template'
  //templateUrl: './views/course/course.template'
  //templateUrl: './views/course/assignments/course.assignments.template'
  //templateUrl: './views/course/assignments/submit/dropbox/submit.dropbox.template'
  //templateUrl: './views/teacher/course/configuration/course.config.template'
})
export class AppComponent {
  asd = 'Provided pieces of evidence, supporting details, and factual';
  debug = true;
  firebasehelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private router: Router, private route: ActivatedRoute) {
    router.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        const body = document.getElementsByTagName('body')[0];
        const modalBackdrop = document.getElementsByClassName(
          'modal-backdrop'
        )[0];
        if (body.classList.contains('modal-open')) {
          body.classList.remove('modal-open');
          body.style.removeProperty('overflow');
          body.style.removeProperty('padding-right');
          modalBackdrop.remove();
        }
      }
    });
  }

  ngOnInit() {
    this.firebasehelper.getAuth().onAuthStateChanged(user => {
      if (user == null) {
        if (this.router.url.includes('/welcome')) return;
        this.router.navigate(['./welcome']);
        console.log('welcome');
      } else {
        this.firebasehelper
          .getUser(user.uid)
          .then((userData: firebaseData.User) => {
            if (userData == null) return;
            console.log('AUTH: ' + user);
            var navigateTo;
            switch (userData.type) {
              case firebaseData.UserType.student: {
                if (this.router.url.includes('/student')) return;
                navigateTo = './student';
                console.log('student');
                break;
              }
              case firebaseData.UserType.teacher: {
                if (this.router.url.includes('/teacher')) return;
                navigateTo = './teacher';
                console.log('teacher');
                break;
              }
              default: {
                console.log('default');
                return;
              }
            }
            //this.closeModal.nativeElement.click();
            this.router.navigate([navigateTo]);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  }
}
