import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

    title = 'app';
    sideBarOpen = true;

   

    sideBarToggler() {
        this.sideBarOpen = !this.sideBarOpen;
    }
}
