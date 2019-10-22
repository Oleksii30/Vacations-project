import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import {AuthGuard} from './auth.guard';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { LogoutComponent } from './logout/logout.component'

const routes: Routes = [{
       path: '',
       pathMatch: 'full',
       component: LoginComponent
     },
     {
       path:'users/:userid',
       component:UserComponent,
       canActivate:[AuthGuard]
     },
     {
       path:'forgotpassword',
       component:ForgotpasswordComponent,
     },
     {
       path:'logout',
       component:LogoutComponent,
     }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
