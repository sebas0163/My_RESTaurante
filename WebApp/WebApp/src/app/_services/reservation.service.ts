
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

    signIn(name: string, email: string, password: string, access_level: string, recovery_pin: string) {
        console.log("Auth enters ");
        
        const requestBody = {
            name: name,
            email: email,
            password: password,
            access_level: access_level,
            recovery_pin: recovery_pin
        };
    
        return this.http.post<any>(`${environment.apiUrl}/api/user/create`, requestBody)
            .pipe(map(user => {
                // store user details in local storage to keep user logged in between page refreshes
                console.log("Auth: ", user);
                return user;
            }));
    }

}