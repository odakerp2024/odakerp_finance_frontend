import { Component, OnInit } from '@angular/core';

import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

declare let $: any;

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
    panelOpenState = false;
    constructor(private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer) {
        this.matIconRegistry.addSvgIcon(
            "freight",
            this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/images/freight.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "profit",
            this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/images/profit.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "user",
            this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/images/user.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "database",
            this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/images/database.svg")
        );
    }

    ngOnInit(): void {
    }

    modal() {
        $('#UserProfile').modal('show');
    }

}
