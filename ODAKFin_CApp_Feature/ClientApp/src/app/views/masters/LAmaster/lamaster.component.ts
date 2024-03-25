import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lamaster',
  templateUrl: './lamaster.component.html',
  styleUrls: ['./lamaster.component.css']
})
export class LamasterComponent implements OnInit {
    title = 'Master Data Managment - LA Master';
    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
  }

}
