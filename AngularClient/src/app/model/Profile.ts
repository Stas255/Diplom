export class Profile{
    username:string;
    email:string;
    newPassword: string;
    oldPassword: string;
    confirmNewPassword: string;

    constructor(email: string, username: string) {
        this.email = email;
        this.username = username;
    }
}