export interface IStudent {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: {
        street: string;
        city: string;
        country: string;
    };
    image?: string;
    role: string;
    firstTime: boolean;
}
