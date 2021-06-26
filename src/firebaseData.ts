import { state } from '@angular/core/src/animation/dsl';
import firebase from 'firebase/app';
import * as values from './values';
export class Course {
  public id;
  public title;
  public thumbnail;
  public subject;
  public courseCode;
  public teachers;
  public students: string[] = [];
  public createdAt;
  public semester;
  public section;
  public description;
  constructor(
    id,
    title,
    description,
    thumbnail,
    subject,
    teachers,
    courseCode,
    section,
    semester,
    students,
    createdAt
  ) {
    this.id = id;
    this.title = title;
    this.thumbnail = thumbnail;
    this.description = description;
    this.subject = subject;
    this.students = students;
    this.courseCode = courseCode;
    this.section = section;
    this.semester = semester;
    this.teachers = teachers;
    this.createdAt = createdAt;
  }
  // Firestore data converter
  public static Converter = {
    toFirestore: function(course: Course) {
      return {
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        teachers: course.teachers,
        subject: course.subject,
        courseCode: course.courseCode,
        section: course.section,
        semester: course.semester,
        students: course.students,
        createdAt: course.createdAt,
        updatedAt: firebase.firestore.Timestamp.now().toMillis()
      };
    },
    fromFirestore: function(snapshot: firebase.firestore.DocumentSnapshot) {
      const data = snapshot.data();

      return snapshot.exists
        ? new Course(
            snapshot.id,
            data.title,
            data.description,
            data.thumbnail,
            data.subject,
            data.teachers,
            data.courseCode,
            data.section,
            data.semester,
            data.students,
            data.createdAt
          )
        : null;
    }
  };
}
export class Courses {
  public courseList: Array<Course> = new Array<Course>();
  // Firestore data converter
  constructor(course: Array<Course>) {
    this.courseList = course;
  }
  public static Converter = {
    fromFirestore: function(snapshot: firebase.firestore.QuerySnapshot) {
      const data = snapshot.docs;
      var course: Array<Course> = new Array<Course>();
      data.forEach((doc: firebase.firestore.DocumentSnapshot) => {
        var tmp: Course = Course.Converter.fromFirestore(doc);
        course.push(tmp);
      });
      return new Courses(course);
    }
  };
}

export class Module {
  public id;
  public module: number;
  public title;
  public description;
  public thumbnail;
  public createdAt;
  constructor(id, title, description, module, thumbnail, createdAt) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.thumbnail = thumbnail;
    this.module = module;
    this.createdAt = createdAt;
  }
  // Firestore data converter
  public static Converter = {
    toFirestore: function(module) {
      return {
        title: module.title,
        description: module.description,
        thumbnail: module.thumbnail,
        createdAt: module.createdAt,
        module: module.module,
        updatedAt: firebase.firestore.Timestamp.now().toMillis()
      };
    },
    fromFirestore: function(snapshot: firebase.firestore.DocumentSnapshot) {
      const data = snapshot.data();
      return snapshot.exists
        ? new Module(
            snapshot.id,
            data.title,
            data.description,
            data.module,
            data.thumbnail,
            data.createdAt
          )
        : null;
    }
  };
}
export class Modules {
  public moduleList: Array<Module> = new Array<Module>();
  // Firestore data converter
  constructor(modules: Array<Module>) {
    this.moduleList = modules;
  }
  public static Converter = {
    fromFirestore: function(snapshot: firebase.firestore.QuerySnapshot) {
      const data = snapshot.docs;
      var module: Array<Module> = new Array<Module>();
      data.forEach((doc: firebase.firestore.DocumentSnapshot) => {
        var tmp = Module.Converter.fromFirestore(doc);
        module.push(tmp);
      });
      return new Modules(module);
    }
  };
}

export class Lesson {
  public id;
  public lesson: number;
  public title;
  public content;
  constructor(id, lesson, title, content) {
    this.id = id;
    this.title = title;
    this.lesson = lesson;
    this.content = content;
  }
  // Firestore data converter
  public static Converter = {
    toFirestore: function(lesson: Lesson) {
      return {
        title: lesson.title,
        lesson: lesson.lesson,
        content: lesson.content,
        updatedAt: firebase.firestore.Timestamp.now().toMillis()
      };
    },
    fromFirestore: function(snapshot: firebase.firestore.DocumentSnapshot) {
      const data = snapshot.data();
      return snapshot.exists
        ? new Lesson(snapshot.id, data.lesson, data.title, data.content)
        : null;
    }
  };
}
export class Lessons {
  public lessonList: Array<Lesson> = new Array<Lesson>();
  // Firestore data converter
  constructor(lessons: Array<Lesson>) {
    this.lessonList = lessons;
  }
  public static Converter = {
    fromFirestore: function(snapshot: firebase.firestore.QuerySnapshot) {
      const data = snapshot.docs;
      var lesson: Array<Lesson> = new Array<Lesson>();
      data.forEach((doc: firebase.firestore.DocumentSnapshot) => {
        var tmp = Lesson.Converter.fromFirestore(doc);
        lesson.push(tmp);
      });
      return new Lessons(lesson);
    }
  };
}
export class Assignment {
  public id;
  public due;
  public title;
  public instructions;
  public start;
  public maxAttempts;
  public timer;
  public rubric: object[];
  public allowLate: boolean;
  public maxScore: number;
  public visible: boolean;
  public type: AssignmentTypes;
  constructor(
    id,
    due: number,
    start: number,
    title,
    instructions,
    allowLate: boolean,
    maxScore: number,
    maxAttempts: number,
    rubric,
    visible: boolean,
    type: AssignmentTypes,
    timer:number
  ) {
    this.id = id;
    this.title = title;
    this.due = due;
    this.instructions = instructions;
    this.start = start;
    this.allowLate = allowLate;
    this.maxScore = maxScore;
    this.rubric = rubric;
    this.visible = visible;
    this.type = type;
    this.maxAttempts = maxAttempts;
    this.timer = timer;
  }
  // Firestore data converter
  public static Converter = {
    toFirestore: function(assignment: Assignment) {
      return {
        title: assignment.title,
        due: assignment.due,
        instructions: assignment.instructions,
        start: assignment.start,
        allowLate: assignment.allowLate as boolean,
        maxAttempts: assignment.maxAttempts,
        maxScore:
          assignment.rubric == null ? (assignment.maxScore as number) : null,
        rubric: assignment.rubric,
        visible: assignment.visible as boolean,
        type: assignment.type,
        updatedAt: firebase.firestore.Timestamp.now().toMillis(),
        timier:assignment.timer
      };
    },
    fromFirestore: function(snapshot: firebase.firestore.DocumentSnapshot) {
      const data = snapshot.data();
      var maxScore = data.maxScore;
      if (data.rubric != null) {
        maxScore = RubricToMaxScore(data.rubric);
      }
      return snapshot.exists
        ? new Assignment(
            snapshot.id,
            data.due,
            data.start,
            data.title,
            data.instructions,
            data.allowLate,
            maxScore == null
              ? null
              : Math.round((maxScore + Number.EPSILON) * 100) / 100,
            data.maxAttempts,
            data.rubric,
            data.visible,
            data.type,
            data.timer
          )
        : null;
    }
  };
}
export function RubricToMaxScore(rubric: object[]) {
  if (rubric == null) return null;
  var maxScore: number = 0;
  rubric.forEach(rubricitem => {
    var scale: object[] = rubricitem.scale;
    if (scale != null)
      if (scale.length > 0)
        maxScore += scale[scale.length - 1].scaleNumber as number;
  });
  return Math.round((maxScore + Number.EPSILON) * 100) / 100;
}
export function RubricSubmissionToMaxScore(rubric: number[]) {
  if (rubric == null) return null;
  var score: number = 0;
  rubric.forEach(scoreItem => {
    score += scoreItem;
  });
  return Math.round((score + Number.EPSILON) * 100) / 100;
}
export enum AssignmentTypes {
  quiz = 'quiz',
  essay = 'essay',
  dropbox = 'dropbox'
}
export var assignmentTypeAttributes = {
  quiz: {
    icon: 'fa-file-signature',
    collections: [{ title: 'Questions', routerLink: '/questions' }]
  },
  essay: { icon: 'fa-pen-fancy' },
  dropbox: { icon: 'fa-folder' }
};
export class Assignments {
  public assignmentList: Array<Assignment> = new Array<Assignment>();
  // Firestore data converter
  constructor(assignments: Array<Assignment>) {
    this.assignmentList = assignments;
  }
  public static Converter = {
    fromFirestore: function(snapshot: firebase.firestore.QuerySnapshot) {
      const data = snapshot.docs;
      var assignment: Array<Assignment> = new Array<Assignment>();
      data.forEach((doc: firebase.firestore.DocumentSnapshot) => {
        var tmp = Assignment.Converter.fromFirestore(doc);
        assignment.push(tmp);
      });
      return new Assignments(assignment);
    }
  };
}
export class Submission {
  public id;
  public attempts;
  public score;
  public flags;
  public rubric: number[];
  public createdAt: number;
  constructor(id, attempts, flags, createdAt: number, score, rubric: number[]) {
    this.id = id;
    this.attempts = attempts;
    this.createdAt = createdAt;
    this.flags = flags;
    this.score = score;
    this.rubric = rubric;
  }
  // Firestore data converter
  public static Converter = {
    toFirestore: function(submission: Submission) {
      return {
        attempts: submission.attempts,
        createdAt: submission.createdAt,
        flags: submission.flags,
        score: submission.score,
        rubric: submission.rubric,
        updatedAt: firebase.firestore.Timestamp.now().toMillis()
      };
    },
    fromFirestore: function(snapshot: firebase.firestore.DocumentSnapshot) {
      const data = snapshot.data();
      var tmp = new Submission(snapshot.id, null, null, null, null, null);
      if (snapshot.exists) {
        tmp = new Submission(
          snapshot.id,
          data.attempts,
          data.flags,
          data.createdAt,
          data.rubric != null
            ? RubricSubmissionToMaxScore(data.rubric)
            : data.score == null
            ? null
            : Math.round((data.score + Number.EPSILON) * 100) / 100,
          data.rubric
        );
      }
      return tmp;
    }
  };
}
export class Submissions {
  public submissionList: Array<Submission>;
  constructor(submissions: Array<Submission>) {
    this.submissionList = submissions;
  }
  public static Converter = {
    fromFirestore: function(snapshot: firebase.firestore.QuerySnapshot) {
      const data = snapshot.docs;
      var submissions: Array<Submission> = new Array<Submission>();
      data.forEach((doc: firebase.firestore.DocumentSnapshot) => {
        var tmp = Submission.Converter.fromFirestore(doc);
        submissions.push(tmp);
      });
      return new Submissions(submissions);
    }
  };
}
export enum FlagTypes {
  missing = 'missing',
  incomplete = 'incomplete',
  absent = 'absent',
  excused = 'excused'
}
export var flagTypeAttributes = {
  missing: { icon: 'fa-circle', color: 'tomato' },
  incomplete: { icon: 'fa-adjust', color: 'orange' },
  absent: { icon: 'fa-user-times', color: 'red' },
  excused: { icon: 'fa-times', color: 'yellowgreen' }
};
export class DropboxSubmission {
  public submission: Submission;
  public files = [];
  constructor(submission: Submission, files) {
    this.submission = submission;
    this.files = files;
  }
  // Firestore data converter
  public static Converter = {
    toFirestore: function(dropbox: DropboxSubmission) {
      return {
        attempts: dropbox.submission.attempts,
        createdAt: dropbox.submission.createdAt,
        rubric: dropbox.submission.rubric,
        flags: dropbox.submission.flags,
        files: dropbox.files,
        score:
          dropbox.submission.rubric == null
            ? (dropbox.submission.score as number)
            : null,
        updatedAt: firebase.firestore.Timestamp.now().toMillis()
      };
    },
    fromFirestore: function(snapshot: firebase.firestore.DocumentSnapshot) {
      const data = snapshot.data();
      return new DropboxSubmission(
        Submission.Converter.fromFirestore(snapshot),
        snapshot.exists ? data.files : null
      );
    }
  };
}
export class EssaySubmission {
  public submission: Submission;
  public essay: string;
  constructor(submission: Submission, essay) {
    this.submission = submission;
    this.essay = essay;
  }
  // Firestore data converter
  public static Converter = {
    toFirestore: function(essay: EssaySubmission) {
      return {
        attempts: essay.submission.attempts,
        createdAt: essay.submission.createdAt,
        rubric: essay.submission.rubric,
        flags: essay.submission.flags,
        essay: essay.essay,
        score:
          essay.submission.rubric == null
            ? (essay.submission.score as number)
            : null,
        updatedAt: firebase.firestore.Timestamp.now().toMillis()
      };
    },
    fromFirestore: function(snapshot: firebase.firestore.DocumentSnapshot) {
      const data = snapshot.data();
      return new EssaySubmission(
        Submission.Converter.fromFirestore(snapshot),
        snapshot.exists ? data.essay : null
      );
    }
  };
}
export class QuizQuestion {
  public questions : Question[];
  public updatedAt: number;
  constructor(questions: Question[], updatedAt) {
    this.questions = questions;
    this.updatedAt = updatedAt;
  }
  // Firestore data converter
  public static Converter = {
    toFirestore: function(quizQuestion: QuizQuestion) {
      return {
        questions: quizQuestion.questions,
        updatedAt: firebase.firestore.Timestamp.now().toMillis()
      };
    },
    fromFirestore: function(snapshot: firebase.firestore.DocumentSnapshot) {
      const data = snapshot.data();
      var questions : Question[] = [];
      (data.questions as object[]).forEach((question)=>{
          questions.push(Question.Converter.fromFirestore(question))
      })
      return new QuizQuestion(questions, data.updatedAt);
    }
  };
}
export class Question{
  public question:string;
  public choices:string[];
  constructor(question ,choices) {
    this.question = question;
    this.choices = choices;
  }
  public static Converter = {
    fromFirestore: function(snapshot) {
      return new Question(snapshot.question,snapshot.choices);
    }
  };
}
export class User {
  public id;
  public userName;
  public profile;
  public type: UserType;
  constructor(id, userName, profile, type: UserType) {
    this.id = id;
    this.profile = profile;
    this.userName = userName;
    this.type = type;
  }
  // Firestore data converter
  public static Converter = {
    toFirestore: function(user) {
      return {
        userName: user.userName,
        type: user.type.toString()
      };
    },
    fromFirestore: function(snapshot: firebase.firestore.DocumentSnapshot) {
      const data = snapshot.data();
      var userType;
      if (!snapshot.exists) {
        userType = UserType.unregistered;
      } else {
        userType = UserType[data.type as string];
      }
      return snapshot.exists
        ? new User(
            snapshot.id,
            data.userName,
            data.profile == null || data.profile == undefined
              ? 'https://firebasestorage.googleapis.com/v0/b/e-learning-88aa0.appspot.com/o/assets%2Fdefault-user.png?alt=media&token=ae184283-9555-45ed-bf96-9cab7391f4bc'
              : data.profile,
            userType
          )
        : new User(
            snapshot.id,
            null,
            'https://firebasestorage.googleapis.com/v0/b/e-learning-88aa0.appspot.com/o/assets%2Fdefault-user.png?alt=media&token=ae184283-9555-45ed-bf96-9cab7391f4bc',
            userType
          );
    }
  };
}
export class Users {
  public userList: Array<User>;
  constructor(users: Array<User>) {
    this.userList = users;
  }
  public static Converter = {
    fromFirestore: function(snapshot: firebase.firestore.QuerySnapshot) {
      const data = snapshot.docs;
      var users: Array<User> = new Array<User>();
      data.forEach((doc: firebase.firestore.DocumentSnapshot) => {
        var tmp = User.Converter.fromFirestore(doc);
        users.push(tmp);
      });
      return new Users(users);
    }
  };
}
export enum UserType {
  guest,
  unregistered,
  student,
  teacher
}
