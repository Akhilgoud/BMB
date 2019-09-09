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
        subcourse: "",
        branch: "",
        year: "",
        sem: "",
        price: {
            lower: null,
            upper: null
        },
        college: "",
        address: "",
        isFree: null
    };
    filterObjChange: Subject<any> = new Subject<any>();

    setFilterObj(data) {
        this.filterObjChange.next(data);
    }

    getFilterObj() {
        return { ...this.filterObj };
    }

    resetFilterObj() {
        this.filterObj = {
            isAcademic: "",
            bookType: [],
            course: "",
            subcourse: "",
            branch: "",
            year: "",
            sem: "",
            price: {
                lower: null,
                upper: null
            },
            college: "",
            address: "",
            isFree: null
        };
        this.filterObjChange.next(this.filterObj);

    }

}
