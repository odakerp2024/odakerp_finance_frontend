import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-vsexphandling',
    templateUrl: './vsexphandling.component.html',
    styleUrls: ['./vsexphandling.component.css']
})
export class VsexphandlingComponent implements OnInit {
    title = 'Vessel Level Tasks-Exception Handling';
    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
    }

}
