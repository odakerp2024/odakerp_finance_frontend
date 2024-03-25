import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-commonmaster',
  templateUrl: './commonmaster.component.html',
  styleUrls: ['./commonmaster.component.css']
})
export class CommonmasterComponent implements OnInit {
    title = 'Master Data Management - Common Master';
    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
  }

}
