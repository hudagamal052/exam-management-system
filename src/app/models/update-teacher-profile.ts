import { Location, Teacher } from "./user";

export interface UpdateTeacherProfile {
    name:string;
    email:string;
    phoneNumber?:string;
    location?:Location
}


export interface UpdateTeacherResponse{
    token:string;
    user:Teacher;   
}