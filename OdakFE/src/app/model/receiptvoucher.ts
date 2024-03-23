export class Receiptvoucher {
    ReceiptHeaderId: 0;
    ReceiptNumber: '';
    ReceiptDate: '';
    CustomerName: '';
    ModeOfPayment: '';
    FinancialYear: '';
    BankName: '';
    LoanAmount: 0.00;
    UserID: 0
}

export class rvmModeOfPaymentList {
    ID: 0;
    RefCode: '';
    GeneralName: ''
}

export class rvmBankList {
    BankID: 0;
    BankName: '';
    CountryID: 0;
    CurrencyID: 0;
    AccountNo: '';
    IFSCCode: '';
    BranchName: ''
    BranchAddress: ''
}

export class rvmFinancialYearList {
    FinancialYearId: 0
    FinancialYearName: ''
    FromDate: ''
    ToDate: ''
    AssessmentYear: ''
    IsActive: 0
    CountryID: 0
    CountryCode: ''
    CountryName: ''
    Status: ''
}

export class rvmCustomerList {
    CustomerId: 0;
    CustomerBranchId: 0;
    CustomerCode: '';
    CustomerName: '';
    Category: '';
    BranchCode: '';
    City: '';
    GSTCategory: '';
    GSTNumber: '';
    CustomerStatus: '';
    Status: ''
}

export class rvmCustomerOfficeList {
    CustomerBranchID: 0;
    CustomerID: 0;
    BranchCode: '';
    City: ''
}

export class rvmCurrencyList {
    ID: 0;
    CurrencyCode: '';
    CurrencyName: '';
    Status: false;
    CountryID: 0
}

export class rvmExchangeRate {
    ExchangeRateId: 0;
    CurrencyPairID: 0;
    CurrencyPair: '';
    Rate: 0.00;
    EffectiveDate: ''
    IsActive: false
    Status: ''
}

export class rvmReceiptVoucherDetails {
    ReceiptHeaderId: 0;
    OfficeCode: '';
    ReceiptType: '';
    ReceiptNumber: '';
    ReceiptDate: '';
    IsThirdParty: false;
    ThirdPartyId: 0;
    CustomerId: 0;
    OrganizationOfficeId: 0;
    IsTDS: false;
    PaymentModeId: 0;
    DepositTo: 0;
    TANNumber: '';
    AmountReceived: 0.00;
    ReferenceNumber: '';
    IsBankCharges: false;
    ExchangeRateId: 0;
    IsReversed: false;
    Remarks: ''
}

export class rvmReceiptVoucherInvoiceDetails {
    ReceiptHeaderId: 0;
    ReceiptInvoiceDetailId: 0;
    ReceiptNumber: '';
    InvoiceId: 0;
    InvoiceNo: '';
    InvoiceDate: '';
    CurrencyCode: '';
    InvAmount: 0.00;
    InvTax: 0.00;
    InvTotal: 0.00;
}

