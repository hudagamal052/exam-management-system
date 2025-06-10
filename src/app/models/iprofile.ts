export interface IProfile {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: {
        street?: string;
        city?: string;
        country?: string;
    };
    image?: string;
}
