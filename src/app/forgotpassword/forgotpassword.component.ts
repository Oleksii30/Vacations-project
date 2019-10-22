import { Component, OnInit } from '@angular/core';
import{AuthService} from '../auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  firstname:string;
  lastname:string;

  constructor(private Auth:AuthService) { }

  ngOnInit() {
  }

  processForm() {
    this.Auth.restorePassword(this.firstname, this.lastname).subscribe(data=>{
      
    })
  }

}
