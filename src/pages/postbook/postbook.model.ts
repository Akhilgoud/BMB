export interface IBookObj {
    name: string,
    author: string,
    publisher: string,
    edition: string,
    price: number,
    description: string,
    uid: string,
    status: string,
    isAcademic: string,
    bookType: string,
    created_date: Date,
    updated_date: Date,

    course: string,
    branch: string,
    year: number,
    sem: number,

    phoneNo: number,
    address: string,
    landmark: string,
    pincode: number,
    college: string,
    email: string
}

export class IBookObj implements IBookObj {
    constructor() {
        this.name = "";
        this.author = "";
        this.publisher = "";
        this.edition = "";
        this.price = null;
        this.description = "";
        this.uid = "";
        this.status = "";
        this.isAcademic = "";
        this.bookType = "";
        this.created_date = null,
            this.updated_date = null,
            this.course = "";
        this.branch = "";
        this.year = null;
        this.sem = null;
        this.phoneNo = null;
        this.address = "";
        this.landmark = "";
        this.pincode = null;
        this.college = "";
    }
}