
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from '../_models/user';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    getAll() {
        console.log("GetAll enters ");

        return this.http.get<any>(`${environment.apiUrl}/api/reservation/getAll`)
            .pipe(map(data => {
                // store user details in local storage to keep user logged in between page refreshes
                console.log("Auth: ", data);
                return data;
            }));
    }

    getReservationByEmail(email: string) {
        return this.http.get<any>(`${environment.apiUrl}/api/reservation/getByEmail?email=${email}`)
            .pipe(map(data => {
                // store user details in local storage to keep user logged in between page refreshes
                console.log("getReservationByEmail: ", data);
                return data;
            }));
    }

    createReservation(userid: string, timeid: string, people: string) {
        const requestBody = {
            userid: userid,
            timeid: timeid,
            people: people
        };
    
        return this.http.post<any>(`${environment.apiUrl}/api/reservation/new`, requestBody)
            .pipe(
                catchError(error => {
                    console.error('Error occurred: ', error);
                    // You can handle the error here, for example:
                    return throwError('There was a problem creating the reservation.');
                }),
                map(user => {
                    // store user details in local storage to keep user logged in between page refreshes
                    console.log("Auth: ", user);
                    return user;
                })
            );
    }

    createReservationAdmin(email: string, time: string, date: string, people: string, quota: string) {
        const requestBody = {
            email: email,
            time: time,
            date: date,
            people: people,
            quota: quota
        };
    
        return this.http.post<any>(`${environment.apiUrl}/api/reservation/newAdmin`, requestBody)
            .pipe(
                catchError(error => {
                    console.error('Error occurred: ', error);
                    // You can handle the error here, for example:
                    return throwError('There was a problem creating the reservation.');
                }),
                map(user => {
                    // store user details in local storage to keep user logged in between page refreshes
                    console.log("Auth: ", user);
                    return user;
                })
            );
    }

    editReservationAdmin(email: string, time: string, date: string, people: string, quota: string) {
        const requestBody = {
            email: email,
            time: time,
            date: date,
            people: people,
            quota: quota
        };
    
        return this.http.post<any>(`${environment.apiUrl}/api/reservation/newAdmin`, requestBody)
            .pipe(
                catchError(error => {
                    console.error('Error occurred: ', error);
                    // You can handle the error here, for example:
                    return throwError('There was a problem creating the reservation.');
                }),
                map(user => {
                    // store user details in local storage to keep user logged in between page refreshes
                    return user;
                })
            );
    }


    deleteReservation(reservationID: string) {
        return this.http.delete<any>(`${environment.apiUrl}/api/reservation/delete?id=${reservationID}`)
            .pipe(map(data => {
                return data;
            }));
    }
}