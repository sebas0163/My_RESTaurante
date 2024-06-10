
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
            'authorization': 'Bearer ' + this.userValue?.id
          });
        return this.http.get<any>(`${environment.apiUrl}/api/time/getSchedule`, { headers: headers })
            .pipe(map(data => {
                console.log("getSchedule: ", data);
                return data;
            }));
    }

    getByLocal() {
        const location = localStorage.getItem('selectedLocation');
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.id
          });
        return this.http.get<any>(`${environment.apiUrl}/api/reservation/getByLocal?local=${location}`, { headers: headers })
        .pipe(map(data => {
        console.log("getByLocal: ", data);
        return data;
        }));
    }

    getReservationByID(id: string) {
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.id
          });
        return this.http.get<any>(`${environment.apiUrl}/api/reservation/getById?id=${id}`, { headers: headers })
            .pipe(map(data => {
                console.log("getReservationById: ", data);
                return data;
            }));
    }

    createReservationAdmin(people: string, timeid: string, userid: string) {
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.id
          });
        const requestBody = {
            people: people,
            timeid: timeid,
            userid: userid
        };
    
        return this.http.post<any>(`${environment.apiUrl}/api/reservation/new`, requestBody, { headers: headers })
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


    editReservationAdmin(people: string, timeid: string, user: string) {
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.id
          });
        const requestBody = {
            people: people,
            id: timeid,
            user: user
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
            'authorization': 'Bearer ' + this.userValue?.id
          });
        return this.http.delete<any>(`${environment.apiUrl}/api/time/getSchedule?id=${reservationID}`, { headers: headers })
            .pipe(map(data => {
                return data;
            }));
    }
}