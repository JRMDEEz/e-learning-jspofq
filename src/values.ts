export enum viewTypes {
  loading,
  loaded,
  notFound,
  error
}
export enum quizTypes{
  multiple = "multiple",
  blanks = "blanks"
}
export class Rubric {
  public static addCriteria(rubric: object[]) {
    var length = 0;
    if (rubric.length > 0) length = rubric[0].scale.length;
    var scale = [];
    for (let i = 0; i < length; i++) {
      scale.push({ scaleTitle: null, scaleNumber: null as number });
    }
    return { criteriaDescription: null, criteriaTitle: null, scale: scale };
  }
  public static addScale(rubric: object[]) {
    for (let i = 0; i < rubric.length; i++) {
      rubric[i].scale.push({ scaleTitle: null, scaleNumber: null as number });
    }
    return rubric;
  }
  public static removeScale(rubric: object[]) {
    for (let i = 0; i < rubric.length; i++) {
      rubric[i].scale.splice(rubric[i].scale.length - 1, 1);
    }
    return rubric;
  }
}
