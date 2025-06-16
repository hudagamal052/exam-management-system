export interface AuthResponse {
    token:string;
    email:string; 
    role:string;
    isFirstTime:Boolean;
    createdAt:string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    location: {
        street?: string;
        city: string;
        country?: string;
    };
    role: string;
    firstTime: boolean;
}
