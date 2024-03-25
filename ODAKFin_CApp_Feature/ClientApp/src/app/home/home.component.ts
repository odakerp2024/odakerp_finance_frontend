import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

    constructor() { }

    ngOnInit() {
        this.loadJsFile("../assets/plugins/alertify/js/alertify.js");
    }
    public loadJsFile(url) {
        let node = document.createElement('script');
        node.src = url;
        node.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(node);
    }
}
