import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from '../_models/user';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
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
            .pipe(
                catchError(error => {
                    console.error('Error occurred: ', error);
                    // You can handle the error here, for example:
                    return throwError('There was a problem signing in.');
                }),
                map(user => {
                    // store user details in local storage to keep user logged in between page refreshes
                    console.log("Auth: ", user);
                    return user;
                })
            );
    }

    login(email: string, password: string): Observable<User> {
        // Construct parameters
        let httpParams = new HttpParams()
            .set('email', email)
            .set('password', password);
    
        // Send GET request with parameters
        return this.http.get<User>(`${environment.apiUrl}/api/user/login`, { params: httpParams })
            .pipe(
                catchError(error => {
                    console.error('Error occurred: ', error);
                    // You can handle the error here, for example:
                    return throwError('There was a problem logging in.');
                }),
                map(user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('user', JSON.stringify(user));
                    this.userSubject.next(user);
                    console.log("User: ", user);
                    this.router.navigate(['/menu-component']);
                    return user;
                })
            );
    }


    resetPassword(email: string, password: string, recovery_pin: string) {
    console.log("Auth enters ");
    
    const requestBody = {
        email: email,
        password: password,
        recovery_pin: recovery_pin
    };

    return this.http.put<any>(`${environment.apiUrl}/api/user/change_password`, requestBody)
        .pipe(
            catchError(error => {
                console.error('Error occurred: ', error);
                // You can handle the error here, for example:
                return throwError('There was a problem resetting the password.');
            }),
            map(user => {
                // store user details in local storage to keep user logged in between page refreshes
                console.log("Auth: ", user);
                return user;
            })
        );
    }
    
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/user-login-component']);
    }
}