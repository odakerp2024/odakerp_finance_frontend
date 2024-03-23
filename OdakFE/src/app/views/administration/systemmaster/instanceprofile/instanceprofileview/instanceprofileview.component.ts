import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-instanceprofileview',
  templateUrl: './instanceprofileview.component.html',
  styleUrls: ['./instanceprofileview.component.css']
})
export class InstanceprofileviewComponent implements OnInit {
    title = 'Instanceprofileview';

    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
  }

}
