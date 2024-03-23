import { BankDetails } from './../Bankmodel';
export class Vendorlist {
    VendorCode = '';
    VendorName = '';
    Category = '';
    BranchCode = '';
    CityName = '';
    GSTCategory = '';
    GSTNumber = '';
    VendorStatus = '';
    Status = '';
    IsActive = 1;

}

export class Vendor {
    VendorDivisionID: Number = 0;
    DivisionID: Number = 0;
    VendorID: Number = 0;
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

    VendorDivisionID: Number = 0;
    VendorID: Number = 0;
    DivisionID: Number = 0;
    DivisionLable: String = "";
    isChecked: boolean = false

}

// Table: BasicVendorDetails[] = [];
// Table1: OfficeDetails[] = [];
// // Table2: KYCDocument[] = [];
// Table2: BankDetailsType[] = [];
// Table3: AccountLink[] = [];
// // Table4: TDSLink[] = [];
// Table4: AccountLink[] = [];
// Table5: EmailId[] = [];
// Table6: Division[] = [];
// Table7: Interface[] = [];
// Table8: any[] = [];
// Table9: InputPageType[] = [{InputPage: ''}];

export class VendorTabs {
    Table: BasicVendorDetails[] = [];
    Table1: OfficeDetails[] = [];
    Table2: BankDetailsType[] = [];
    Table3: any[] = [];
    Table4: AccountLink[] = [];
    Table5: TDSLink[] = [];
    Table6: CreditDetails[] = [];
    Table7: EmailId[] = [];
    Table8: Interface[] = [];
    Table9: Division[] = [];
    Table10: InputPageType[] = [{InputPage: ''}];

}

export class VendorModel {
    Vendor: VendorTabs = new VendorTabs()
}

//Table
export class BasicVendorDetails {

  VendorID = 0;
  VendorCode = '';
  VendorName = '';
  VendorStatus: Number = 0;
  CountryId = '';
  CategoryId = '';
  IsActive: any = '';
  ShortName = '';
  URL = '';

  // old keys need to remove later
    // VendorID = 0;
    // VendorCode = '';
    // VendorName = '';
    // CountryId = '';
    // CategoryId = '';
    // IsActive = '';
    // TDSApplicability = 0;
    // NonTDSReason = 0;
    // TDSSection = 0;
    // TDSLDCRate = 0;
    // VendorStatus: Number = 0;
    // InputPage = '';
}

//Table1
export class OfficeDetails {

  //  need to remove the commented code later
  // "VendorBranchID":0,
  // "VendorID":0,
  // "BranchCode":"VOB10001",
  // "City":1,
  // "PrimaryContact":"Test",
  // "Pincode":"123456",
  // "PhoneNo":"654987",
  // "MobileNo":"9876543210",
  // "Address":"tested",
  // "OnBoard":1,
  // "KYCStatus":1,
  // "IsActive":1,
  // "Name":"VOTest",
  // "Designation":"Tested",
  // "emailid":"votest@yopmail.com"
    VendorBranchID: Number = 0;
    VendorID = 0;
    BranchCode = '';
    City = '';
    PrimaryContact = '';
    Pincode = '';
    PhoneNo = '';
    MobileNo = '';
    Address = '';
    OnBoard = 0;
    KYCStatus = 0;
    IsActive = '';
    Name = '';
    Designation = '';
    emailid = '';
    TelephoneNo = '';
}

// Table2
export class KYCDocument {
    VendorDocumentsID = 0;
    VendorBranchID = 0;
    DocumentName = '';
    FilePath = '';
    UpdateOn = '';
}

// Table3
export class AccountLink {
  // start
    VendorAccountID = 0;
    VendorBranchID = 0;
    GSTCategory = 0;
    GSTNumber = "";
    LegalName = "";
    PANNo = "";
    SourceOfSupply = 0;
    CurrencyId = 0;
    CompanyStatus = 0;
    SourceOfSupply1 = 0;
    SourceOfSupply2 = 0;
    TANNo = "";
    MSMONo = 0 ;
    PayableSubCategoryId = 0;
    LedgerMappingId = 0;
    // end

    // DocumentName = "";
    // TANNo = "";
    // PlaceOfSupply1 = 0;
    // PlaceOfSupply2 = 0;
    // //CurrencyId = 0;
    // //CompanyStatus = 0;
    // MSMENo = "";
}

//Table4
export class CreditDetails {
    VendorCreditID = 0;
    VendorBranchId = 0;
    Agreement = "";
    CreditDays = 0;
    CreditLimit = 0;
    ApprovedBy = "";
    Effectivedate = "";
    Currency = 0;
    Date = "";

}

//Table4
export class TDSLink {
    VendorTDSID = 0;
    VendorBranchID = 0;
    Date = '';
    FinancialYearID = 0;
    DITNumber = '';
    Reason = '';
    CertificateName = '';
    CertificatePath = '';
    Rate = '';
    TDSSectionId = '';
    StartDate = '';
    EndDate = '';
    TDSApplicability = '';
}

//Table6
export class EmailId {
    VendorEmailID = 0;
    VendorBranchID = 0;
    AlertTypeId = 0;
    emailid = "";
    CreatedOn = null;
    UpdatedOn = null;
    UpdatedBy = "";
    Category = "";
    StartDate = "";
    EndDate = "";
}

//Table6
export class Interface {
    VendorInterfaceID = 0;
    VendorBranchID = 0;
    NDPCode = "";
    DigitalCode = "";
    Others = ""
}

export class Division {
    VendorDivisionID: Number = 0;
    VendorID = 0;
    DivisionID: Number = 0;
}

export class InputPageType {
  InputPage = '';
}


export class BankDetailsType {
  VendorBankId = 0;
  VendorId = 0;
  vendorBranchId = 0;
  BankAccountCode = '';
  ShortName = '';
  AccountNumberId = 0;
  CurrencyId = 0;
  IFSCCode = '';
  CountryId = 0;
  SwiftCode = '';
  IsActive = '';
  BankName = ''
}


