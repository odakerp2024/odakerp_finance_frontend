import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-emailconfigview',
  templateUrl: './emailconfigview.component.html',
  styleUrls: ['./emailconfigview.component.css']
})
export class EmailconfigviewComponent implements OnInit {

    title = 'Email Configuration';

    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
  }

}
