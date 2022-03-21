export class Password{
    id:string;
    namePassword:string;
    newPassword: string;
    oldPassword: string;
    confirmNewPassword: string;

    constructor(id:string, namePassword: string, newPassword: string, oldPassword: string, confirmNewPassword: string) {
        this.id = id;
        this.namePassword = namePassword;
        this.newPassword = newPassword;
        this.oldPassword = oldPassword;
        this.confirmNewPassword = confirmNewPassword;
    }
}