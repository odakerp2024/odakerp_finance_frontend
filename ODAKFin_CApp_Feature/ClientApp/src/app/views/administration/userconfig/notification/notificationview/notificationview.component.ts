import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-notificationview',
  templateUrl: './notificationview.component.html',
  styleUrls: ['./notificationview.component.css']
})
export class NotificationviewComponent implements OnInit {
    title = 'Notificationview';

    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
  }

}
