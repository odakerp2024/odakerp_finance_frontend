import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReceiptvoucherService } from 'src/app/services/receiptvoucher.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Receiptvoucher, rvmModeOfPaymentList, rvmBankList, rvmFinancialYearList } from 'src/app/model/receiptvoucher';
import { GridSort, Image_List } from 'src/app/model/common';
import { PaginationService } from 'src/app/pagination.service';

@Component({
    selector: 'app-receiptvoucherslist',
    templateUrl: './receiptvoucherslist.component.html',
    styleUrls: ['./receiptvoucherslist.component.css']
})
export class ReceiptvoucherslistComponent implements OnInit {

    title = 'Receipt Vouchers List';
    receiptVoucherFrom: FormGroup;
    Is_DataFound: Boolean = true;
    imagenotfound: any = new Image_List().Not_Found_for_List;

    receiptvoucherList: Receiptvoucher[] = [];
    ddlModeOfPaymentList: rvmModeOfPaymentList[] = [];
    ddlBankList: rvmBankList[] = [];
    ddlFinancialYearList: rvmFinancialYearList[] = [];
    pager: any = {};
    pagedItems: any[];
    pagesort: any = new GridSort().sort;

    constructor(private titleService: Title, private fb: FormBuilder,
        private receiptvoucherService: ReceiptvoucherService,
        public ps: PaginationService
    ) { }

    ngOnInit(): void {
        this.titleService.setTitle(this.title);
        this.clearSearch();
    }

    onSubmit() {
        this.getReceiptVoucherList();
    }

    clearSearch() {
        this.createForm();
        this.getReceiptVoucherList();
    }

    createForm() {
        this.receiptVoucherFrom = this.fb.group({
            Id: 1,
            ReceiptNumber: null,
            CustomerName: null,
            ModeOfPaymentId: null,
            BankNameId: null,
            Amount: null,
            FromDate: null,
            ToDate: null,
            FinancialYearId: null
        });
    }

    getReceiptVoucherList() {
        this.receiptvoucherService.getReceiptVoucherList(this.receiptVoucherFrom.value).subscribe(data => {

            if (data["data"].Table.length == 0) { this.Is_DataFound = false; }
            else {
                console.log("TableData", data["data"]);
                this.Is_DataFound = true;
                this.receiptvoucherList = data['data'].Table;
                this.ddlModeOfPaymentList = data['data'].Table1;
                this.ddlBankList = data['data'].Table2;
                this.ddlFinancialYearList = data['data'].Table3;
                this.setPage(1);
            }
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message, 'error')
                this.Is_DataFound = false;
            });
    }

    setPage(page: number) {
        this.pager = this.ps.getPager(this.receiptvoucherList.length, page);
        this.pagedItems = this.receiptvoucherList.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    sort(property) {
        this.pagesort(property, this.pagedItems);
    }
}




