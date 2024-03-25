import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-emailcenter',
  templateUrl: './emailcenter.component.html',
  styleUrls: ['./emailcenter.component.css']
})
export class EmailcenterComponent implements OnInit {
    title = 'Email Centre';

    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
  }

}
