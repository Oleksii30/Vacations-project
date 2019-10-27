import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import{AuthService} from '../auth.service';

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
  styleUrls: ['./update-modal.component.css']
})
export class UpdateModalComponent implements OnInit{
  modalRef: BsModalRef;
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  description;
  @Input() vacation;
  @Output() dataEvent = new EventEmitter();


  constructor(private modalService: BsModalService, calendar: NgbCalendar, private Auth:AuthService) {

  }
  ngOnInit() {

    }

  openModal(template) {
        this.modalRef = this.modalService.show(template);
      }


      onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
          this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
          this.toDate = date;
        } else {
          this.toDate = null;
          this.fromDate = date;
        }
      }

      isHovered(date: NgbDate) {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
      }

      isInside(date: NgbDate) {
        return date.after(this.fromDate) && date.before(this.toDate);
      }

      isRange(date: NgbDate) {
        return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
      }


      sendData() {
        if (!this.description){
          this.description = this.vacation.description
        }
        let arrFromDate = this.vacation.fromdate.split(",");
        let fromDateSend;
        let toDateSend;
        if(!this.fromDate){
          fromDateSend = {"year":Number(arrFromDate[0]),"month":Number(arrFromDate[1]),"day":Number(arrFromDate[2])};
        }else{
          fromDateSend = this.fromDate
        }
        let arrToDate = this.vacation.todate.split(",");
        if(!this.toDate){
          toDateSend = {"year":Number(arrToDate[0]),"month":Number(arrToDate[1]),"day":Number(arrToDate[2])};
        }else{
          toDateSend = this.toDate
        }
        if (this.fromDate && !this.toDate){
          alert('Please enter end of vacation date')
        }else{
        let data = [fromDateSend.year,fromDateSend.month, fromDateSend.day, toDateSend.year, toDateSend.month, toDateSend.day, this.description, this.vacation.id, this.vacation.vacation, this.vacation.fromdate]
          this.dataEvent.emit(data);
        }
    }
}
