import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-orgstruct',
  templateUrl: './orgstruct.component.html',
  styleUrls: ['./orgstruct.component.css']
})
export class OrgstructComponent implements OnInit {
    title = 'Administration - Org Structure';
    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
  }

}
