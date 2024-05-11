import { Role } from "./role";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    access_level: Role;
    recovery_pin: string;
}
