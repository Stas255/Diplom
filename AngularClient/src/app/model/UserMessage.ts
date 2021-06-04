export class Message{
    id:string;
    name:string;
    userName: string;
    description: string;

    constructor(id:string, name: string, userName: string, description: string) {
        this.id = id;
        this.name = name;
        this.userName = userName;
        this.description = description;
    }
}