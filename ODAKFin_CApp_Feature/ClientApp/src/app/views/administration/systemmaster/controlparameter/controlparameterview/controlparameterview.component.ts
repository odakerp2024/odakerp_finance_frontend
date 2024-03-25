import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-controlparameterview',
  templateUrl: './controlparameterview.component.html',
  styleUrls: ['./controlparameterview.component.css']
})
export class ControlparameterviewComponent implements OnInit {
    title = 'controlparameter works';

    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
  }

}
