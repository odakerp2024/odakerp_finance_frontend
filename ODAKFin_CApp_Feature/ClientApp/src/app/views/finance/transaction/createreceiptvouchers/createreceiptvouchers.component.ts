import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
    rvmCustomerList, rvmCustomerOfficeList, rvmCurrencyList, rvmModeOfPaymentList, rvmBankList,
    rvmExchangeRate
} from '../../../../model/receiptvoucher';
import { ReceiptvoucherService } from '../../../../services/receiptvoucher.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-createreceiptvouchers',
    templateUrl: './createreceiptvouchers.component.html',
    styleUrls: ['./createreceiptvouchers.component.css']
})

export class CreatereceiptvouchersComponent implements OnInit {

    title = 'Create Receipt Vouchers';
    createReceiptVoucherForm: FormGroup;

    customerList: rvmCustomerList[] = [];
    customerOfficeList: rvmCustomerOfficeList[] = [];
    currencyList: rvmCurrencyList[] = [];
    modeOfPaymentList: rvmModeOfPaymentList[] = [];
    bankList: rvmBankList[] = [];
    exchangeRateList: rvmExchangeRate[] = [];
    paramUserId: 1;
    paramReceiptHeaderId: null;

    constructor(private router: Router, private route: ActivatedRoute,
        private receiptvoucherService: ReceiptvoucherService, private fb: FormBuilder,
        private titleService: Title
    ) {
        this.route.queryParams.subscribe(params => {
            console.log('this.route.queryParams.subscribe', params);
            this.paramUserId = params.User_Id;
            this.paramReceiptHeaderId = params.ReceiptHeader_Id;
        });
    }

    ngOnInit() {
        this.titleService.setTitle(this.title);
        this.clearForm();
    }

    clearForm() {
        this.createForm();
        this.getReceiptVoucherDetails();
    }

    createForm() {
        this.createReceiptVoucherForm = this.fb.group({
            ReceiptNumber: '',
            ReceiptType: '',
            ReceiptDate: '',
            OrganizationOfficeId: 0,
            OrganizationOfficeCode: '',
            CustomerId: null,
            CustomerName: '',
            CustomerOfficeCode: '',
            IsThirdParty: false,
            ThirdPartyId: null,
            TANNumber: '',
            IsTDS: false,
            PaymentModeId: null,
            ModeOfPayment: '',
            DepositTo: null,
            CurrencyId: null,
            FinancialYear: '',
            AmountReceived: 0.00,
            BankName: '',
            ReferenceNumber: '',
            IsBankCharges: false,
            BankCharges: 0.00,
            DivisionId: 0,
            TaxGroupId: 0,
            TDSRatesId: 0,
            TDSReceived: 0.00,
            ExchangeRateId: null,
            ExchangeRate: '',
            LoanAmount: 0.00,
            Remarks: '',
            IsReversed: false,
            UserId: localStorage.getItem("UserID"),
            ReceiptInvoiceDetailsType: '',
            ReceiptHeaderId: this.paramReceiptHeaderId,
            CustomerBranchId: null,
            SearchInvoices: ''
        });
    }

    getReceiptVoucherDetails() {
        this.receiptvoucherService.getReceiptVoucherDetails(this.createReceiptVoucherForm.value).subscribe(data => {

            if (data["data"].Table.length == 0) { Swal.fire('Data not found!', 'error') }
            else {
                console.log("TableData", data["data"]);
                this.customerList = data["data"].Table;
                this.customerOfficeList = data["data"].Table1;
                this.modeOfPaymentList = data["data"].Table2;
                this.currencyList = data["data"].Table3;
                this.bankList = data["data"].Table4;
                this.exchangeRateList = data["data"].Table5;
                this.createReceiptVoucherForm.patchValue(data["data"].Table6[0]);
            }
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message, 'error')
            });
    }

    

    onSubmit() {

        var validation = "";
        console.log(this.createReceiptVoucherForm);
        if (this.createReceiptVoucherForm.value.ThirdPartyId == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select ThirdParty </span></br>"
        }
        if (this.createReceiptVoucherForm.value.CustomerId == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Customer </span></br>"
        }

        if (this.createReceiptVoucherForm.value.CurrencyId == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Currency </span></br>"
        }
      
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        else {
            this.receiptvoucherService.saveReceiptvoucher(this.createReceiptVoucherForm.value).subscribe(data => {

                //this.createReceiptVoucherForm.value.ID = data[0].ID;
                Swal.fire(data[0].AlertMessage);
            },
                (error: HttpErrorResponse) => {
                    Swal.fire(error.message)
                });
        }

    }

    onBack() {
        this.router.navigate(['/views/finance/transaction/receiptvoucherslist']);
    }

    onCancel() {
        alert();
    }

}
