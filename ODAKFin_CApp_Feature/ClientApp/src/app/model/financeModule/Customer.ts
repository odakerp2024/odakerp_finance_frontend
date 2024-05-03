export class Customerlist {
    CustomerCode = '';
    CustomerName = '';
    Category = '';
    BranchCode = '';
    CityName = '';
    GSTCategory = '';
    GSTNumber = '';
    CustomerStatus = '';
    Status = '';
    IsActive = 1;

}

export class Customer {
    CustomerDivisionID: Number = 0;
    DivisionID: Number = 0;
    CustomerID: Number = 0;
}

export class Alerttype {
    Id = 0;
    AlertType: String = null;
}

export class DivisionTypes {
    Id = 0;
    DivisionName = '';
    //IsTrue: boolean = false;
}

export class DivisionLable {

    CustomerDivisionID: Number = 0;
    CustomerID: Number = 0;
    DivisionID: Number = 0;
    DivisionLable: String = "";
    isChecked: boolean = false

}

export class CustomerTabs {
    Table: BasicCustomerDetails[] = [];
    Table1: OfficeDetails[] = [];
    Table2: SalesPICList[] = [];
    Table3: KYCDocument[] = [];
    Table4: AccountLink[] = [];
    // Table5: CreditDetails[] = [];
    Table6: EmailId[] = [];
    Table7: Interface[] = [];
    Table8: Division[] = [];
    Table9: InputPage[] = [];

}

export class CustomerModel {
    Customer: CustomerTabs = new CustomerTabs()
}

export class SalesPICList {
    SalesId: Number = 0;
    CustomerBranchID: Number = 0;
    Source: String = '';
    SalesPIC: String = '';
    EffectiveDate: String = '';
    Remarks: string = '';
}

export class BasicCustomerDetails {
    CustomerID = 0;
    CustomerCode = '';
    CustomerName = '';
    CustomerStatus = 0;
    CountryId = 0;
    CategoryId = '';
    IsActive = 1;
    ShortName = '';
    URL = '';
    UpdatedBy = '';
    // InputPage = '';
}

export class OfficeDetails {
    CustomerBranchID: Number = 0;
    CustomerID = 0;
    BranchCode = '';
    City = 0;
    PrimaryContact = '';
    Pincode = '';
    PhoneNo = '';
    MobileNo = '';
    Address = '';
    IsActive = 1;
    Name = '';
    Designation = '';
    EmailId = '';
    OnBoard = '';
    KYCStatus = 0;
    TelephoneNo: string = ''
}

export class KYCDocument {
    CustomerDocumentsID = 0;
    CustomerBranchID = 0;
    DocumentName = '';
    FilePath = '';
    // UpdateOn = new Date();
    UniqueFilePath = '';
}

export class AccountLink {
    CustomerAccountID = 0;
    CustomerBranchID = 0;
    DocumentName = '';
    GSTCategory = 0;
    GSTNumber = "";
    LegalName = "";
    PANNo = "";
    TANNo = "";
    PlaceOfSupply1 = 0;
    PlaceOfSupply2 = 0;
    CurrencyId = 0;
    CompanyStatus = 0;
    MSMENo = "";
    ReceivableSubCategoryId = 0;
    LedgerMappingId = 0;
}

export class CreditDetails {
    CustomerCreditID = 0;
    CustomerBranchID = 0;
    Agreement = 0;
    CreditDays = 0;
    CreditLimit = 0;
    ApprovedBy = 0;
    EffectiveDate = ""
}

export class EmailId {
    CustomerEmailID = 0;
    CustomerBranchID = 0;
    AlertTypeId = 1;
    EmailId = "";
    CreatedOn = "";
    UpdateOn = "";
    UpdatedBy = "";
    Category = "";
    StartDate = "";
    EndDate = "";
}

export class Interface {
    CustomerInterfaceID = 0;
    CustomerBranchID = 0;
    NDPCode = "";
    DigitalCode = "";
    Others = ""
}

export class Division {
    CusDivId: Number = 0;
    CustomerId: Number = 0;
    DivisionId: Number = 0;
    CustomerBranchId: Number = 0;
}

export class InputPage {
    InputPage: string = '';
}