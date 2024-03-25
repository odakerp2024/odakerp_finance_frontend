import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MyCustomerDropdown } from 'src/app/model/Admin';
import Swal from 'sweetalert2';
import { EnquiryService } from '../../../../services/enquiry.service';
import { element } from 'protractor';
import { Port, StorageLoactionMaster } from '../../../../model/StorageLocation';
import { StorageLocationService } from '../../../../services/storage-location.service';
declare let $: any;

@Component({
  selector: 'app-storagelocationtype',
  templateUrl: './storagelocationtype.component.html',
  styleUrls: ['./storagelocationtype.component.css']
})
export class StoragelocationtypeComponent implements OnInit {
    
    

    constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private service: EnquiryService, private uk: StorageLocationService) {
        this.route.queryParams.subscribe(params => {
            this.StorageLocationForm = this.fb.group({
                ID: params['id'],
            });

        });
    }

        statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];


     
    id = "0";
    myControl = new FormControl('');
    StorageLocationForm: FormGroup;
    OfficeMasterAllvalues: MyCustomerDropdown[];
    dsPorts: Port[];
    val: any = {};
    dataSource: StorageLoactionMaster[];
    

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
    PortChange(value) {
        /*$("#ddlPortCode").prop("disabled", "disabled");*/
        if (value == 1) {
           
            $('#ddlPortCode').removeAttr('disabled');           
            
        }
        if (value == 2) {
            
            $("#ddlPortCode").prop("disabled", "disabled");
        }
        if (value == 3) {
            
            $("#ddlPortCode").prop("disabled", "disabled");
        }
        
    }
    onInitalBinding() {
        this.OnBindDropdownOfficeLocation();
        this.OnBindPorts();
    }
    OnBindDropdownOfficeLocation() {
       
        this.service.getOfficeList().subscribe(data => {
            this.OfficeMasterAllvalues = data;            
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }
    OnBindPorts() {
        
        this.uk.getPortMasterBind(this.StorageLocationForm.value).subscribe(data => {
            this.dsPorts = data;
        });
    }
    createForm() {
        if (this.StorageLocationForm.value.ID != null) {
            this.uk.getStorageLocationEdit(this.StorageLocationForm.value).pipe(
            ).subscribe(data => {
                this.StorageLocationForm.patchValue(data[0]);
                this.PortChange(data[0].SLTypeID);
                $('#OfficeCode1').select2().val(data[0].OfficeID);
                $('#ddlPortCode').select2().val(data[0].PortID);
                $('#ddlStatus').select2().val(data[0].StatusID);
            });
            this.StorageLocationForm = this.fb.group({
                ID: 0,
                PortID: 0,
                PortCode: '',
                CustomerName: '',
                OfficeID: 0,
                StatusID: 0,
                SLTypeID: 0,
                StorageStatus: 1,
                StorageLoc: '',
                StorageCode: '',
                Remarks: '',
            });
        }
        else {
            this.StorageLocationForm = this.fb.group({
                ID: 0,
                PortID: 0,
                PortCode: '',
                CustomerName: '',
                OfficeID: 0,
                StatusID: 0,
                SLTypeID: 0,
                StorageStatus: 1,
                StorageLoc: '',
                StorageCode: '',
                Remarks: '',
            });

            $('#ddlStatus').select2().val(0);
        }

    }
    onSubmit() {

        var validation = "";      
        if ($('#OfficeCode1').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Office</span></br>"
        }
        if (this.StorageLocationForm.value.StorageLoc == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Storage Location</span></br>"
        }
        if (this.StorageLocationForm.value.SLTypeID == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Storage Location Type</span></br>"
        }
        if (this.StorageLocationForm.value.StorageCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Short Name</span></br>"
        }
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
      
        if ($('#ddlPortCode').val() != "" && $('#ddlPortCode').val() != null) {
           
            this.StorageLocationForm.value.PortID = $('#ddlPortCode').val();
        }
        else {
            this.StorageLocationForm.value.PortID = 0;
        }
        this.StorageLocationForm.value.OfficeID = $('#OfficeCode1').val();
 
        this.StorageLocationForm.value.StatusID = $('#ddlStatus').val();
        
        this.uk.getSaveStoragealocation(this.StorageLocationForm.value).subscribe(Data => {
            this.StorageLocationForm.value.ID = Data[0].ID;
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }
    
}

interface Status {
    value: string;
    viewValue: string;
}
