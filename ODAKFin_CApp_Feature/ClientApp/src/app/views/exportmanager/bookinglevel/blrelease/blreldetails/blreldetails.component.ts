import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blreldetails',
  templateUrl: './blreldetails.component.html',
  styleUrls: ['./blreldetails.component.css']
})
export class BlreldetailsComponent implements OnInit {
    title = 'BL Release';

    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
  }

}
