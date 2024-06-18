import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Globals } from 'src/app/globals';
import { CommonService } from 'src/app/services/common.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title = 'Dashboard';
  TokenID: string;
  Token: string;
  payloadupdatepermission: any = "";
  userId: any = "";

  constructor(
    private titleService: Title,
    private globals: Globals,
    private commonDataService: CommonService,
    private LService: LoginService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    debugger
    this.titleService.setTitle(this.title);
    // var qrStr = window.location.search;
    // var spQrStr = qrStr.substring(1);
    // var arrQrStr = new Array();
    // var arr = spQrStr.split('&');

    // for (var i = 0; i < arr.length; i++) {

    //   var queryvalue = arr[i].split('=');
    //   if (i == 0) {
    //     var token = queryvalue[1];

    //     this.Token = token;
    //   }
    //   if (i == 1) {
    //     var tokenid = queryvalue[1];
    //     this.TokenID = tokenid;
    //     localStorage.setItem("TokenID", tokenid);
    //   }
    //   this.BindTokenValues();
    // }

    this.route.queryParams.subscribe(params => {
      localStorage.setItem("TokenID", params['TokenID']);
    });

    // localStorage.setItem("TokenID", '6');

    this.BindTokenValues();
    this.setEntityConfigurable();

  }

  setEntityConfigurable() {
    this.commonDataService.getEntityConfigurableDetails({}).subscribe((result: any) => {
        if (result.message === 'Success') {
            const entityConfigurable = result.data.Table[0];
            localStorage.setItem('EntityConfigurable', JSON.stringify(entityConfigurable))
        }
    }, err => {
        Swal.fire("Invalid Credentials");
    });
}

  BindTokenValues() {
    
    if (localStorage.getItem("TokenID") != null) {
      const payload = {
        ID: localStorage.getItem("TokenID")
      }
      this.commonDataService.SendToken(payload).subscribe(data => {
        var TokenID = data[0].ID.toString();
        var Token = data[0].access_token;
        // this.UserID = data[0].UserID;
        localStorage.setItem("UserID", data[0].UserID.toString());

        alert(localStorage.getItem("UserID"));

        if (this.Token != 'null') {
          this.GeneratePermission(localStorage.getItem("UserID"));
        }
        else {
          //window.location.href = "https://localhost:44323/views/sessionexpired?Tokenid=" + TokenID;
          window.location.href = this.globals.LANDINGURL + "/views/sessionexpired?ajdysghjadsbkyfgHVUFKDYKUYGVSDCHBKYGuyfkjyhbvjdygiuagsidukuYGUKFYSDKUFyguydgfakhdfhg=" + TokenID;
          localStorage.removeItem('TokenID');
          localStorage.removeItem('UserID');
        }
      });
    }
    else {
      window.location.href = 'https://navioindia.freighteiz.com/login';
    }
  }

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
