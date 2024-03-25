import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EnquiryService } from '../../../../services/enquiry.service';
import { CommonValues, MyCustomerDropdown, MyCntrTypeDropdown, MyPortdrodown, MyTerminaldrodown, MyGeneraldropdown, MyAgencyDropdown } from 'src/app/model/Admin';
import { EncrDecrServiceService } from '../../../../services/encr-decr-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { myCntrTypesDynamicGrid } from '../../../../model/enquiry';
import { CroService } from '../../../../services/cro.service';
import { CRODynamicGrid, MyCro } from '../../../../model/cro';
import { PdfService } from '../../../../services/pdf.service';
import { DynamicCROPDF } from 'src/app/model/Pdf';

@Component({
    selector: 'app-croview',
    templateUrl: './croview.component.html',
    styleUrls: ['./croview.component.css']
})
export class CROViewComponent implements OnInit {
    searchForm: FormGroup;
    DSCro: MyCro[];
    croFilename: DynamicCROPDF[];
    BkgID = 0;
    CROID = 0;
    constructor(private router: Router, private route: ActivatedRoute, private service: EnquiryService, private pdf: PdfService, private fb: FormBuilder, private ES: EncrDecrServiceService, private cs: CroService) { }


    ngOnInit() {
        this.createForm();
        var queryString = new Array();
        this.route.queryParams.subscribe(params => {
            var Parameter = this.ES.get(localStorage.getItem("EncKey"), params['encrypted']);
            var KeyPara = Parameter.split(',');
            for (var i = 0; i < KeyPara.length; i++) {
                var key = KeyPara[i].split(':')[0];
                var value = KeyPara[i].split(':')[1];
                queryString[key] = value;
            }
            if (queryString["ID"] != null) {
                this.CROViewBind(queryString["ID"].toString());
                this.BkgID = queryString["ID"].toString();
            }

        });
    }
    CROViewBind(Idv) {

        this.searchForm.value.ID = Idv;
        this.cs.viewCROList(this.searchForm.value).subscribe((data) => {
            this.DSCro = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }

    createForm() {

        this.searchForm = this.fb.group({
            ID: 0,
            croFilename: '',

        });


    }
    OnClickNew() {

        var values = "ID: " + this.BkgID;

        this.cs.CROValidations(this.searchForm.value).subscribe((data) => {
            if (data[0].CheckCRO != 0) {
                var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
                this.router.navigate(['/views/enquiries-booking/croentry/croentry/'], { queryParams: { encrypted } });
            }
            else {
                Swal.fire("Booking Quota Completed");
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }
    CROEdit(IDv) {

        var values = "CROID: " + IDv;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        this.router.navigate(['/views/enquiries-booking/croentry/croentry/'], { queryParams: { encrypted } });
    }
    btntabclick(tab) {


        var values = "ID: " + this.BkgID;

        //var values = "ID: 8";
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        if (tab == 1) {

            this.router.navigate(['/views/enquiries-booking/booking/booking'], { queryParams: { encrypted } });
        }
        else if (tab == 2) {
            this.router.navigate(['/views/enquiries-booking/croentry/croview/croview'], { queryParams: { encrypted } });
        }

    }

    CROpdf() {

        this.pdf.getCROPDF(this.searchForm.value).subscribe(data => {
            window.open("assets/pdfFiles/cro/" + data[0].croFilename + ".pdf");
        });
    }
}
