import {Injectable} from '@angular/core';
import {UUID} from 'angular2-uuid';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class AuthStateService {
  constructor(private cookieService: CookieService) {
  }

  getState() {
    const state = UUID.UUID().toString();
    this.cookieService.set('auth_state', state);
    return state;
  }

  checkState(target: string): boolean {
    const state = this.cookieService.get('auth_state');
    const checkResult = (state === target);

    this.cookieService.delete('auth_state');
    return checkResult;
  }
}
