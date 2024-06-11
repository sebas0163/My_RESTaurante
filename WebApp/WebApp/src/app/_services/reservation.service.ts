
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from '../_models/user';
import { environment } from '../environments/environment';
import { platformBrowser } from '@angular/platform-browser';

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

    getTimes() {
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token
          });
        const local = localStorage.getItem('selectedLocation');
        return this.http.get<any>(`${environment.apiUrl}/api/time/getByLocal?local=${local}`, { headers: headers })
            .pipe(map(data => {
                return data;
            }));
    }

    getByLocal(local: string) {
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token
          });
        return this.http.get<any>(`${environment.apiUrl}/api/reservation/getByLocal?local=${local}`, { headers: headers })
        .pipe(map(data => {
        return data;
        }));
    }

    getReservationByID(id: string) {
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token
          });
        return this.http.get<any>(`${environment.apiUrl}/api/reservation/getById?id=${id}`, { headers: headers })
            .pipe(map(data => {
                return data;
            }));
    }

    getReservationByEmail(email: string) {
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token
          });
        
        return this.http.get<any>(`${environment.apiUrl}/api/reservation/getByEmail?email=${atob(email)}`, { headers: headers })
            .pipe(map(data => {
                return data;
            }));
    }

    createReservationAdmin(people: string, timeid: string, userid: string) {
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token
          });
        const requestBody = {
            people: people,
            timeid: timeid,
            userid: userid
        };
        console.log("REQUEST CEW RES: ", people, " ", timeid, "", userid);
        return this.http.post<any>(`${environment.apiUrl}/api/reservation/new`, requestBody, { headers: headers })
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


    editReservationAdmin(people: string, reservationid: string, user: string, timeid: string) {
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token
          });
        const requestBody = {
            people: people,
            id: reservationid,
            userid: user,
            timeid: timeid,
        };

 
        return this.http.put<any>(`${environment.apiUrl}/api/reservation/edit`, requestBody, { headers: headers })
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
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token
          });
        return this.http.delete<any>(`${environment.apiUrl}/api/reservation/delete?id=${reservationID}`, { headers: headers })
            .pipe(map(data => {
                return data;
            }));
    }

    createNewTime(local: string, slots:string, time:string) {
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token
          });
        const requestBody = {
            local: local,
            slots: slots,
            time: time
        };
    
        return this.http.post<any>(`${environment.apiUrl}/api/time/newTime`, requestBody, { headers: headers })
            .pipe(
                catchError(error => {
                    console.error('Error occurred: ', error);
                    // You can handle the error here, for example:
                    return throwError('There was a problem creating the time.');
                }),
                map(user => {
                    return user;
                })
            );
    }
}