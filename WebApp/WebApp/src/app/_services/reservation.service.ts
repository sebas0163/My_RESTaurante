
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from '../_models/user';
import { environment } from '../environments/environment';
import { platformBrowser } from '@angular/platform-browser';

import { HashService } from './hash.service';

@Injectable({ providedIn: 'root' })
export class ReservationService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient,
        private hashService: HashService
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    getTimes() {
        const requestBody = {};
        const hash = this.hashService.generateHash(requestBody);
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token,
            'x-auth-required': 'true',
            'x-auth-hash': hash
          });
        const local = localStorage.getItem('selectedLocation');
        return this.http.get<any>(`${environment.apiUrl}/api/time/getByLocal?local=${local}`, { headers: headers })
            .pipe(map(data => {
                console.log("getSchedule: ", data);
                return data;
            }));
    }

    getByLocal() {
        const requestBody = {};
        const hash = this.hashService.generateHash(requestBody);
        const location = localStorage.getItem('selectedLocation');
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token,
            'x-auth-required': 'true',
            'x-auth-hash': hash
          });
        return this.http.get<any>(`${environment.apiUrl}/api/reservation/getByLocal?local=${location}`, { headers: headers })
        .pipe(map(data => {
        console.log("getByLocal: ", data);
        return data;
        }));
    }

    getReservationByID(id: string) {
        const requestBody = {};
        const hash = this.hashService.generateHash(requestBody);
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token,
            'x-auth-required': 'true',
            'x-auth-hash': hash
          });
        return this.http.get<any>(`${environment.apiUrl}/api/reservation/getById?id=${id}`, { headers: headers })
            .pipe(map(data => {
                console.log("getReservationById: ", data);
                return data;
            }));
    }

    getReservationByEmail(email: string) {
        const requestBody = {};
        const hash = this.hashService.generateHash(requestBody);
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token,
            'x-auth-required': 'true',
            'x-auth-hash': hash
          });

        return this.http.get<any>(`${environment.apiUrl}/api/reservation/getByEmail?email=${atob(email)}`, { headers: headers })
            .pipe(map(data => {
                console.log("getReservationByEmail: ", data);
                return data;
            }));
    }

    createReservationAdmin(people: string, timeid: string, userid: string) {
        const requestBody = {
            people: people,
            timeid: timeid,
            userid: userid
        };
        const hash = this.hashService.generateHash(requestBody);
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token,
            'x-auth-required': 'true',
            'x-auth-hash': hash
          });

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
        const requestBody = {
            people: people,
            id: timeid,
            user: user
        };
        const hash = this.hashService.generateHash(requestBody);
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token,
            'x-auth-required': 'true',
            'x-auth-hash': hash
          });

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
        const requestBody = {};
        const hash = this.hashService.generateHash(requestBody);
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token,
            'x-auth-required': 'true',
            'x-auth-hash': hash
          });
        return this.http.delete<any>(`${environment.apiUrl}/api/time/getSchedule?id=${reservationID}`, { headers: headers })
            .pipe(map(data => {
                return data;
            }));
    }

    createNewTime(local: string, slots:string, time:string) {
        const requestBody = {
            local: local,
            slots: slots,
            time: time
        };
        const hash = this.hashService.generateHash(requestBody);
        const headers = new HttpHeaders({
            'authorization': 'Bearer ' + this.userValue?.token,
            'x-auth-required': 'true',
            'x-auth-hash': hash
          });

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
