import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as firebaseData from '../../../../../../../firebaseData';
import { firebaseHelper } from '../../../../../../../firebaseHelper';
@Component({
  selector: 'instructions',
  templateUrl: '/assignment.instructions.template'
})
export class AssignmentSubmissionsViewComponent {
  type : firebaseData.AssignmentTypes;
  uploadedList = [];
  courseId;
  assignmentId;
  viewMode;
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    this.assignmentId = this.route.snapshot.queryParams.assignmentId;
    this.getassignment(this.courseId, this.assignmentId);
  }
  getassignment(courseId, assignmentId) {
    console.log('getting');
    this.viewMode = viewType.loading;
    this.firebaseHelper
      .getAssignment(courseId, assignmentId)
      .then((assignment: firebaseData.Assignment) => {
        this.viewMode = viewType.loaded;
        this.type = assignment.type;
        switch(assignment.type) { 
   case firebaseData.AssignmentTypes.dropbox: { 
      this.getDropboxSubmission();
      break; 
   } 
   case firebaseData.AssignmentTypes.essay: { 
      //statements; 
      break; 
   } 
   case firebaseData.AssignmentTypes.quiz: { 
      //statements; 
      break; 
   } 
   default: { 
     console.error("ERROR: AssignmentTypes "+ assignment.type+ "not yet implemented")
      //statements; 
      break; 
   } 
} 
        return;
      })
      .catch(err => {
        this.viewMode = viewType.notfound;
        console.log('Error getting documents: ', err);
        return;
      });
    return;
  }
  getDropboxSubmission(){
    this.firebaseHelper.getDropboxSubmission(this.courseId,this.assignmentId).then((dropbox :firebaseData.DropboxSubmission)=>{
      this.uploadedList = dropbox.files;
    });
  }
}
enum viewType {
  loading,
  loaded,
  notfound
}