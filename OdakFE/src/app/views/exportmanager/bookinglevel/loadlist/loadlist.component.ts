import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-loadlist',
  templateUrl: './loadlist.component.html',
  styleUrls: ['./loadlist.component.css']
})
export class LoadlistComponent implements OnInit {
    title = 'Booking Level Tasks';

    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
  }

}
