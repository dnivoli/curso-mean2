export class User{
    constructor(
        public _id: string,
        public name: string,
        public surname: string,
        public email: any,
        public password: string,
        public role: string,
        public image: string
    ){}
}