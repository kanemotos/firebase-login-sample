import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {environment} from '../../../environments/environment';
import {AuthStateService} from '../../services/auth-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth,
              private authStateService: AuthStateService) {
  }

  ngOnInit() {
  }

  loginWithLine() {
    const response_type = encodeURIComponent('code');
    const client_id = environment.line.login.channel_id;
    const redirect_uri = encodeURIComponent(window.location.href + 'line_auth_handler');
    const state = this.authStateService.getState();
    const scope = encodeURIComponent('openid profile');
    const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=${response_type}&client_id=${client_id}&`
      + `redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`;

    window.location.href = url;
  }

  logout() {
    this.afAuth.auth.signOut();
  }


}
