import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false');

  uri = 'http://localhost:4000'
  constructor(private http:HttpClient, private router: Router) { }

  setLoggedIn(value:boolean){
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn', 'true')
  }

  get isLoggedIn(){
    return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus)
  }

  loginUser(firstname,lastname,password){
      return this.http.post(`${this.uri}/login`,{
        firstname,
        lastname,
        password
      })
  }

  getUserDetails(userid){
    return this.http.get(`${this.uri}/${userid}`)
  }
  setVacation(userid, daysOfVacation){
    return this.http.put(`${this.uri}/setdays`,{
      userid,
      daysOfVacation
    })
  }

  getVacationsDetails(userid){
    return this.http.get(`${this.uri}/vacations/${userid}`)
  }

  addVacation(userid, datefrom, dateto, vacation, description,fromyear){
    return this.http.post(`${this.uri}/vacations`,{
      userid,
      datefrom,
      dateto,
      vacation,
      description,
      fromyear
    })
  }
 deleteVacation(id,days,userid){
   return this.http.post(`${this.uri}/delete`,{id,days,userid})
 }

 updateVacation(userid, datefrom, dateto, vacation, prewVacationDays, description, vacationId, fromyear){
   return this.http.put(`${this.uri}/update`,{
     userid,
     datefrom,
     dateto,
     vacation,
     prewVacationDays,
     description,
     vacationId,
     fromyear
   })
 }

restorePassword(firstname,lastname){
  return this.http.post(`${this.uri}/restorePassword`,{firstname,lastname})
}

loginOut(){
  return this.http.get(`${this.uri}/logout`)
}

}
