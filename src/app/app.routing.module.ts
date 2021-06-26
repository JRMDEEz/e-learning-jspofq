import { CanDeactivate, RouterModule } from '@angular/router';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentHomeViewComponent } from './views/student/home/home.component';
import { NotFoundViewComponent } from './views/notfound/notfound.component';
import { BrowserModule } from '@angular/platform-browser';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';

//views
import { WelcomeViewComponent } from './views/welcome/welcome.component';
import { WelcomeHomeViewComponent } from './views/welcome/home/welcome.home.component';

import { DropboxSubmitViewComponent } from './views/submit/dropbox/submit.dropbox.component';
//student
import { StudentViewComponent } from './views/student/student.component';
import { StudentModuleViewComponent } from './views/student/course/module.component';
import { StudentLessonViewComponent } from './views/student/course/module/section/section.component';
import { StudentModuleAssignmentsViewComponent } from './views/student/course/assignments/view/module.assignment.component';
import { StudentModuleStartViewComponent } from './views/student/course/start/module.start.component';
import { AssignmentInstructionsViewComponent } from './views/student/course/assignments/view/instructions/assignment.instructions.component';
import { StudentModuleAssignmentsListViewComponent } from './views/student/course/assignments/list/module.assignments.component';
//teacher
import { TeacherHomeViewComponent } from './views/teacher/home/home.component';
import { TeacherViewComponent } from './views/teacher/teacher.component';
import { TeacherCourseViewComponent } from './views/teacher/course/course.component';
import { TeacherModulesViewComponent } from './views/teacher/course/modules/course.modules.component';
import { TeacherModuleViewComponent } from './views/teacher/course/module/course.module.component';
import { TeacherModuleSectionViewComponent } from './views/teacher/course/module/section/module.section.component';
import { TeacherCourseConfigurationViewComponent } from './views/teacher/course/configuration/course.config.component';
import { TeacherCourseAssignmentsViewComponent } from './views/teacher/course/assignments/course.assignments.component';
import { TeacherCourseAssignmentViewComponent } from './views/teacher/course/assignments/assignment/course.assignment.component';
import { TeacherAssignmentSubmissionsViewComponent } from './views/teacher/course/assignments/assignment/submissions/assignment.submissions.component';
import { TeacherAssignmentSubmissionViewComponent } from './views/teacher/course/assignments/assignment/submissions/submission/assignment.submission.component';
import { TeacherCourseStudentsViewComponent } from './views/teacher/course/students/course.students.component';
import { TeacherCourseTeachersViewComponent } from './views/teacher/course/teachers/course.teachers.component';
import { UserViewComponent } from './views/user/user.component';
import { CanDeactivateGuard } from '../can-deactivate/can-deactivate.guard';
import { TeacherModuleSectionsViewComponent } from './views/teacher/course/module/sections/module.sections.component';
@NgModule({
  declarations: [
    StudentHomeViewComponent,
    NotFoundViewComponent,
    StudentModuleViewComponent,
    StudentLessonViewComponent,
    StudentModuleStartViewComponent,
    StudentModuleAssignmentsListViewComponent,
    StudentModuleAssignmentsViewComponent,
    AssignmentInstructionsViewComponent,
    DropboxSubmitViewComponent,
    StudentViewComponent,
    WelcomeViewComponent,
    WelcomeHomeViewComponent,
    TeacherHomeViewComponent,
    TeacherViewComponent,
    TeacherCourseViewComponent,
    TeacherModuleViewComponent,
    TeacherModulesViewComponent,
    TeacherModuleSectionViewComponent,
    TeacherCourseConfigurationViewComponent,
    TeacherCourseAssignmentViewComponent,
    TeacherCourseAssignmentsViewComponent,
    TeacherAssignmentSubmissionsViewComponent,
    TeacherAssignmentSubmissionViewComponent,
    TeacherCourseStudentsViewComponent,
    TeacherCourseTeachersViewComponent,
    UserViewComponent,
    TeacherModuleSectionsViewComponent
  ],
  imports: [
    FormsModule,
    AngularEditorModule,
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'welcome' },
      {
        path: 'welcome',
        component: WelcomeViewComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'home' },
          { path: 'home', component: WelcomeHomeViewComponent }
        ]
      },
      {
        path: 'student',
        component: StudentViewComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'home' },
          { path: 'home', component: StudentHomeViewComponent },
          {
            path: 'module',
            component: StudentModuleViewComponent,
            children: [
              { path: 'start', component: StudentModuleStartViewComponent },

              {
                path: 'assignments',
                children: [
                  {
                    path: 'list',
                    component: StudentModuleAssignmentsListViewComponent
                  },
                  {
                    path: 'view',
                    component: StudentModuleAssignmentsViewComponent,
                    children: [
                      {
                        path: 'instructions',
                        component: AssignmentInstructionsViewComponent
                      },
                      {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'instructions'
                      },
                      { path: '404', component: NotFoundViewComponent },
                      { path: '**', redirectTo: '404' }
                    ]
                  },
                  {
                    path: 'submit',
                    children: [
                      {
                        path: 'dropbox',
                        component: DropboxSubmitViewComponent
                      },
                      { path: '', pathMatch: 'full', redirectTo: '404' },
                      { path: '404', component: NotFoundViewComponent },
                      { path: '**', redirectTo: '404' }
                    ]
                  },
                  { path: '', pathMatch: 'full', redirectTo: 'list' },
                  { path: '404', component: NotFoundViewComponent },
                  { path: '**', redirectTo: '404' }
                ]
              },
              { path: '', pathMatch: 'full', redirectTo: 'start' }
            ]
          },
          { path: 'user', component: UserViewComponent },
          { path: 'module/lesson', component: StudentLessonViewComponent },
          { path: '404', component: NotFoundViewComponent },
          { path: '**', redirectTo: '404' }
        ]
      },
      {
        path: 'teacher',
        component: TeacherViewComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'home' },
          { path: 'home', component: TeacherHomeViewComponent },
          {
            path: 'course',
            component: TeacherCourseViewComponent,
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'modules' },
              { path: 'modules', component: TeacherModulesViewComponent },
              {
                path: 'module',
                component: TeacherModuleViewComponent,
                canDeactivate: [CanDeactivateGuard],
                children: [
                  {
                    path: 'sections',
                    component: TeacherModuleSectionsViewComponent
                  }
                ]
              },
              {
                path: 'module/section',
                component: TeacherModuleSectionViewComponent
              },
              {
                path: 'students',
                component: TeacherCourseStudentsViewComponent
              },
              {
                path: 'teachers',
                component: TeacherCourseTeachersViewComponent
              },
              {
                path: 'assignments',
                component: TeacherCourseAssignmentsViewComponent
              },
              {
                path: 'assignment',
                component: TeacherCourseAssignmentViewComponent,
                canDeactivate: [CanDeactivateGuard],

                children: [
                  {
                    path: 'submissions',
                    component: TeacherAssignmentSubmissionsViewComponent
                  },
                  {
                    path: 'submission',
                    component: TeacherAssignmentSubmissionViewComponent
                  }
                ]
              },

              {
                path: 'config',
                component: TeacherCourseConfigurationViewComponent
              }
            ]
          },
          { path: 'user', component: UserViewComponent },
          { path: '404', component: NotFoundViewComponent },
          { path: '**', redirectTo: '404' }
        ]
      },
      { path: '404', component: NotFoundViewComponent },
      { path: '**', redirectTo: '404' }
    ])
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
