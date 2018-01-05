import {Component, OnInit} from '@angular/core';
import {AuthStateService} from '../../services/auth-state.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AngularFireAuth} from 'angularfire2/auth';
import {environment} from '../../../environments/environment';
import {CreateCustomTokenResponse} from '../../interfaces/create-custom-token-response';

@Component({
  selector: 'app-line-auth-handler',
  templateUrl: './line-auth-handler.component.html',
  styleUrls: ['./line-auth-handler.component.css'],
})
export class LineAuthHandlerComponent implements OnInit {

  constructor(private authStateService: AuthStateService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private afAuth: AngularFireAuth) {
    this.route.queryParams.subscribe((params: Params) => {
        const responded_error = params['error'];
        const responded_error_description = params['error_description'];

        if (responded_error) {
          console.error(responded_error_description);
          this.router.navigate(['/']);
          return;
        }

        const code = params['code'];
        const state = params['state'];

        if (this.authStateService.checkState(state) === false) {
          console.error('state is wrong');
          this.router.navigate(['/']);
          return;
        }

        Promise.resolve().then(() => {
          // Request to Cloud Functions
          const url = `${environment.cloud_functions.host_name}/api/auth/line_login/web/custom_token`;
          const redirectUri = (window.location.href).replace(/\?.*$/, '');
          const body = {
            code: code,
            redirect_uri: redirectUri,
          };
          return this.http.post<CreateCustomTokenResponse>(url, body, {
            headers: new HttpHeaders()
              .set('Content-Type', 'application/json')
            ,
          }).toPromise();

        }).then((response: CreateCustomTokenResponse) => {
          return this.afAuth.auth.signInWithCustomToken(response.firebase_token);

        }).then(() => {
          console.log('signed in successfully.');
          this.router.navigate(['/']);

        }).catch((error) => {
          console.error('failed to sign in.');
          console.error(error);

        });
      },
    );
  }

  ngOnInit() {
  }

}
