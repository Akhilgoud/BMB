import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class FilterBooksService {
    constructor(private http: Http) {
        this.filterObjChange.subscribe((value) => {
            this.filterObj = value;
        });
    }

    private filterObj: any = {
        isAcademic: "",
        bookType: [],
        course: "",
        branch: "",
        year: "",
        price: {
            lower: 0,
            upper: 2000
        },
        college: "",
        address: ""
    };
    filterObjChange: Subject<any> = new Subject<any>();

    setFilterObj(data) {
        this.filterObjChange.next(data);
    }

    getFilterObj() {
        return this.filterObj;
    }

    resetFilterObj() {
        this.filterObj = {
            isAcademic: "",
            bookType: [],
            course: "",
            branch: "",
            year: "",
            price: {
                lower: 0,
                upper: 2000
            },
            college: "",
            address: ""
        };
    }

}
