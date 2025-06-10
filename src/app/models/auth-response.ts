export interface AuthResponse {
    token:string;
    email:string; 
    role:string;
    isFirstTime:Boolean
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: {
        street?: string;
        city: string;
        country?: string;
    };
    role: string;
    firstTime: boolean;
}
