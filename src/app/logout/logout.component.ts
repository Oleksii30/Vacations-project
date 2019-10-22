import { Component, OnInit } from '@angular/core';
import{AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private Auth:AuthService, private router: Router) { }

  ngOnInit() {
    this.logOut()
  }
logOut(){
  this.router.navigateByUrl('/');
  localStorage.removeItem('loggedIn');
  this.Auth.loginOut().subscribe();
}

}
