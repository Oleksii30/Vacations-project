import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import{AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  routeParams: Params;
  firstname;
  lastname;
  datefrom;
  vacationdays;
  data;
  vacationsData;
  year;
  summ;


  constructor(private activatedRoute: ActivatedRoute, private Auth: AuthService, private router: Router) {
    this.getRouteParams();
   }

  ngOnInit() {
    this.getUserInfo();
    this.getVacationsInfo();

    }

  getRouteParams() {
            this.activatedRoute.params.subscribe( params => {
            this.routeParams = params;
            });
    };

    setVacationDays(){
      let now = new Date();
      let days = this.vacationDays(this.datefrom,now)
      this.vacationdays = Math.floor((days/30.4)*1.75)-this.summ
    }

    vacationDays(dt1,dt2){
      let days = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
      return days
      }

    getUserInfo(){
      this.Auth.getUserDetails(this.routeParams.userid).subscribe(data=>{
        if(data){
        this.firstname = data['user'].firstname;
        this.lastname =  data['user'].lastname;
        this.datefrom = new Date(data['user'].datefrom);
        this.vacationdays = data['user'].vacationdays;
        this.summ = data['summ'][0]
        this.summ = Object.values(this.summ)[0]
        //this.setVacationDays()
        this.Auth.setVacation(this.routeParams.userid, this.vacationdays).subscribe()
      }else{
         this.router.navigateByUrl('/');
       }
      })
     }

     countWeekends(dt1,dt2){
       let count = 0
       let curDate = new Date(dt1.setDate(dt1.getDate()-1))
       while(curDate < dt2){
       curDate = new Date(curDate.setDate(curDate.getDate()+1))
       if(curDate.getDay() == 0 || curDate.getDay() == 6){
         count+=1
       }
         }
         return count
     }

     getArrOfDays(dt1,dt2){
       let curDate = new Date(dt1.setDate(dt1.getDate()))
       let dates =[]
       while(curDate < dt2){
         dates.push(curDate)
       curDate = new Date(curDate.setDate(curDate.getDate()+1))
         }
         return dates
     }


    sendVacationData($event) {
    this.data = $event;
    let fromYear = this.data[0];
    let fromMonth = this.data[1];
    let fromDay = this.data[2];
    let toYear = this.data[3];
    let toMonth = this.data[4];
    let toDay = this.data[5];
    let description = this.data[6];
    let datefrom = fromYear+','+fromMonth+','+fromDay;
    let dateTo = toYear+','+toMonth+','+toDay;
    let dt1 = new Date(datefrom);
    let dt2 = new Date(dateTo);

//Days of new vacation minus weekends
    let vacation = this.vacationDays(dt1,dt2)+1-this.countWeekends(dt1,dt2)

//Check if days of new vacation cross with existing vacations
    let dates = this.getArrOfDays(dt1,dt2)
    let inRange = this.vacationsData.some(vacation=>{
      let vacStart = new Date(vacation.fromdate)
      let vacEnd = new Date(vacation.todate)
      return dates.some(date =>{
        return date >= vacStart && date < vacEnd
      })
    })

      if (this.vacationdays>=vacation && !inRange){
        this.Auth.addVacation(this.routeParams.userid, datefrom, dateTo, vacation, description,fromYear).subscribe(data=>{
          this.vacationsData = data["vacations"];
          this.vacationdays = data["vac"]
        })
      }else{
        alert("Not possible to add Vacation")
      }
    }

    getVacationsInfo(){
      this.Auth.getVacationsDetails(this.routeParams.userid).subscribe(data=>{
        this.vacationsData = data["vacations"];
        })
    }

    deleteItem(id,days,userid){
    this.Auth.deleteVacation(id,days,userid).subscribe(data=>{
      this.vacationsData = data["vacations"];
      this.vacationdays = data["vac"]
    })
    }

    updateVacationData($event) {
    this.data = $event;
    let fromYear = this.data[0];
    let fromMonth = this.data[1];
    let fromDay = this.data[2];
    let toYear = this.data[3];
    let toMonth = this.data[4];
    let toDay = this.data[5];
    let description = this.data[6];
    let vacationId = this.data[7];
    let prewVacationDays = this.data[8];
    let prewVacationStart = this.data[9]
    let datefrom = fromYear+','+fromMonth+','+fromDay;
    let dateTo = toYear+','+toMonth+','+toDay;
    console.log(this.data)
    let dt1 = new Date(datefrom);
    let dt2 = new Date(dateTo);
    
//Days of new vacation minus weekends
    let vacation = this.vacationDays(dt1,dt2)+1-this.countWeekends(dt1,dt2)

//Check if days of new vacation cross with existing vacations
    let dates = this.getArrOfDays(dt1,dt2)
    let inRange = this.vacationsData.some(vacation=>{
      let vacStart = new Date(vacation.fromdate)
      let vacEnd = new Date(vacation.todate)
      return dates.some(date =>{
        return date >= vacStart && date < vacEnd && vacation.fromdate != prewVacationStart
      })
    })

      if (this.vacationdays + prewVacationDays>=vacation && !inRange){
        this.Auth.updateVacation(this.routeParams.userid, datefrom, dateTo, vacation, prewVacationDays, description, vacationId, fromYear).subscribe(data=>{
          this.vacationsData = data["vacations"];
          this.vacationdays = data["vac"]
        })
      }
      else{
          alert("Not possible to update Vacation")
      }
    }

}
