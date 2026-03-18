import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';

import { HomeComponent } from './components/home/home';

import { RegisterComponent } from './components/register/register';

import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

import { ResetPasswordComponent } from './components/reset-password/reset-password.component';



export const routes: Routes = [

  { path: 'register', component: RegisterComponent },

  { path: 'login', component: LoginComponent },

  { path: 'home', component: HomeComponent },

  { path: 'forgot-password', component: ForgotPasswordComponent },

  { path: 'reset-password', component: ResetPasswordComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' }

];