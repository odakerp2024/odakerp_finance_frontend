import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/services/masters.service';
import { Login } from '../model/common';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../services/login.service';
declare let $: any;
import { Title } from '@angular/platform-browser';
import { CommonService } from '../services/common.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    title = 'Odak Solutions Pvt Ltd';
    typeSelected: string;
    LoginForm: FormGroup;
    user = '1';
    payload: any = "";
    payloadupdatepermission: any = "";
    payloadcombinepermission: any = "";
    final_list = [];
    ItmesArr = [];
    useridd = "";
    useridmain: any;
    useridnumber = 0;
    constructor(private router: Router, private route: ActivatedRoute, private LService: LoginService, private fb: FormBuilder, private titleService: Title,
        private commonService: CommonService) { }
    private allItems: any[];
    ngOnInit() {
        this.titleService.setTitle(this.title);
        this.createForm();
        localStorage.setItem('SeesionUser', this.user)
        this.setEntityConfigurable();
        // this.router.navigate(['/views/dashboard' ]);
    }

    createForm() {
        this.LoginForm = this.fb.group({
            ID: 0,
            Username: '',
            Password: '',
            Token: ''
        });
    }
    OnsubmitLogin() {

        var Validation = "";
        if (this.LoginForm.value.Username == "") {
            Validation += "please type email id</br>";
        }
        if (this.LoginForm.value.Password == "") {
            Validation += "please type Password</br>";
        }
        if (Validation != "") {
            Swal.fire(Validation);
            return;
        }

        const payload = {
            user_Idv: this.LoginForm.value.Username,
            user_Password: this.LoginForm.value.Password
        }
        this.LService.loginList(payload).subscribe(data => {
            debugger
            if (!data.error) {
                const Token = "odakla@2023";
                // this.setEntityConfigurable();
                localStorage.setItem("UserID", data.data.logindetails.UserId);
                localStorage.setItem("UserName", data.data.logindetails.User_Idv);
                localStorage.setItem('OrgId', '1'); // need to get from login in feature for diff org
                this.GeneratePermission(data.data.logindetails.UserId);
                this.router.navigate(['/views/finance/financemaster',{tabName : 'transactions'}],);
            } else {
                Swal.fire("Invalid Credentials");
            }
        });

        // this.LService.getLoginList(this.LoginForm.value).subscribe(data => {
        //     debugger
        //     if (data.length > 0) {
        //         const Token = "odakla@2023";
        //         console.log("LoginDetails", data[0]);
        //         console.log("userid", data[0].ID.toString());
        //         console.log("Token", data[0].Token);

        //         this.allItems = data;
        //         this.setEntityConfigurable();
        //         localStorage.setItem("UserID", data[0].ID.toString());
        //         localStorage.setItem("UserName", data[0]["UserName"]);
        //         localStorage.setItem("Token", Token);
        //         localStorage.setItem("EncKey", "ODAK21$#@$^@1ODK");
        //         localStorage.setItem("NotAllowed", "Edit not Allowed");
        //         localStorage.setItem("Save", "Record Saved Successfully");
        //         localStorage.setItem('OrgId', '1'); // need to get from login in feature for diff org
        //         this.GeneratePermission(data[0].ID.toString());
        //         this.router.navigate(['/views/dashboard']);
        //     } else {
        //         Swal.fire("Invalid Credentials");
        //     }
        // });
    }

    setEntityConfigurable() {
        this.commonService.getEntityConfigurableDetails({}).subscribe((result: any) => {
            if (result.message === 'Success') {
                const entityConfigurable = result.data.Table[0];
                localStorage.setItem('EntityConfigurable', JSON.stringify(entityConfigurable))
            }
        }, err => {
            Swal.fire("Invalid Credentials");
        });
    }

    OnsubmitOverlay() {
        /* $('#overlay').fadeIn().delay(2000).fadeOut();*/

    }
    //userAuthentication(userName, password) {

    //    var data = {
    //        Username: userName,
    //        Password: password,
    //        grant_type: "password"
    //    };
    //    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
    //    return this.http.post(this.globals.APIURL + '/users/authenticate', data, { headers: reqHeader });
    //}

    GeneratePermission(userid: any) {
        let payload3 = {
            "isdata": "G",
            "ref_RoleId": "",
            "UserId": userid,
            "Created_by": 0
        }
        console.log("GeneratePayload", payload3);
        this.LService.GenerateUserPermissionObject(payload3).subscribe(res => {
            if (res.statuscode == 200 && res.message == "Success") {
                this.GeneratePermissionupdate(userid);
            }

        }, err => {
            Swal.fire(err.message);
        });
    }

    GeneratePermissionupdate(userid: any) {
        this.payloadupdatepermission = {
            "userId": userid
        }
        this.LService.getUserPermissionUpdateList(this.payloadupdatepermission).subscribe((res: any) => {

            if (res.message == "Success") {
                this.GeneratePermissionCombined(parseInt(userid));
            }
            // else {
            //     Swal.fire(res.message);
            // }
        }, err => {
            Swal.fire(err.message);
        });
    }

    GeneratePermissionCombined(userid: any) {

        let numberValue = Number(localStorage.getItem("UserId"));

        let payload2 = {
            "userId": userid
        }

        console.log("payloadcombined", payload2)
        this.LService.getUserPermissionCombinedList(payload2).subscribe((res: any) => {
        }, err => {
            Swal.fire(err.message);
        });
    }

}

