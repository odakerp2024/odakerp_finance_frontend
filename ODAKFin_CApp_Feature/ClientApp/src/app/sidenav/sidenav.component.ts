import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { Title } from '@angular/platform-browser';
// import { EmployeeProfile } from '../model/useraccessdata';
import { LoginService } from '../services/login.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Globals } from '../globals';
import { CommonService } from '../services/common.service';

declare let $: any;

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
    title = 'User Profile';
    panelOpenState = false;
    ProfileForm: FormGroup;
    useridmain: any;
    public DisplayNone: boolean = true;
    public DisplayEmpNone: boolean = true;
    LandingValues: LandingAppType[] = [
        { value: '1', viewValue: 'MANAGEMENT DASHBOARD' },
        { value: '2', viewValue: 'LINER AGENCY' },
        { value: '3', viewValue: 'FREIGHT FORWARDING' },
        { value: '4', viewValue: 'FINANCE' },
        { value: '5', viewValue: 'SYSTEM ADMIN' },
    ];

    TokenID: number;
    Token: string;
    constructor(private matIconRegistry: MatIconRegistry, private globals: Globals, private titleService: Title, private router: Router, private LService: LoginService,
        private domSanitizer: DomSanitizer, private route: ActivatedRoute, private ES: EncrDecrServiceService, private fb: FormBuilder,
        private commonDataService: CommonService) {
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

    salink: string;
    fflink: string;
    lalink: string;
    fnlink: string;

    ngOnInit(): void {
        this.createForm();
        this.titleService.setTitle(this.title);
        $(function () {
            $('.integerInput').on('input', function () {
                this.value = this.value
                    .replace(/[^\d]/g, '');// numbers and decimals only

            });
        });

        $('.my-select').select2();
        $(document).on('select2:open', (e) => {
            const selecNID = e.target.id

            $(".select2-search__field[aria-controls='select2-" + selecNID + "-results']").each(function (
                key,
                value,
            ) {
                value.focus();
            })
        });
        $(document).on('focus', '.select2-selection.select2-selection--single', function (e) {
            $(this).closest(".select2-container").siblings('select:enabled').select2('open');
        });
        //$("#ddlLandingApp").val().trigger("change");
        if (localStorage.getItem("UserType") == "132" || localStorage.getItem("UserType") == "133") {
            this.DisplayNone = true;
        }
        else {
            this.DisplayNone = false;
        }
        if (localStorage.getItem("UserType") == "134") {
            this.DisplayEmpNone = true;
        }
        else {
            this.DisplayEmpNone = false;
        }
    }
    createForm() {
        this.ProfileForm = this.fb.group({
            ID: 0,
            UserID: 0,
            UserType: 0,
            User_Idv: '',
            Reset_Password: '',
            User_Active: '',
            Employee_Code: '',
            Landing_Application_Id: 0,
            EmployeeName: '',
            ShortName: '',
            Employee_Active_Status: '',
            Gender: '',
            DOB: '',
            Designation: '',
            Landline: '',
            Mobile: '',
            Email: '',
            DateOfJoining: '',
            DateOfConfirmation: '',
            DateOfRelieving: '',
            Division_Name: '',
            Office_Name: '',
            Department: '',
            Reporting_to: '',
            HOD: '',
            SBU_Division_Head: ''
        });
    }
    modal() {

        // this.ProfileForm.value.UserId = localStorage.getItem("UserId");
        // this.ProfileForm.value.UserType = localStorage.getItem("UserType");
        // this.LService.GetEmployeeProfile(this.ProfileForm.value).subscribe(data => {
        //     $("#txtuserid").val(data[0].Email);
        //     $("#txtEmail").val(data[0].Email);
        //     $("#txtResetPassword").val(data[0].Reset_Password);
        //     $("#txtEmpCode").val(data[0].Employee_Code);
        //     $("#txtuseractive").val(data[0].User_Active);
        //     $("#txtGender").val(data[0].Gender);
        //     $("#txtEmpActive").val(data[0].Employee_Active_Status)
        //     $("#txtEmpName").val(data[0].EmployeeName);
        //     $("#txtShortName").val(data[0].ShortName);
        //     $("#txtDOB").val(data[0].DOB);
        //     $("#txtDesignation").val(data[0].Designation);
        //     $("#txtLandline").val(data[0].Landline);
        //     $("#txtMobile").val(data[0].Mobile);
        //     $("#txtDOJ").val(data[0].DateOfJoining);
        //     $("#txtDOC").val(data[0].DateOfConfirmation);
        //     $("#txtDOR").val(data[0].DateOfRelieving);
        //     $("#ddlDivision").val(data[0].Division_Name);
        //     $("#ddlOffice").val(data[0].Office_Name);
        //     $("#txtDepartment").val(data[0].Department);
        //     $("#txtReportingTo").val(data[0].ReportingTo);
        //     $("#txtHOD").val(data[0].HOD);
        //     $("#txtSBUHead").val(data[0].SBU_Division_Head);
        //     $("#ddlLandingApp").select2().val(data[0].Landing_Application_Id).trigger("change");
        //     $("#txtVendorName").val(data[0].VendorName);
        //     $("#txtVendorBranch").val(data[0].VendorBranch);
        // });
        // $('#UserProfile').modal('show');
    }
    OnSubmit() {
        // this.ProfileForm.value.UserId = localStorage.getItem("UserId");
        // this.ProfileForm.value.UserType = localStorage.getItem("UserType");
        // if ($("#ddlLandingApp").val() != 0) {
        //     this.ProfileForm.value.Landing_Application_Id = $("#ddlLandingApp").val();
        // }
        // else {
        //     this.ProfileForm.value.Landing_Application_Id = 0;
        // }
        // this.ProfileForm.value.Landing_Application = $("#ddlLandingApp option:selected").text();
        // this.LService.UpdateEmployeeProfile(this.ProfileForm.value).subscribe(data => {
        //     Swal.fire("Updated Successfully");
        // });
    }

    OnResetPassword() {

        $('#PasswordRestModal').modal('show');
        //this.disablegenerate = false;
    }

    LogOut() {
        debugger
        this.TokenID = parseInt(localStorage.getItem("TokenID"));
        this.ProfileForm.value.ID = Number(localStorage.getItem("TokenID"));
        this.commonDataService.getDeleteToken(this.ProfileForm.value).subscribe(() => {
            //this.allItems = data;
        });
        //window.location.href = "https://localhost:44323/login";
        window.location.href = 'https://navioindia.freighteiz.com/login';
    }

    BindTokenValues(val) {
        this.ProfileForm.value.ID = localStorage.getItem("TokenID");
        this.commonDataService.SendToken(this.ProfileForm.value).subscribe(data => {
            this.TokenID = data[0].ID;
            this.Token = data[0].access_token;

            if (this.Token != 'null') {
                this.OnClickLink(val);
            }
            else {
                //window.location.href = "https://localhost:44323/login";
                window.location.href = this.globals.LANDINGURL + "login";
            }
        });
    }

    // BindInstanceDtls() {
    //     debugger
    //     this.commonDataService.GetInstanceLinks(this.ProfileForm.value).subscribe(data => {
    //         this.ProfileForm.patchValue(data[0]);

    //         for (var i = 0; i < data.length; i++) {
    //             if (data[i].TypeID == 531) {
    //                 this.salink = data[i].Url;
    //             }
    //             if (data[i].TypeID == 532) {
    //                 this.fflink = data[i].Url;
    //             }
    //             if (data[i].TypeID == 533) {
    //                 this.lalink = data[i].Url;
    //             }
    //             if (data[i].TypeID == 534) {
    //                 this.fnlink = data[i].Url;
    //             }
    //         }
    //     });
    // }

    OnClickLink(val) {
        if (val == 1) {
            window.location.href = "https://la-navioindia.freighteiz.com/views/ladashboards/latransactions/latransactions?Token=" + this.Token + "&TokenID=" + this.TokenID;

            //window.open("https://localhost:44301/views/ladashboards/latransactions/latransactions?Token=" + this.Token + "&Token=" + this.TokenID);

        }
        if (val == 2) {
            window.open("https://ff-navioindia.freighteiz.com/ui/#/fflanding?Token=" + this.Token + "&Token=" + this.TokenID);
            
            //window.open("https://" + this.fflink + "?Token=" + this.Token + "&Token=" + this.TokenID);

        }
        if (val == 3) {
                window.open("https://fn-navioindia.freighteiz.com/views/finance/financemaster;tabName=transactions?Token=" + this.Token + "&Token=" + this.TokenID);
           
            //window.open("https://" + this.fnlink + "?Token=" + this.Token + "&Token=" + this.TokenID);

            
        }
        if (val == 4) {
                window.open("https://sa-navioindia.freighteiz.com/views/dashboard?Token=" + this.Token + "&Token=" + this.TokenID);
            
            //window.open("https://" + this.salink + "?Token=" + this.Token + "&Token=" + this.TokenID);

            
        }

    }
}
interface LandingAppType {
    value: string;
    viewValue: string;
}