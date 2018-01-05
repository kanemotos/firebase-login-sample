import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {LineAuthHandlerComponent} from './components/line-auth-handler/line-auth-handler.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {environment} from '../environments/environment';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AuthStateService} from './services/auth-state.service';
import {CookieService} from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LineAuthHandlerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // MUST include this under 'imports' after BrowserModule.
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule,
  ],
  providers: [
    AuthStateService,
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
