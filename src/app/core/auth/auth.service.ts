import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationApi } from '../constants/authentication_apis';
import { lastValueFrom } from 'rxjs';
import { UserApi } from '../constants/user_apis';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BASE_URL = environment.BASE_URL;
  HEADERS = new HttpHeaders({ Channel: 'STORE' });

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  getAuthStatus() {
    const token = sessionStorage.getItem('token');
    let status = false;
    if (token) status = true;
    return status;
  }

  redirectInvalid() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  renewRefreshToken() {
    var url = this.BASE_URL + AuthenticationApi.REFRESH_TOKEN_API;
    sessionStorage.setItem('token', '');
    const refreshtoken = sessionStorage.getItem('refreshToken');
    var data = { refreshToken: refreshtoken };
    return this.http.post<any>(url, data);
  }

  getUserId(): string {
    const token = sessionStorage.getItem('token');
    let jwt: any = {};
    if (token) {
      jwt = atob(token!.split('.')[1]);
      jwt = JSON.parse(jwt);
    }
    return jwt.userDetails.id;
  }

  async getStoreUser() {
    const currentUserId = this.getUserId();
    var url = this.BASE_URL + UserApi.GET_USER_API(currentUserId);
    const user = await lastValueFrom(this.http.get<any>(url));
    return user;
  }

  getLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }

  checkLocationPermission(): Promise<PermissionStatus> {
    if (navigator.permissions) {
      return navigator.permissions.query({ name: 'geolocation' });
    } else {
      return Promise.reject(new Error('Permissions API is not supported by this browser.'));
    }
  }

  async hasUser(mobile: any) {
    const headers = this.HEADERS;
    var url = this.BASE_URL + AuthenticationApi.HAS_USER_API(mobile);
    const hasUser = await lastValueFrom(this.http.get<any>(url, { headers }));
    return hasUser;
  }

  async doLogin(credentials: any) {
    const headers = this.HEADERS;
    var url = this.BASE_URL + AuthenticationApi.AUTHENTICATION_LOGIN_API;
    const login = await lastValueFrom(this.http.post<any>(url, credentials, { headers }));
    return login;
  }

  async passwordSet(credentials: any) {
    const headers = this.HEADERS;
    var url = this.BASE_URL + AuthenticationApi.SET_PASSWORD_API;
    const passwordSet = await lastValueFrom(this.http.post<any>(url, credentials, { headers }));
    return passwordSet;
  }

  async verifyOtp(data: any) {
    const headers = this.HEADERS;
    var url = this.BASE_URL + AuthenticationApi.VERIFY_OTP_API;
    const verifyOtpResponse = await lastValueFrom(this.http.post<any>(url, data, { headers }));
    return verifyOtpResponse;
  }

  async sendOtp(data: any) {
    const headers = this.HEADERS;
    var url = this.BASE_URL + AuthenticationApi.SEND_OTP_API;
    const sendOtpResponse = await lastValueFrom(this.http.post<any>(url, data, { headers }));
    return sendOtpResponse;
  }

  async resendOtp(mobile: any) {
    const headers = this.HEADERS;
    var url = this.BASE_URL + AuthenticationApi.RESEND_OTP_API(mobile);
    const sendOtpResponse = await lastValueFrom(this.http.get<any>(url, { headers }));
    return sendOtpResponse;
  }

  async resetPassword(username: string) {
    const headers = this.HEADERS;
    var url = this.BASE_URL + AuthenticationApi.RESET_PASSWORD_API(username);
    const reset = await lastValueFrom(this.http.get<any>(url, { headers }));
    return reset;
  }

  async savePassword(data: any) {
    const headers = this.HEADERS;
    var url = this.BASE_URL + AuthenticationApi.SAVE_PASSWORD_API;
    const login = await lastValueFrom(this.http.post<any>(url, data, { headers }));
    return login;
  }
}
