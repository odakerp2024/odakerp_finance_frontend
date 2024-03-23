import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrgService } from 'src/app/services/org.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { City, Country, CurrencyMaster, Port } from '../../../../model/common';
import { MyCustomerDropdown } from '../../../../model/Admin';
import { EnquiryService } from '../../../../services/enquiry.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { CntrpickdropService } from '../../../../services/cntrpickdrop.service';
import { CntrPickDrop } from '../../../../model/CntrPickDepo';
declare let $: any;

@Component({
  selector: 'app-cntrupload',
  templateUrl: './cntrupload.component.html',
  styleUrls: ['./cntrupload.component.css']
})
export class CntruploadComponent implements OnInit {
    CntrMovement: FormGroup;
    OfficeMasterAllvalues: MyCustomerDropdown[];
    constructor(private router: Router, private route: ActivatedRoute, private service: CntrpickdropService, private fb: FormBuilder, private pds: EnquiryService,
        private es: EnquiryService) { }
    getToday(): string {
        return new Date().toISOString().split('T')[0]
    }
    ngOnInit() {
        $('.my-select').select2();
        $(document).on('select2:open', (e) => {
            const selectId = e.target.id

            $(".select2-search__field[aria-controls='select2-" + selectId + "-results']").each(function (
                key,
                value,
            ) {
                value.focus();
            })
        })

        this.createForm();
        this.onInitalBinding();
    }
    onInitalBinding() {

        this.es.getOfficeList().subscribe(data => {
            this.OfficeMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


    }

    createForm() {

        this.CntrMovement = this.fb.group({
            ID: 0,
            OfficeLocation: 0,
            Reference: '',
            RefDate: '',
            PickDropTypeID: 0,
            PickDropLocID: 0,
            OwnPrinciple: 0,
            OprPrinciple: 0,
            OwnCustomer: 0,
            PrincipleAgent: '',
            Remarks: '',
            TransationStatus: 0,
            AttachFile: '',
        });

    }

    selectedFile: File = null;
    uploadedfile: string = null;
    progress: string = '';

    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
        const filedata = new FormData();
        filedata.append('file', this.selectedFile, this.selectedFile.name)
        this.service.AttachUpload(this.selectedFile).subscribe(
            (event) => {

                var fullpath = event;
                var res = JSON.stringify(fullpath).split('\\').pop().split('"}')[0]
                this.uploadedfile = res;
                console.log(this.uploadedfile);

            }
        );

    }

}
