export interface UserState {
    id: string;
    image:string | undefined;
    username:string;
    email:string;
    phone:string;
    attendedExmas:number;
    activeExmas:number;
    totalScore:number;
    levelAndSemster:string;
}
