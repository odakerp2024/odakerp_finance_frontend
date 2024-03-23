import { Component, OnInit } from '@angular/core';
/*declare let $: any;*/
@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.css']
})
export class ViewsComponent implements OnInit {

  constructor() { }

    ngOnInit() {
       
  }

    OnsubmitOverlay() {
         $('#overlay').fadeIn().delay(2000).fadeOut();

    }
}
