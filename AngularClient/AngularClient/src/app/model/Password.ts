export class Password{
    id:string;
    namePassword:string;
    fileId: string;
    webId: string;
    newPassword!: string;
    oldPassword!: string;

    constructor(id:string, namePassword: string,fileId: string, webId: string) {
        this.id = id;
        this.namePassword = namePassword;
        this.fileId = fileId;
        this.webId = webId;
    }
}