import { Component, OnInit } from '@angular/core';
import{AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  firstname:string;
  lastname:string;
  password:string;
  constructor(private Auth:AuthService, private router: Router) { }

  ngOnInit() {}

    processForm() {
    this.Auth.loginUser(this.firstname, this.lastname, this.password).subscribe(data=>{
      console.log(data)
      if(data['user'][0]){
      let userid = data['user'][0].id;
      this.router.navigateByUrl(`users/${userid}`);
      this.Auth.setLoggedIn(true)
    }else{
      localStorage.removeItem('loggedIn')
      window.alert("User data is not correct")
    }
    })
    }
}
