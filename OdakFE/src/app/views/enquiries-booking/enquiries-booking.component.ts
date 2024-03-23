import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
declare let $: any;

@Component({
  selector: 'app-enquiries-booking',
  templateUrl: './enquiries-booking.component.html',
  styleUrls: ['./enquiries-booking.component.css']
})
export class EnquiriesBookingComponent implements OnInit {
    title = 'Liner Agency';
    constructor(private titleService: Title) { }

    ngOnInit() {
        $('.my-select').select2();
        this.titleService.setTitle(this.title);
  }

}
