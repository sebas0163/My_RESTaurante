import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

    signIn(name: string, email: string, password: string, access_level:string, recovery_pin: string) {
        return this.http.post<any>(`${environment.apiUrl}/api/user/create`, { name, email, password, access_level, recovery_pin })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                console.log("Auth: ", user);
                return user;
            }));
    }

    login(email: string, password: string): Observable<User> {
        // Construct parameters
        let httpParams = new HttpParams()
          .set('email', email)
          .set('password', password);
    
        // Send GET request with parameters
        return this.http.get<User>(`${environment.apiUrl}/api/user/login`, { params: httpParams })
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            console.log("User: ", user);
            this.router.navigate(['/menu-component']);
            return user;
        }));
      }

    
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/user-login-component']);
    }
}