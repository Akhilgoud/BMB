export interface IUserObj {
    uid: string,
    name: string,
    email: string,
    password: string,
    created_date:Date,
    updated_date: Date
}

export class IUserObj implements IUserObj {
    constructor(){
        this.uid = null,
        this.name = null;
        this.email = null;
        this.password = null;        
        this.created_date = null;        
        this.updated_date = null;        
    }
}