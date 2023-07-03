import { generateUUID } from "../utils";

export enum UserRole {
    ADMIN='ADMIN',
    OPERATOR='OPERATOR'
}

interface NameInfo {
    givenName: string
    familyName: string
}

export default class User {
    constructor(
        public userRole: UserRole,
        public login: string, 
        public password:string,
        public name: NameInfo,
        public id?: string){
        this.id = generateUUID()
    }
}