import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-emailconfig',
  templateUrl: './emailconfig.component.html',
  styleUrls: ['./emailconfig.component.css']
})
export class EmailconfigComponent implements OnInit {

    title = 'Email Configuration';

    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
  }

}
