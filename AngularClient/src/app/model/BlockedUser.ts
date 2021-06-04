export class BlockedUser{
    id:string;
    userId:string;
    userName:string;
    description: string;

    constructor(id:string, userId: string, userName: string, description: string) {
        this.id = id;
        this.userName = userName;
        this.userId = userId;
        this.description = description;
    }
}