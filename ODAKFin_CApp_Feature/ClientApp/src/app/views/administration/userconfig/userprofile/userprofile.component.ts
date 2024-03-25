import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/services/masters.service';
import { MyUsers, CommonValues, MyDivision, MyCustomerDropdown, OfficeLocationGrid } from '../../../../model/Admin';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AdminService } from '../../../../services/admin.service';
import { User } from 'oidc-client';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { Key } from 'protractor';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnquiryService } from '../../../../services/enquiry.service';
import { DynamicGridOperator, DynamicGridService, SlotOperator } from '../../../../model/common';
import { SalesOffice } from '../../../../model/org';
declare let $: any;




@Component({
    selector: 'app-userprofile',
    templateUrl: './userprofile.component.html',
    styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

    GenderValues: CommonValues[];
    MartialValues: CommonValues[];
    Division: MyDivision[];
    Designation: MyDivision[];
    Department: MyDivision[];
    Branch: MyDivision[];
    dataSource: MyUsers[];
    myControl = new FormControl('');
    userForm: FormGroup;
    errorMsg: string;
    ddGeoLocationItem: SalesOffice[];
    DynamicOfficeLocation: Array<OfficeLocationGrid> = [];
    newOfficeLocation: any = {};
    val: any = {};
    UID = null;
    HDArrayIndex = '';
    UIDValue = '';

    constructor(private router: Router, private route: ActivatedRoute, private service: AdminService, private service1: MastersService, private fb: FormBuilder, private VS: EnquiryService, private ES: EncrDecrServiceService) {

    }

    ngOnInit() {
        $(document).on('select2:open', (e) => {
            const selectId = e.target.id

            $(".select2-search__field[aria-controls='select2-" + selectId + "-results']").each(function (
                key,
                value,
            ) {
                value.focus();
            })
        })
        //this.newOfficeLocation = { UID: '', OfficeLocID: 0, OfficeLoc: '' };
        //this.DynamicOfficeLocation.push(this.newOfficeLocation);
        this.createForm();
        this.InitBind();

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
                this.userForm = this.fb.group({
                    ID: queryString["ID"].toString(),

                });
                this.ExistingUserValueBind();

            }

        });
    }
    createForm() {
        this.userForm = this.fb.group({
            ID: 0,
            UserID: '',
            UserName: '',
            Password: '',
            DOB: '',
            Gender: '',
            MartialStatus: '',
            Address: '',
            DesID: '',
            DepID: '',
            BranchID: '',
            DivID: '',
            DOJ: '',
            EmailID: '',
            MobNo: ''
        });
    }
    Recordsave() {

        var validation = "";
        var txtUserID = $('#txtUserID').val();
        if (txtUserID.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter User ID</span></br>"

        }
        var txtUserName = $('#txtUserName').val();
        if (txtUserName.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter User Name</span></br>"

        }

        var txtPassword = $('#txtPassword').val();
        if (txtPassword.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Password</span></br>"
        }

        var txtDOB = $('#txtDOB').val();
        if (txtDOB.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Date Of Birth</span></br>"
        }
        var ddlGender = $('#ddlGender').val();
        if (ddlGender == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Gender</span></br>"
        }
        var ddlMartial = $('#ddlMartial').val();
        if (ddlMartial == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Martial Status</span></br>"
        }
        //var ddlBranch = $('#ddlBranch').val();
        //if (ddlBranch == null) {
        //    validation += "<span style='color:red;'>*</span> <span>Please Select Branch</span></br>"
        //}
        var ddlDepartment = $('#ddlDepartment').val();
        if (ddlDepartment == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Department</span></br>"
        }
        var ddlDesignation = $('#ddlDesignation').val();
        if (ddlDesignation == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Designation</span></br>"
        }

        var txtEmailID = $('#txtEmailID').val();
        if (txtEmailID.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Email ID</span></br>"
        }
        var txtMobile = $('#txtMobile').val();
        if (txtMobile.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Mobile No</span></br>"
        }
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }

        var ItemsST = [];
        for (let item of this.DynamicOfficeLocation) {

            ItemsST.push('Insert:' + item.UID, item.OfficeLocID, item.OfficeLoc);

        };
        this.userForm.value.Items = ItemsST.toString();

        this.userForm.value.Gender = $('#ddlGender').val();
        this.userForm.value.MartialStatus = $('#ddlMartial').val();
        this.userForm.value.DesID = $('#ddlDesignation').val();
        this.userForm.value.DepID = $('#ddlDepartment').val();
        this.userForm.value.BranchID = 0;
        this.userForm.value.DivID = $('#ddlDivision').val();
        this.service.SaveUserList(this.userForm.value).subscribe(User => { Swal.fire("Record Saved Successfully") });
    }

    InitBind() {
        $('.my-select').select2();
        this.InitDropdownGender();

    }
    InitDropdownGender() {
        this.GenderValues = [
            { ID: '1', Desc: 'Male' },
            { ID: '2', Desc: 'Female' },
        ];
        this.MartialValues = [
            { ID: '1', Desc: 'Single' },
            { ID: '2', Desc: 'Married' },
        ]

        this.service.getDivisionList().subscribe(data => {
            this.Division = data;

        });
        this.service.getDesignationList().subscribe(data => {
            this.Designation = data;

        });
        this.service.getDepartmentList().subscribe(data => {
            this.Department = data;
        });
        //this.service.getBranchList().subscribe(data => {
        //    this.Branch = data;
        //});   
        this.service1.getGeoLocBind(this.userForm.value).subscribe(data => {
            this.ddGeoLocationItem = data;
        });
    }

    ExistingUserValueBind() {
        let errorMsg: string;
        this.service.getUserExisting(this.userForm.value).pipe(
            catchError(error => {
                if (error.error instanceof ErrorEvent) {
                    this.errorMsg = `Error: ${error.error.message}`;
                } else {
                    this.errorMsg = this.getServerErrorMessage(error);
                }
                return throwError(errorMsg);
            })

        ).subscribe(data => {
            this.userForm.patchValue(data[0])
            $('#ddlGender').select2().val(data[0].Gender);
            $('#ddlMartial').select2().val(data[0].MartialStatus);
            $('#ddlDivision').select2().val(data[0].DivID);
            $('#ddlDepartment').select2().val(data[0].DepID);
            $('#ddlDesignation').select2().val(data[0].DesID);
        });
        this.service.getOfficeLocationEidt(this.userForm.value).pipe(tap(data => {
            this.DynamicOfficeLocation.splice(0, 1);

            for (let item of data) {

                this.DynamicOfficeLocation.push({

                    'UID': item.UID,
                    'OfficeLocID': item.OfficeLocID,
                    'OfficeLoc': item.OfficeLoc,
                });
            }

        }

        )).subscribe();

        this.userForm = this.fb.group({
            ID: 0,
            UserID: '',
            UserName: '',
            Password: '',
            DOB: '',
            Gender: 0,
            MartialStatus: 0,
            Address: '',
            DesID: 0,
            DepID: 0,
            /* BranchID:0,*/
            DivID: 0,
            DOJ: '',
            EmailID: '',
            MobNo: ''
        });

    }

    AddOffice() {


        var validation = "";

        var ddlOffice = $('#ddlOffice').val();
        if (ddlOffice == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Terminal Name</span></br>"
        }
        //for (var i = 0; i < this.DynamicTerminalMaster.length; i++) {

        //    if (this.DynamicTerminalMaster[i].TerminalID == $('#ddlTerminal').val()) {

        //        validation += "<span style='color:red;'>*</span> <span>Terminal Name Already Exists </span></br>"
        //    }

        //}
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }

        var UIDValue;

        UIDValue = (this.UID == null) ? 0 : this.UID;

        this.val = {

            UID: UIDValue,
            OfficeLocID: $("#ddlOffice").val(),
            OfficeLoc: $("#ddlOffice option:selected").text(),


        };


        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicOfficeLocation[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicOfficeLocation.push(this.val);
        }
        // console.log('Office', this.val)
        $("#ddlOffice").select2().val(0, "").trigger("change");
        this.HDArrayIndex = "";
    }

    OnclickOfficeSelectvalues(DynamicOfficeLocation, index) {

        this.HDArrayIndex = index;
        this.UID = this.DynamicOfficeLocation[index].UID;
        $("#ddlOffice").select2().val(this.DynamicOfficeLocation[index].OfficeLocID).trigger("change");
    }
    OnclickOfficeRemove(DynamicOfficeLocation, index, UID) {
        this.DynamicOfficeLocation.splice(index, 1);
        this.userForm.value.UID = UID;
        this.service.getOfficeDelete(this.userForm.value).subscribe((data) => {

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }


    private getServerErrorMessage(error: HttpErrorResponse): string {
        switch (error.status) {
            case 404: {
                return `Not Found: ${error.message}`;
            }
            case 403: {
                return `Access Denied: ${error.message}`;
            }
            case 500: {
                return `Internal Server Error: ${error.message}`;
            }
            default: {
                return `Unknown Server Error: ${error.message}`;
            }

        }
    }
}
