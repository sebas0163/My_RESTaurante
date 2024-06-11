import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {environment} from '../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class HashService {
  private secret = environment.hash_secret;

  generateHash(body: any): string {
    const bodyString = body && Object.keys(body).length ? JSON.stringify(body) : '';
    console.log("Body string:", bodyString);

    const hash = CryptoJS.HmacSHA256(bodyString, this.secret).toString(CryptoJS.enc.Hex);
    return hash;
  }
}

