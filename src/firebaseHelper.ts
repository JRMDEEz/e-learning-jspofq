// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import * as firebaseData from './firebaseData';
import { forEach } from '@angular/router/src/utils/collection';
import { getCookie, setCookie } from './cookies';
import { resolve } from 'dns';
import { rejects } from 'assert';
export const firebaseConfig = {
  apiKey: 'AIzaSyC8cdrayX8URs5Hqy8Mz7ZvC3BJZV-E3iI',
  authDomain: 'e-learning-88aa0.firebaseapp.com',
  projectId: 'e-learning-88aa0',
  storageBucket: 'e-learning-88aa0.appspot.com',
  messagingSenderId: '1052559619094',
  appId: '1:1052559619094:web:414967e79669759a763137'
};
var getOptions = {};

export class firebaseHelper {
  private db: firebase.firestore.Firestore;
  private app;
  static instance: firebaseHelper;
  user: firebase.User = null;
  cacheRead: number = 0;
  realtimeRead: number = 0;
  lifetimecahceRead: number = 0;
  lifetimerealtimeRead: number = 0;
  smartcahce = false;
  static getInstance() {
    if (!firebaseHelper.instance)
      firebaseHelper.instance = new firebaseHelper();
    return firebaseHelper.instance;
  }
  constructor() {
    if (!firebase.apps.length) {
      this.app = firebase.initializeApp(firebaseConfig);
      firebase
        .firestore()
        .enablePersistence({ synchronizeTabs: true })
        .then(() => {
          this.smartcahce = true;
          console.log('persistence-enabled!');
        })
        .catch(err => {
          console.log(err.code);
          if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
          } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
          }
        });
    } else {
      this.smartcahce = true;
      this.app = firebase.app(); // if already initialized, use that one
    }
    this.db = firebase.firestore(this.app);
    firebase.auth().useDeviceLanguage();
    console.log('FIREBASE INIT');
    var tmp = getCookie('lifetimecahceRead');
    var tmp1 = getCookie('lifetimerealtimeRead');
    console.log('READ ' + getCookie('lifetimerealtimeRead'));
    this.lifetimecahceRead = tmp != undefined ? Number.parseInt(tmp) : 0;
    this.lifetimerealtimeRead = tmp1 != undefined ? Number.parseInt(tmp1) : 0;
    this.getAuth().onAuthStateChanged(user => {
      this.user = user;
    });
  }
  getCourse(courseId) {
    return new Promise((resolve, reject) => {
      var query = this.db.collection('courses').doc(courseId);
      this.getDocument(query, true)
        .then((result: firebase.firestore.DocumentSnapshot) =>
          resolve(firebaseData.Course.Converter.fromFirestore(result))
        )
        .catch(err => reject(err));
    });
  }
  getCourses() {
    return new Promise((resolve, reject) => {
      this.getcurrentUser().then((user: firebase.User) => {
        this.getUser(user.uid).then((userData: firebaseData.User) => {
          var query;
          if (userData.type == firebaseData.UserType.student) {
            query = this.db
              .collection('courses')
              .where('students', 'array-contains', user.uid);
          } else {
            query = this.db
              .collection('courses')
              .where('teachers', 'array-contains', user.uid);
          }
          this.getDocumentsQuery(query, null, true)
            .then((result: firebase.firestore.QuerySnapshot) => {
              console.log(result.size);
              resolve(firebaseData.Courses.Converter.fromFirestore(result));
            })
            .catch(err => {
              reject(err);
            });
        });
      });
    });
  }
  newCourse() {
    return new Promise((resolve, reject) => {
      this.getcurrentUser().then((user: firebase.User) => {
        var course = new firebaseData.Course(
          null,
          'New Course',
          null,
          'https://leverageedu.com/blog/wp-content/uploads/2019/11/List-of-Courses-after-10th-Standard.jpg',

          null,
          [user.uid],
          null,
          null,
          null,
          [],
          firebase.firestore.Timestamp.now().toMillis()
        );
        this.db
          .collection('courses')
          .add(firebaseData.Course.Converter.toFirestore(course))
          .then(doc => resolve(doc))
          .catch(err => reject(err));
      });
    });
  }
  submitCourse(courseId, course: firebaseData.Course) {
    return new Promise((resolve, reject) => {
      this.db
        .collection('courses')
        .doc(courseId)
        .set(firebaseData.Course.Converter.toFirestore(course))
        .then(doc => resolve(doc))
        .catch(err => reject(err));
    });
  }
  deleteCourse(courseId) {
    return new Promise((resolve, reject) => {
      this.db
        .collection('courses')
        .doc(courseId)
        .delete()
        .then(doc => {
          resolve(doc);
        })
        .catch(err => reject(err));
    });
  }
  getModule(courseId, moduleId) {
    return new Promise((resolve, reject) => {
      var query = this.db
        .collection('courses')
        .doc(courseId)
        .collection('modules')
        .doc(moduleId);
      this.getDocument(query, true)
        .then((result: firebase.firestore.DocumentSnapshot) =>
          resolve(firebaseData.Module.Converter.fromFirestore(result))
        )
        .catch(err => reject(err));
    });
  }
  getModules(courseId) {
    return new Promise((resolve, reject) => {
      var query = this.db
        .collection('courses')
        .doc(courseId)
        .collection('modules');
      this.getDocumentsQuery(query, null, true)
        .then((result: firebase.firestore.QuerySnapshot) => {
          console.log(result.size);
          resolve(firebaseData.Modules.Converter.fromFirestore(result));
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  newModule(courseId) {
    return new Promise((resolve, reject) => {
      this.getModules(courseId)
        .then((modules: firebaseData.Modules) => {
          var module = new firebaseData.Module(
            null,
            'New Module',
            null,
            modules.moduleList.length,
            'https://www.mymove.com/wp-content/uploads/2008/02/GettyImages-489012681.jpg',
            firebase.firestore.Timestamp.now().toMillis()
          );
          this.db
            .collection('courses')
            .doc(courseId)
            .collection('modules')
            .add(firebaseData.Module.Converter.toFirestore(module))
            .then(doc => resolve(doc))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
  deleteModule(courseId, moduleId) {
    return new Promise((resolve, reject) => {
      this.db
        .collection('courses')
        .doc(courseId)
        .collection('modules')
        .doc(moduleId)
        .delete()
        .then(doc => {
          resolve(doc);
        })
        .catch(err => reject(err));
    });
  }
  submitModule(courseId, moduleId, module: firebaseData.Module) {
    return new Promise((resolve, reject) => {
      this.db
        .collection('courses')
        .doc(courseId)
        .collection('modules')
        .doc(moduleId)
        .set(firebaseData.Module.Converter.toFirestore(module))
        .then(doc => resolve(doc))
        .catch(err => reject(err));
    });
  }
  getLesson(courseId, moduleId, lessonId) {
    return new Promise((resolve, reject) => {
      var query = this.db
        .collection('courses')
        .doc(courseId)
        .collection('modules')
        .doc(moduleId)
        .collection('lessons')
        .doc(lessonId);
      this.getDocument(query, true)
        .then((result: firebase.firestore.DocumentSnapshot) => {
          resolve(firebaseData.Lesson.Converter.fromFirestore(result));
        })
        .catch(err => reject(err));
    });
  }
  submitLesson(courseId, moduleId, lessonId, lesson: firebaseData.Lesson) {
    return new Promise((resolve, reject) => {
      this.db
        .collection('courses')
        .doc(courseId)
        .collection('modules')
        .doc(moduleId)
        .collection('lessons')
        .doc(lessonId)
        .set(firebaseData.Lesson.Converter.toFirestore(lesson))
        .then(doc => resolve(doc))
        .catch(err => reject(err));
    });
  }
  newLesson(courseId, moduleId) {
    return new Promise((resolve, reject) => {
      this.getLessons(courseId, moduleId)
        .then((lessons: firebaseData.Lessons) => {
          var lesson = new firebaseData.Lesson(
            null,
            lessons.lessonList.length,
            'new Lesson',
            ''
          );
          this.db
            .collection('courses')
            .doc(courseId)
            .collection('modules')
            .doc(moduleId)
            .collection('lessons')
            .add(firebaseData.Lesson.Converter.toFirestore(lesson))
            .then(doc => {
              resolve(doc);
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
  deleteLesson(courseId, moduleId, lessonId) {
    return new Promise((resolve, reject) => {
      this.db
        .collection('courses')
        .doc(courseId)
        .collection('modules')
        .doc(moduleId)
        .collection('lessons')
        .doc(lessonId)
        .delete()
        .then(doc => {
          resolve(doc);
        })
        .catch(err => reject(err));
    });
  }
  getLessons(courseId, moduleId) {
    return new Promise((resolve, reject) => {
      var query = this.db
        .collection('courses')
        .doc(courseId)
        .collection('modules')
        .doc(moduleId)
        .collection('lessons');
      this.getDocumentsQuery(query, new orderBy('lesson', sortQuery.asc), true)
        .then((result: firebase.firestore.QuerySnapshot) => {
          console.log(result.size);
          resolve(firebaseData.Lessons.Converter.fromFirestore(result));
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  getAssignment(courseId, assignmentId) {
    return new Promise((resolve, reject) => {
      var docRef = this.db
        .collection('courses')
        .doc(courseId)
        .collection('assignments')
        .doc(assignmentId);
      this.getDocument(docRef, true)
        .then((result: firebase.firestore.DocumentSnapshot) => {
          resolve(firebaseData.Assignment.Converter.fromFirestore(result));
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  submitAssignment(
    courseId,
    assignmentId,
    assignment: firebaseData.Assignment
  ) {
    return new Promise((resolve, reject) => {
      this.db
        .collection('courses')
        .doc(courseId)
        .collection('assignments')
        .doc(assignmentId)
        .set(firebaseData.Assignment.Converter.toFirestore(assignment))
        .then(doc => {
          resolve(doc);
        })
        .catch(err => reject(err));
    });
  }
  deleteAssignment(courseId, assignmentId) {
    return new Promise((resolve, reject) => {
      this.db
        .collection('courses')
        .doc(courseId)
        .collection('assignments')
        .doc(assignmentId)
        .delete()
        .then(doc => {
          resolve(doc);
        })
        .catch(err => reject(err));
    });
  }
  newAssignment(courseId, AssignmentType: firebaseData.AssignmentTypes) {
    return new Promise((resolve, reject) => {
      var assignment = new firebaseData.Assignment(
        null,
        null,
        null,
        'new Assignment',
        null,
        false,
        null,
        null,
        null,
        false,
        AssignmentType,
        null
      );
      this.db
        .collection('courses')
        .doc(courseId)
        .collection('assignments')
        .add(firebaseData.Assignment.Converter.toFirestore(assignment))
        .then(doc => {
          resolve(doc);
        })
        .catch(err => reject(err));
    });
  }
  getAssignments(courseId) {
    return new Promise((resolve, reject) => {
      this.getcurrentUser().then((user: firebase.User) => {
        this.getUser(user.uid).then((userData: firebaseData.User) => {
          var query;
          if (userData.type == firebaseData.UserType.student) {
            query = this.db
              .collection('courses')
              .doc(courseId)
              .collection('assignments')
              .where(
                'start',
                '<=',
                firebase.firestore.Timestamp.now().toMillis()
              );
          } else {
            query = this.db
              .collection('courses')
              .doc(courseId)
              .collection('assignments');
          }
          this.getDocumentsQuery(
            query,
            null,
            userData.type != firebaseData.UserType.student
          )
            .then((result: firebase.firestore.QuerySnapshot) => {
              console.log(result.size);
              resolve(firebaseData.Assignments.Converter.fromFirestore(result));
            })
            .catch(err => {
              reject(err);
            });
        });
      });
    });
  }
  getSubmissions(courseId, assignmentId) {
    return new Promise((resolve, reject) => {
      var docRef = this.db
        .collection('courses')
        .doc(courseId)
        .collection('assignments')
        .doc(assignmentId)
        .collection('submissions');
      this.getDocumentsQuery(docRef, null, true)
        .then((result: firebase.firestore.QuerySnapshot) => {
          resolve(firebaseData.Submissions.Converter.fromFirestore(result));
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  submitDropbox(
    courseId,
    assignmentId,
    dropbox: firebaseData.DropboxSubmission,
    uid: string
  ) {
    return new Promise((result, reject) => {
      this.db
        .collection('courses')
        .doc(courseId)
        .collection('assignments')
        .doc(assignmentId)
        .collection('submissions')
        .doc(uid)
        .set(firebaseData.DropboxSubmission.Converter.toFirestore(dropbox))
        .then(doc => result(doc))
        .catch(err => reject(err));
    });
  }
  submitnewDropbox(courseId, assignmentId, uploadList) {
    return new Promise((result, reject) => {
      var DropboxSubmission: firebaseData.DropboxSubmission = new firebaseData.DropboxSubmission(
        new firebaseData.Submission(
          null,
          1,
          null,
          firebase.firestore.Timestamp.now().toMillis(),
          null,
          null
        ),
        uploadList
      );
      this.db
        .collection('courses')
        .doc(courseId)
        .collection('assignments')
        .doc(assignmentId)
        .collection('submissions')
        .doc(this.getAuth().currentUser.uid)
        .set(
          firebaseData.DropboxSubmission.Converter.toFirestore(
            DropboxSubmission
          )
        )
        .then(doc => result(doc))
        .catch(err => reject(err));
    });
  }
  doesSubmissionExists(courseId, assignmentId) {
    return new Promise((resolve, reject) => {
      var docRef = this.db
        .collection('courses')
        .doc(courseId)
        .collection('assignments')
        .doc(assignmentId)
        .collection('submissions')
        .doc(this.getAuth().currentUser.uid);
      this.getDocument(docRef, false)
        .then((result: firebase.firestore.DocumentSnapshot) => {
          resolve(result.exists);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  getDropboxSubmission(courseId, assignmentId, submissionId) {
    return new Promise((resolve, reject) => {
      var docRef = this.db
        .collection('courses')
        .doc(courseId)
        .collection('assignments')
        .doc(assignmentId)
        .collection('submissions')
        .doc(submissionId);
      this.getDocument(docRef, false)
        .then((result: firebase.firestore.DocumentSnapshot) => {
          resolve(firebaseData.DropboxSubmission.Converter.fromFirestore(
            result
          ) as firebaseData.DropboxSubmission);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  getEssaySubmission(courseId, assignmentId, submissionId) {
    return new Promise((resolve, reject) => {
      var docRef = this.db
        .collection('courses')
        .doc(courseId)
        .collection('assignments')
        .doc(assignmentId)
        .collection('submissions')
        .doc(submissionId);
      this.getDocument(docRef, false)
        .then((result: firebase.firestore.DocumentSnapshot) => {
          resolve(firebaseData.EssaySubmission.Converter.fromFirestore(
            result
          ) as firebaseData.EssaySubmission);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  getQuizAssignment(courseId, assignmentId) {
    return new Promise((resolve, reject) => {
      var docRef = this.db
        .collection('courses')
        .doc(courseId)
        .collection('assignments')
        .doc(assignmentId);
      this.getDocument(docRef, false)
        .then((result: firebase.firestore.DocumentSnapshot) => {
          resolve(firebaseData.QuizAssignment.Converter.fromFirestore(
            result
          ) as firebaseData.QuizAssignment);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  getQuizQuestion(courseId, assignmentId, quizId) {
    return new Promise((resolve, reject) => {
      var docRef = this.db
        .collection('courses')
        .doc(courseId)
        .collection('assignments')
        .doc(assignmentId)
        .collection('questions')
        .doc(quizId);
      this.getDocument(docRef, true)
        .then((result: firebase.firestore.DocumentSnapshot) => {
          resolve(firebaseData.QuizQuestion.Converter.fromFirestore(
            result
          ) as firebaseData.QuizQuestion);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  getQuizQuestions(courseId, assignmentId) {
    return new Promise((resolve, reject) => {
      var query = this.db
        .collection('courses')
        .doc(courseId)
        .collection('assignments')
        .doc(assignmentId)
        .collection('questions');
      this.getDocumentsQuery(query, null, true)
        .then((result: firebase.firestore.QuerySnapshot) => {
          resolve(firebaseData.QuizQuestions.Converter.fromFirestore(
            result
          ) as firebaseData.QuizQuestions);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  uploadFile(File: File) {
    console.log('UPLOAD ID: ' + File.name);
    var fbStoragePath =
      'users/' + this.getAuth().currentUser.uid + '/' + File.name;
    var storageRef = firebase
      .storage()
      .ref()
      .child(fbStoragePath);
    var metadata = {
      contentType: File.type,
      name: File.name
    };
    return metadata != null
      ? storageRef.put(File)
      : storageRef.put(File, metadata);
  }
  getUsers(userIds: string[]) {
    return new Promise((resolve, reject) => {
      if (userIds == null || userIds.length == 0) {
        resolve(new firebaseData.Users([]));
        return;
      }
      var docRef = this.db.collection('users');
      var users = new firebaseData.Users([]);
      userIds.forEach(user => {
        this.getDocument(docRef.doc(user), true)
          .then((doc: firebase.firestore.DocumentSnapshot) => {
            users.userList.push(firebaseData.User.Converter.fromFirestore(doc));
            if (userIds.length <= users.userList.length) {
              resolve(users);
            }
          })
          .catch(err => reject(err));
      });
      /*var query = this.db
        .collection('users')
        .where(firebase.firestore.FieldPath.documentId(), 'in', userIds);*/
      /*if (this.getAuth..type == firebaseData.UserType.student) {*/
      /*} else {
          query = this.db
            .collection('courses')
            .where('teachers', 'array-contains', user.id);
            
        }*/
      /*query
        .get()
        .then(documents => {
          this.realtimeRead += documents.size;
          this.lifetimerealtimeRead += documents.size;
          console.log(documents.size);
          resolve(firebaseData.Users.Converter.fromFirestore(documents));
        })
        .catch(err => reject(err));*/
    });
  }

  getAllStudents(search: string, startAt) {
    return new Promise((resolve, reject) => {
      console.log('START: ' + startAt);
      var query = this.db
        .collection('users')
        .where('type', '==', 'student')
        .orderBy('userName')
        .limit(15);
      if (startAt != null) {
        query = this.db
          .collection('users')
          .where('type', '==', 'student')
          .orderBy('userName')
          .startAfter(startAt)
          .limit(15);
      }
      if (search != null) {
        var sanity = search.trim();
        if (sanity.length != 0) {
          console.log('query');
          query = this.db
            .collection('users')
            .where('type', '==', 'student')
            .where('userName', '>=', search)
            .where('userName', '<=', search + '\uf8ff')
            .orderBy('userName')
            .limit(15);
          if (startAt != null) {
            query = this.db
              .collection('users')
              .where('type', '==', 'student')
              .where('userName', '>=', search)
              .where('userName', '<=', search + '\uf8ff')
              .orderBy('userName')
              .startAfter(startAt)
              .limit(15);
          }
        }
      }
      query
        .get()
        .then(documents => {
          this.realtimeRead += documents.size;
          this.lifetimerealtimeRead += documents.size;
          console.log(documents.size);
          console.log('DOCS ' + documents.docs.length);
          resolve(documents);
        })
        .catch(err => reject(err));
    });
  }
  getAllTeachers(search: string, startAt) {
    return new Promise((resolve, reject) => {
      console.log('START: ' + startAt);
      var query = this.db
        .collection('users')
        .where('type', '==', 'teacher')
        .orderBy('userName')
        .limit(15);
      if (startAt != null) {
        query = this.db
          .collection('users')
          .where('type', '==', 'teacher')
          .orderBy('userName')
          .startAfter(startAt)
          .limit(15);
      }
      if (search != null) {
        var sanity = search.trim();
        if (sanity.length != 0) {
          console.log('query');
          query = this.db
            .collection('users')
            .where('type', '==', 'teacher')
            .where('userName', '>=', search)
            .where('userName', '<=', search + '\uf8ff')
            .orderBy('userName')
            .limit(15);
          if (startAt != null) {
            query = this.db
              .collection('users')
              .where('type', '==', 'teacher')
              .where('userName', '>=', search)
              .where('userName', '<=', search + '\uf8ff')
              .orderBy('userName')
              .startAfter(startAt)
              .limit(15);
          }
        }
      }
      query
        .get()
        .then(documents => {
          this.realtimeRead += documents.size;
          this.lifetimerealtimeRead += documents.size;
          console.log(documents.size);
          console.log('DOCS ' + documents.docs.length);
          resolve(documents);
        })
        .catch(err => reject(err));
    });
  }
  getUser(userId) {
    return new Promise((resolve, reject) => {
      var docRef;
      /*if (this.getAuth..type == firebaseData.UserType.student) {*/
      docRef = this.db.collection('users').doc(userId);
      /*} else {
          query = this.db
            .collection('courses')
            .where('teachers', 'array-contains', user.id);
        }*/
      this.getDocument(docRef, false)
        .then((result: firebase.firestore.DocumentSnapshot) => {
          resolve(firebaseData.User.Converter.fromFirestore(result));
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  getcurrentUser() {
    return new Promise(resolve => {
      if (this.user == null) {
        var unsub = this.getAuth().onAuthStateChanged(user => {
          this.user = user;
          unsub();
          resolve(this.user);
        });
      } else {
        resolve(this.user);
      }
    });
  }
  getAuth() {
    return firebase.auth() as firebase.auth.Auth;
  }
  logIn(email: string, password: string, remember: boolean) {
    if (!remember)
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
  signIn(signInProvider: SignInProvider) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          // Existing and future Auth states are now persisted in the current
          // session only. Closing the window would clear any existing state even
          // if a user forgets to sign out.
          // ...
          // New sign-in will be persisted with session persistence.
          var provider;
          switch (signInProvider) {
            case SignInProvider.GoogleAuthProvider:
              provider = new firebase.auth.GoogleAuthProvider();
              /*provider.addScope(
                "https://www.googleapis.com/auth/contacts.readonly"
              );*/
              break;
            case SignInProvider.FacebookAuthProvider:
              provider = new firebase.auth.FacebookAuthProvider();
              break;
          }

          return firebase
            .auth()
            .signInWithPopup(provider)
            .then(result => {
              resolve(result);
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          // Handle Errors here.
          reject(error);
        });
    });
  }
  signOut() {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  startup = true;
  sessionCache = [];
  getUpdatedAt(query) {
    var updatedAt = 0;
    var cursor = null;
    for (var i = 0; i < this.sessionCache.length; i++) {
      var itemquery: firebase.firestore.Query = this.sessionCache[i].query;
      if (query.isEqual(itemquery)) {
        updatedAt = this.sessionCache[i].updatedAt;
        cursor = i;
      }
    }
    return { updatedAt: updatedAt, cursor: cursor };
  }
  updatelifetimeRead() {
    setCookie('lifetimerealtimeRead', this.lifetimerealtimeRead.toString());
    setCookie('lifetimecahceRead', this.lifetimecahceRead.toString());
  }
  //OVER-ENGINEERED save me from this nightmare
  getDocumentsQuery(
    query: firebase.firestore.Query,
    orderBy: orderBy,
    smartcache
  ) {
    return new Promise((resolve, reject) => {
      //sort of ok optimization to save read count
      var updatedAt = this.getUpdatedAt(query);
      console.log('query exist ' + updatedAt.updatedAt);
      console.log('time now ' + firebase.firestore.Timestamp.now().toMillis());
      var onquery = query;
      var offquery = query;
      if (orderBy != null) {
        if (orderBy.sort == sortQuery.asc) {
          onquery = query.orderBy('updatedAt').orderBy(orderBy.name);
          offquery = query.orderBy(orderBy.name);
        } else {
          onquery = query.orderBy('updatedAt').orderBy(orderBy.name, 'desc');
          offquery = query.orderBy(orderBy.name, 'desc');
        }
      }
      var smartquery = onquery;
      if (smartcache)
        smartquery = onquery.where('updatedAt', '>', updatedAt.updatedAt);
      smartquery
        .get()
        .then(result => {
          this.realtimeRead += result.docs.length;
          this.lifetimerealtimeRead += result.docs.length;
          if (this.smartcahce && smartcache) {
            offquery
              .get({ source: 'cache' })
              .then(offresult => {
                this.cacheRead += offresult.docs.length;
                this.lifetimecahceRead += offresult.docs.length;
                this.updatelifetimeRead();
                if (updatedAt.cursor == null) {
                  this.sessionCache.push({
                    query: query,
                    updatedAt: firebase.firestore.Timestamp.now().toMillis()
                  });
                } else {
                  this.sessionCache[updatedAt.cursor] = {
                    query: query,
                    updatedAt: firebase.firestore.Timestamp.now().toMillis()
                  };
                }
                resolve(offresult as firebase.firestore.QuerySnapshot);
              })
              .catch(err => {
                reject(err);
              });
          } else {
            console.log('smartcache off');
            resolve(result as firebase.firestore.QuerySnapshot);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getDocument(docref: firebase.firestore.DocumentReference, smartcache) {
    //OVER-ENGINEERED save me from this nightmare
    return new Promise((resolve, reject) => {
      /*var updatedAt = this.getUpdatedAt(docref);*/
      var tmpquery = docref.get();
      if (!this.startup && this.smartcahce && smartcache)
        tmpquery = docref.get({ source: 'cache' });
      tmpquery
        .then(result => {
          if (
            !result.exists ||
            (this.startup && !this.smartcahce && smartcache)
          ) {
            docref
              .get()
              .then(ondocRef => {
                this.realtimeRead++;
                this.lifetimerealtimeRead++;
                this.updatelifetimeRead();
                resolve(ondocRef as firebase.firestore.DocumentSnapshot);
              })
              .catch(err => {
                reject(err);
              });
          } else {
            result.metadata.fromCache ? this.cacheRead++ : this.realtimeRead++;
            result.metadata.fromCache
              ? this.lifetimecahceRead++
              : this.lifetimerealtimeRead++;
            this.updatelifetimeRead();
            resolve(result as firebase.firestore.DocumentSnapshot);
          }
          this.startup = false;
        })
        .catch(err => {
          if (!this.startup && this.smartcahce && smartcache) {
            docref
              .get()
              .then(ondocRef => {
                this.realtimeRead++;
                this.lifetimerealtimeRead++;
                this.updatelifetimeRead();
                resolve(ondocRef as firebase.firestore.DocumentSnapshot);
              })
              .catch(err => {
                reject(err);
              });
          } else {
            reject(err);
          }
          this.startup = false;
        });
    });
  }
}
export enum SignInProvider {
  GoogleAuthProvider,
  FacebookAuthProvider
}
class orderBy {
  constructor(name: string, sort: sortQuery) {
    this.name = name;
    this.sort = sort;
  }
  public name: string;
  public sort: sortQuery;
}
export enum sortQuery {
  asc,
  desc
}
