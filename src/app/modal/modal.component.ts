import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import{AuthService} from '../auth.service';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  modalRef: BsModalRef;
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  description;

  @Output() dataEvent = new EventEmitter();


  constructor(private modalService: BsModalService, calendar: NgbCalendar, private Auth:AuthService) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
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
        let data = [this.fromDate.year,this.fromDate.month, this.fromDate.day, this.toDate.year, this.toDate.month, this.toDate.day, this.description]
          this.dataEvent.emit(data);
          }

}
