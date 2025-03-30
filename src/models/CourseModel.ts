import { CourseClassModel } from "./CourseClassModel";

export interface CourseModel {
    id: number;
    name: string;
    description: string;
    courseClassList: CourseClassModel[];
} 