import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-userlogreportview',
  templateUrl: './userlogreportview.component.html',
  styleUrls: ['./userlogreportview.component.css']
})
export class UserlogreportviewComponent implements OnInit {
    title = 'Userlogreportview';

    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
  }

}
