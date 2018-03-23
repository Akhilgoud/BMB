export interface IUserObj {
    name: string,
    email: string,
    password: string
}

export class IUserObj implements IUserObj {
    constructor(){
        this.name="";
        this.email = "";
        this.password = "";        
    }
}