import { Component, OnInit } from '@angular/core';
declare let $: any;

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

    constructor() { }

    divOne = true;
    divTwo = false;
    divThree = false;
    divFour = false;
    divFive = false;
    divSix = false;
    showPrin = true;
    showOff = false;

    ngOnInit() {
        $('.my-select').select2();

        $('#ddlinventory').on('select2:select', (e, args) => {

            if ($('#ddlinventory').val() == 0) {
                this.divOne = true;
                this.divTwo = false;
                this.divThree = false;
                this.divFour = false;
                this.divFive = false;
                this.divSix = false;
                this.showPrin = true;
                this.showOff = false;

            }
            if ($('#ddlinventory').val() == 1) {
                this.divOne = false;
                this.divTwo = true;
                this.divThree = false;
                this.divFour = false;
                this.divFive = false;
                this.divSix = false;
                this.showPrin = true;
                this.showOff = false;
            }
            if ($('#ddlinventory').val() == 2) {
                this.divOne = false;
                this.divTwo = false;
                this.divThree = true;
                this.divFour = false;
                this.divFive = false;
                this.divSix = false;
                this.showPrin = true;
                this.showOff = false;
            }
            if ($('#ddlinventory').val() == 3) {
                this.divOne = false;
                this.divTwo = false;
                this.divThree = false;
                this.divFour = true;
                this.divFive = false;
                this.divSix = false;
                this.showPrin = false;
                this.showOff = true;
            }
            if ($('#ddlinventory').val() == 4) {
                this.divOne = false;
                this.divTwo = false;
                this.divThree = false;
                this.divFour = false;
                this.divFive = true;
                this.divSix = false;
                this.showPrin = false;
                this.showOff = true;
            }
            if ($('#ddlinventory').val() == 5) {
                this.divOne = false;
                this.divTwo = false;
                this.divThree = false;
                this.divFour = false;
                this.divFive = false;
                this.divSix = true;
                this.showPrin = false;
                this.showOff = true;
            }
        });
    }

}
