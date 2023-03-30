import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { User } from '../common/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User;

  constructor(private router: Router) {}

  loadUserFromJwtToken(token: string) {
    try {
      const decoded = jwtDecode<User>(token);

      this.user = decoded;
      return true;
    } catch {
      return false;
    }
  }

  clearUser() {
    this.user = undefined as any;

    this.router.navigate(['signin'])
  }
}
