import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class UserDbProvider {

    private db: SQLiteObject;
    private promise: any = null;

    constructor(public http: Http,
        public storage: SQLite) {
        //   this.connectDB();
    }

    connectDB() {
        if (!this.promise) {
            this.promise = new Promise((resolve, reject) => {
                if (this.db) {
                    resolve(this.db);
                }
                else {
                    this.storage = new SQLite();
                    this.storage.create({ name: "data.db", location: "default" }).then((db: SQLiteObject) => {
                        this.db = db;
                        db.executeSql("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT, name TEXT, email TEXT, created_date DATE, updated_date DATE)", []);
                        resolve(this.db);
                    }).catch((error) => {
                        console.log(error);
                        reject(error);
                    })
                }
            });
        }
        return this.promise;
    }

    CreateUser(obj) {
        return new Promise((resolve, reject) => {
            this.connectDB().then((db) => {
                let sql = "INSERT INTO users (uid, name, email, created_date, updated_date) VALUES (?, ?, ?, ?, ?)";
                this.db.executeSql(sql, [obj._id, obj.name, obj.email,
                obj.created_date, obj.updated_date]).then((data) => {
                    resolve(data);
                }, (error) => {
                    reject(error);
                });
            });
        });
    }

    GetUserInfo() {
        return new Promise((resolve, reject) => {
            this.connectDB().then((db) => {
                this.db.executeSql("SELECT * FROM users", []).then((data) => {
                    let arrayUsers = {};
                    if (data.rows.length > 0) {
                        for (var i = 0; i < 1; i++) {
                            arrayUsers = {
                                id: data.rows.item(i).id,
                                uid: data.rows.item(i).uid,
                                name: data.rows.item(i).name,
                                email: data.rows.item(i).email,
                                created_date: data.rows.item(i).created_date,
                                updated_date: data.rows.item(i).updated_date,
                            };
                        }
                    }
                    resolve(arrayUsers);
                }, (error) => {
                    reject(error);
                })
            }, (error) => {
                reject(error);
            });
        })
    }

    DeleteUserData() {
        return new Promise((resolve, reject) => {
            this.db.executeSql("DELETE FROM users", []).then((data) => {
                resolve('SUCCESS');
            }, (error) => {
                reject(error);
            })
        })
    }

}