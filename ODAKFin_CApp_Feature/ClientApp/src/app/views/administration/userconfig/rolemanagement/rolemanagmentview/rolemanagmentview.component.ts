import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-rolemanagmentview',
  templateUrl: './rolemanagmentview.component.html',
  styleUrls: ['./rolemanagmentview.component.css']
})
export class RolemanagmentviewComponent implements OnInit {
    title = 'Role Management';

    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
  }

}
