import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { CommonService } from 'src/app/services/common.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-financemaster',
  templateUrl: './financemaster.component.html',
  styleUrls: ['./financemaster.component.css']
})
export class FinanceMasterComponent implements OnInit {

  isShow: boolean = true;
  selectedTabName: string = 'Masters';
  title = 'Finance Master';
  isEmailids: boolean = false;
  isDocuments: boolean = false;
  isReadDocument: boolean = false;
  isDeleteDocument: boolean = false;

  isSummary: boolean = false;
  isBook: boolean = false;
  isStatement: boolean = false;
  isStatementCreate: boolean = false;
  isReconciliation: boolean = false;
  isUnreconciled: boolean = false;

  isRequest: boolean = false;
  isProgress: boolean = false;
  isPayments: boolean = false;
  Token: string;
  payloadupdatepermission: { userId: any; };

  constructor(
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private commonDataService: CommonService,
    private LService: LoginService,
    private globals: Globals,
  ) { }

  getPermissionListForCreate(value, route) {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.LService.GetUserPermissionObject(paylod).subscribe(data => {
      if (route == 'Email ids') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isEmailids = true;
            } else {
              this.isEmailids = false;
            }
          }
        } else {
          this.isEmailids = false;
        }
      }

      if (route == 'Documents') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isDocuments = true;
            } else {
              this.isDocuments = false;
            }

            if (data[0].read_Opt == 2) {
              this.isReadDocument = true;
            } else {
              this.isReadDocument = false;
            }

            if (data[0].delete_Opt == 2) {
              this.isDeleteDocument = true;
            } else {
              this.isDeleteDocument = false;
            }
          }
        } else {
          this.isDocuments = false;
          this.isReadDocument = false;
          this.isDeleteDocument = false;
        }

        this.router.navigate(['views/entity/entity-view', { isEmailids: this.isEmailids, isDocuments: this.isDocuments, isReadDocument: this.isReadDocument, isDeleteDocument: this.isDeleteDocument }]);

      }


    }, err => {
      console.log('errr----->', err.message);
    });
  }

  getPermissionListForBanking(value, route) {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.LService.GetUserPermissionObject(paylod).subscribe(data => {
      debugger

      if (route == 'Bank Summary') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Read_Opt == 2) {
              this.isSummary = true;
            } else {
              this.isSummary = false;
            }
          }
        } else {
          this.isSummary = false;
        }
      }

      if (route == 'Bank Book') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Read_Opt == 2) {
              this.isBook = true;
            } else {
              this.isBook = false;
            }
          }
        } else {
          this.isBook = false;
        }
      }

      if (route == 'Bank statement') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isStatementCreate = true;
            } else {
              this.isStatementCreate = false;
            }

            if (data[0].read_Opt == 2) {
              this.isStatement = true;
            } else {
              this.isStatement = false;
            }
          }
        } else {
          this.isStatement = false;
          this.isStatementCreate = false;
        }
      }

      if (route == 'Bank Reconciliation') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isReconciliation = true;
            } else {
              this.isReconciliation = false;
            }
          }
        } else {
          this.isReconciliation = false;
        }
      }

      if (route == 'Bank Unreconciled') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isUnreconciled = true;
            } else {
              this.isUnreconciled = false;
            }
          }
        } else {
          this.isUnreconciled = false;
        }
      }


      this.router.navigate(['views/transactions/banking/bank-view',
        {
          isSummary: this.isSummary, isBook: this.isBook, isStatementCreate: this.isStatementCreate,
          isStatement: this.isStatement, isReconciliation: this.isReconciliation, isUnreconciled: this.isUnreconciled
        }]);


    }, err => {
      console.log('errr----->', err.message);
    });
  }

  getPermissionListForPaymentBatch(value, route) {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.LService.GetUserPermissionObject(paylod).subscribe(data => {
      debugger

      if (route == 'Open Request') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isRequest = true;
            } else {
              this.isRequest = false;
            }
          }
        } else {
          this.isRequest = false;
        }
      }

      if (route == 'In Progress') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isProgress = true;
            } else {
              this.isProgress = false;
            }
          }
        } else {
          this.isProgress = false;
        }
      }

      if (route == 'Closed Payments') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Read_Opt == 2) {
              this.isPayments = true;
            } else {
              this.isPayments = false;
            }
          }
        } else {
          this.isPayments = false;
        }

        this.router.navigate(['views/transactions/payment-request/payment-batch',
          { isRequest: this.isRequest, isProgress: this.isProgress, isPayments: this.isPayments }]);

      }


    }, err => {
      console.log('errr----->', err.message);
    });
  }


  ngOnInit() {
    this.titleService.setTitle(this.title);
    if (localStorage.getItem('DashboardType')) {
      this.selectedTabName = localStorage.getItem('DashboardType');
    }

    this.route.params.subscribe(param => {
      if (!param.tabName) {
        return
      }
      if (param.tabName == 'myWorkspace') {
        this.selectedTabName = 'myWorkspace'
      } else if (param.tabName == 'transactions') {
        this.selectedTabName = 'Transactions'
      } else if (param.tabName == 'dashboard') {
        this.selectedTabName = 'Dashboards'
      } else if (param.tabName == 'reports') {
        this.selectedTabName = 'Reports'
      } else {
        this.selectedTabName = 'Masters'
      }
    })

    if (localStorage.getItem("TokenID") == null || localStorage.getItem("TokenID") == 'undefined') {

      this.route.queryParams.subscribe(params => {
        if(params['TokenID']){
          localStorage.setItem("TokenID", params['TokenID']);
        } else {
          Swal.fire('Please Contact Administrator');
        }
      });

      this.BindTokenValues();
      this.setEntityConfigurable();
    }
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

        if (this.Token != 'null') {
          this.GeneratePermission(localStorage.getItem("UserID"));
        }
        else {
          //window.location.href = "https://localhost:44323/views/sessionexpired?Tokenid=" + TokenID;
          window.location.href = this.globals.APIURLLA + "/views/sessionexpired?ajdysghjadsbkyfgHVUFKDYKUYGVSDCHBKYGuyfkjyhbvjdygiuagsidukuYGUKFYSDKUFyguydgfakhdfhg=" + TokenID;
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


  routePage(routePage: string) {

    if (routePage == 'Entity') {
      this.getPermissionListForCreate(537, 'Email ids');
      this.getPermissionListForCreate(538, 'Documents');

    }
    else if (routePage == 'transactions-banking') {
      this.getPermissionListForBanking(486, 'Bank Summary');
      this.getPermissionListForBanking(487, 'Bank Book');
      this.getPermissionListForBanking(488, 'Bank statement');
      this.getPermissionListForBanking(489, 'Bank Reconciliation');
      this.getPermissionListForBanking(490, 'Bank Unreconciled');
    }
    else if (routePage == 'payment-batch') {
      this.getPermissionListForPaymentBatch(491, 'Open Request');
      this.getPermissionListForPaymentBatch(492, 'In Progress');
      this.getPermissionListForPaymentBatch(493, 'Closed Payments');
    }
    else {
      this.getPermissionList(routePage);
    }

    // if (routePage == 'Entity') this.router.navigate(['views/entity/entity-view']);

    // else if (routePage == 'Division') this.router.navigate(['views/division/division-view']);
    // else if (routePage == 'office') this.router.navigate(['views/office/office-view']);
    // else if (routePage == 'cao-view') this.router.navigate(['/views/coa/cao-view']);
    // else if (routePage == 'cao-type') this.router.navigate(['/views/coa-type/cao-type-view']);
    // else if (routePage == 'Exchange Rate Pair') this.router.navigate(['/views/exchange-rate-info/exchange-ratePair-info']);
    // else if (routePage == 'auto-code') this.router.navigate(['/views/auto-generate/auto-view']);
    // else if (routePage == 'party') this.router.navigate(['/views/party-mapping/party-mapping-view']);
    // else if (routePage == 'ledger') this.router.navigate(['/views/ledger-mapping/Ledger-mapping-view']);
    // else if (routePage == 'templates') this.router.navigate(['/views/template/template-view']);
    // else if (routePage == 'credit') this.router.navigate(['/views/credit/credit-view']);
    // else if (routePage == 'aging') this.router.navigate(['/views/aging/aging-list']);
    // else if (routePage == 'region') this.router.navigate(['/views/region/region-view']);
    // else if (routePage === 'journal') this.router.navigate(['/views/transactions/journal']);
    // else if (routePage === 'receipt') this.router.navigate(['/views/transactions/receipt']);
    // else if (routePage === 'payment') this.router.navigate(['/views/transactions/payment']);
    // else if (routePage === "contra") this.router.navigate(['/views/contra/contra-view']);
    // else if (routePage === "transactions-banking") this.router.navigate(['/views/transactions/banking/bank-view']);
    // else if (routePage === "purchase") this.router.navigate(['/views/purchase/purchase-view']);
    // else if (routePage === "internal") this.router.navigate(['/views/internal-order/internal-view']);
    // else if (routePage === "voucher") this.router.navigate(['/views/voucher/voucher-reversals']);
    // else if (routePage === "InvoiceAR") this.router.navigate(['/views/transactions/invoices_AR_view']);
    // else if (routePage === "vendorNotes") this.router.navigate(['/views/vendor-notes/vendor-view']);
    // else if (routePage === "InvoiceAP") this.router.navigate(['/views/transactions/invoices_AP_view']);
    // else if (routePage === "Adjustment") this.router.navigate(['/views/Adjustment/Adjustment-Voucher']);
    // else if (routePage === "employee-mini-master") this.router.navigate(['/views/finance/master/mini-master']);
    // else if (routePage === "purchase-invoice") this.router.navigate(['/views/purchase-invoice/purchase-invoice-view']);
    // else if (routePage === 'transactionLocks') this.router.navigate(['/views/transactions/transaction-locks']);
    // else if (routePage === "Credit-Review") this.router.navigate(['/views/credit-review/credit-review-view']);
    // else if (routePage === 'payment-request') this.router.navigate(['/views/transactions/payment-request/payment-request-view']);
    // else if (routePage === 'payment-batch') this.router.navigate(['/views/transactions/payment-request/payment-batch']);
    // else if (routePage === 'credit-application') this.router.navigate(['/views/transactions/credit-application/credit-application-view']);
    // else if (routePage === 'Credit-Revise-Revoke') this.router.navigate(['/views/credit-Review/credit-revoke']);
    // else if (routePage === 'account-receivable') this.router.navigate(['/views/transactions/openingBalances/account-receivable']);
    // else if (routePage === 'account-payable') this.router.navigate(['/views/transactions/openingBalances/account-payable']);
    // else if (routePage === 'asset') this.router.navigate(['/views/transactions/openingBalances/asset']);
    // else if (routePage === 'expenses') this.router.navigate(['/views/transactions/openingBalances/expenses']);
    // else if (routePage === 'bank') this.router.navigate(['/views/transactions/openingBalances/bank']);
    // else if (routePage === 'liability') this.router.navigate(['/views/transactions/openingBalances/liability']);
    // else if (routePage === 'equity') this.router.navigate(['/views/transactions/openingBalances/equity']);
    // else if (routePage === 'income') this.router.navigate(['/views/transactions/openingBalances/income']);


  }

  currentModule(type: string) {
    localStorage.setItem('DashboardType', type);
  }

  getPermissionList(routePage: string) {
    // Check Permission for Division Search
    let SubfunctionID = 0;
    if (routePage == 'Division') {
      SubfunctionID = 539;
    } else if (routePage == 'office') {
      SubfunctionID = 542;
    } else if (routePage == 'party') {
      SubfunctionID = 565;
    } else if (routePage == 'ChargeCode') {
      SubfunctionID = 582;
    }
    else if (routePage == 'TaxType') {
      SubfunctionID = 584;
    }
    else if (routePage == 'TaxGroup') {
      SubfunctionID = 586;
    }
    else if (routePage == 'TDS') {
      SubfunctionID = 588;
    }
    else if (routePage == 'SAC') {
      SubfunctionID = 588;
    }
    else if (routePage == 'EmployeeMiniMaster') {
      SubfunctionID = 616;
    }
    else if (routePage == 'AccountReceivable') {
      SubfunctionID = 592;
    }
    else if (routePage == 'AccountPayable') {
      SubfunctionID = 594;
    }
    else if (routePage == 'Asset') {
      SubfunctionID = 612;
    }
    else if (routePage == 'Expenses') {
      SubfunctionID = 598;
    }
    else if (routePage == 'Bank') {
      SubfunctionID = 600;
    }
    else if (routePage == 'Liability') {
      SubfunctionID = 602;
    }
    else if (routePage == 'Equity') {
      SubfunctionID = 604;
    }
    else if (routePage == 'Income') {
      SubfunctionID = 606;
    }
    else if (routePage == 'FinancialYear') {
      SubfunctionID = 618;
    }
    else if (routePage == 'CreditApproval') {
      SubfunctionID = 620;
    }
    else if (routePage == 'Aging') {
      SubfunctionID = 625;
    }
    else if (routePage == 'Region') {
      SubfunctionID = 627;
    }
    else if (routePage == 'NumberRange') {
      SubfunctionID = 629;
    }
    else if (routePage == 'Ledger') {
      SubfunctionID = 579;
    }
    else if (routePage == 'COANumberRange') {
      SubfunctionID = 574;
    }
    else if (routePage == 'Customers') {
      SubfunctionID = 547;
    }
    else if (routePage == 'Vendors') {
      SubfunctionID = 556;
    }
    else if (routePage == 'Templates') {
      SubfunctionID = 573;
    }
    else if (routePage == 'Exchange Rate Pair') {
      SubfunctionID = 608;
    }
    else if (routePage == 'Exchange Rate') {
      SubfunctionID = 610;
    }
    else if (routePage == 'COAType') {
      SubfunctionID = 575;
    }
    else if (routePage == 'COA Master') {
      SubfunctionID = 577;
    }
    else if (routePage == 'Credit-Review') {
      SubfunctionID = 494;
    }
    else if (routePage == 'Credit-Revise-Revoke') {
      SubfunctionID = 496;
    }
    else if (routePage == 'receipt') {
      SubfunctionID = 498;
    }
    else if (routePage == 'payment') {
      SubfunctionID = 500;
    }
    else if (routePage == 'journal') {
      SubfunctionID = 502;
    }
    else if (routePage == 'contra') {
      SubfunctionID = 504;
    }
    else if (routePage == 'Adjustment') {
      SubfunctionID = 506;
    }
    else if (routePage == 'voucher') {
      SubfunctionID = 508;
    }
    else if (routePage == 'purchase-invoice') {
      SubfunctionID = 510;
    }
    else if (routePage == 'vendorNotes') {
      SubfunctionID = 512;
    }
    else if (routePage == 'InvoiceAR') {
      SubfunctionID = 518;
    }
    else if (routePage == 'InvoiceAP') {
      SubfunctionID = 520;
    }
    else if (routePage == 'credit-application') {
      SubfunctionID = 522;
    }
    else if (routePage == 'payment-request') {
      SubfunctionID = 524;
    }
    else if (routePage == 'transactionLocks') {
      SubfunctionID = 526;
    }
    else if (routePage == 'purchase') {
      SubfunctionID = 531;
    }
    else if (routePage == 'internal') {
      SubfunctionID = 533;
    }
    else if (routePage == 'provision') {
      // SubfunctionID = 533;
      this.router.navigate(['/views/provision/provision-view']);
    }

    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: SubfunctionID
    }
    if (SubfunctionID != 0) {
      this.LService.GetUserPermissionObject(paylod).subscribe(data => {
        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].SubFunctionName.trim() == 'Search') {

              if (routePage == 'Division') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['views/division/division-view']);
                }
              } else if (routePage == 'office') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['views/office/office-view']);
                }
              } else if (routePage == 'party') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/party-mapping/party-mapping-view']);
                }
              }
              else if (routePage == 'ChargeCode') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/chargecode/chargecodeview']);
                }
              }
              else if (routePage == 'TaxType') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/taxlist/taxlistView']);
                }
              }
              else if (routePage == 'TaxGroup') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/taxgroup/taxgroupview']);
                }
              }
              else if (routePage == 'TDS') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/tds/tdsview']);
                }
              }
              else if (routePage == 'SAC') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/SAC/SACview']);
                }
              }
              else if (routePage == 'EmployeeMiniMaster') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/mini-master']);
                }
              }
              else if (routePage == 'AccountReceivable') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/account-receivable']);
                }
              }
              else if (routePage == 'AccountPayable') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/account-payable']);
                }
              }
              else if (routePage == 'Asset') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/asset']);
                }
              }
              else if (routePage == 'Expenses') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/expenses']);
                }
              }
              else if (routePage == 'Bank') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/bank']);
                }
              }
              else if (routePage == 'Liability') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/liability']);
                }
              }
              else if (routePage == 'Equity') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/equity']);
                }
              }
              else if (routePage == 'Income') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/income']);
                }
              }
              else if (routePage == 'FinancialYear') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/financialyearview']);
                }
              }
              else if (routePage == 'CreditApproval') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/credit/credit-view']);
                }
              }
              else if (routePage == 'Aging') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/aging/aging-list']);
                }
              }
              else if (routePage == 'Region') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/region/region-view']);
                }
              }
              else if (routePage == 'Customers') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/Customer/Customerview']);
                }
              }
              else if (routePage == 'Vendors') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/Vendor/Vendorview']);
                }
              }
              else if (routePage == 'Exchange Rate Pair') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/exchange-rate-info/exchange-ratePair-info']);
                }
              }
              else if (routePage == 'Exchange Rate') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/exchangerate/exchangerateview']);
                }
              }
              else if (routePage == 'COAType') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/coa-type/cao-type-view']);
                }
              }
              else if (routePage == 'COA Master') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/chartaccounts/chartaccountsView']);
                }
              }
              else if (routePage == 'Credit-Review') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/credit-review/credit-review-view']);
                }
              }
              else if (routePage == 'Credit-Revise-Revoke') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/credit-Review/credit-revoke']);
                }
              }
              else if (routePage == 'receipt') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/receipt']);
                }
              }
              else if (routePage == 'payment') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/payment']);
                }
              }
              else if (routePage == 'journal') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/journal/journal-view']);
                }
              }
              else if (routePage == 'contra') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/contra/contra-view']);
                }
              }
              else if (routePage == 'Adjustment') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/Adjustment/Adjustment-Voucher']);
                }
              }
              else if (routePage == 'voucher') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/voucher/voucher-reversals']);
                }
              }
              else if (routePage == 'purchase-invoice') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/purchase-invoice/purchase-invoice-view']);
                }
              }
              else if (routePage == 'vendorNotes') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/vendor-notes/vendor-view']);
                }
              }
              else if (routePage == 'InvoiceAR') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/vendor-notes/vendor-view']);
                }
              }
              else if (routePage == 'InvoiceAP') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/invoices_AP_view/invoices_AP_view']);
                }
              }
              else if (routePage == 'credit-application') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/credit-application/credit-application-view']);
                }
              }
              else if (routePage == 'payment-request') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/payment-request/payment-request-view']);
                }
              }
              else if (routePage == 'transactionLocks') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/transaction-locks/transaction-locks-view']);
                }
              }
              else if (routePage == 'purchase') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/purchase/purchase-view']);
                }
              }
              else if (routePage == 'internal') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/internal-order/internal-view']);
                }
              }


              else {
                Swal.fire('Please Contact Administrator');
              }
            }
            else {
              if (routePage == 'NumberRange') {
                if (data[0].Create_Opt != 2) {
                  if (data[0].Update_Opt != 2) {
                    if (data[0].Read_Opt != 2) {
                      Swal.fire('Please Contact Administrator');
                    }
                    else {
                      this.router.navigate(['/views/auto-generate/auto-view']);
                    }
                  }
                  else {
                    this.router.navigate(['/views/auto-generate/auto-view']);
                  }
                }
                else {
                  this.router.navigate(['/views/auto-generate/auto-view']);
                }
              } else if (routePage == 'Ledger') {
                if (data[0].Update_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/ledger-mapping/Ledger-mapping-view']);
                }
              } else if (routePage == 'COANumberRange') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/coa/cao-view']);
                }
              }
              else if (routePage == 'Templates') {
                if (data[0].Read_Opt != 2) {
                  if (data[0].Create_Opt != 2) {
                    if (data[0].Update_Opt != 2) {
                      Swal.fire('Please Contact Administrator');
                    }
                    else {
                      this.router.navigate(['/views/template/template-view']);
                    }
                  }
                  else {
                    this.router.navigate(['/views/template/template-view']);
                  }
                }
                else {
                  this.router.navigate(['/views/template/template-view']);
                }
              }

              else {
                Swal.fire('Please Contact Administrator');
              }
            }
          }
        }
        else {
          Swal.fire('Please Contact Administrator');
        }
      }, err => {
        console.log('errr----->', err.message);
      });
    }
  }

  navigate() {
    this.router.navigate(['/views/finance/reports/levelone']);
  }



}
