export class BusinessTypes {
    ID = 0;
    BusinessType = '';
    IsTrue = 0;
}
export class Party {
    ID = 0;
    BID = 0;
    CustomerName = '';
    CountryID = 0;
    Itemsv1 = '';
    BusinessType = '';
    Country = ''
    IsNVOCC = 0;
    IsFF = 0;
    cusID = 0;
    DivisionDetails = '';
}
export class DynamicGridParty {
    CID = 0;
    LocBranch = '';
    CityID = 0;
    City = '';
    StateID = 0;
    State = '';
    TelNo = '';
    PinCode = '';
    EmailID = '';
    PIC = '';
    Address = '';
    StatusID = 0;
    StatusResult = '';
    //PanNo = '';
    //TanNo = '';

}

export class DynamicGridVendorAcc {
    ID = 0;
    BranchID = 0;
    Branch = '';
    GSTListID = 0;
    GSTINTax: '';
    GSTNo = '';
    Legalname = '';
    PAN = '';
    TAN = '';
    POSID = 0;
    POS = '';
    CurrID = 0;
    CurrencyCode = '';
    TDS = 0;
    TDSType = '';
}
export class DynamicGridAcc {
    ID = 0;
    BranchID = 0;
    Branch = '';
    GSTListID = 0;
    GSTINTax: '';
    GSTNo = '';
    Legalname = '';
    PAN = '';
    TAN = '';
    POSID = 0;
    POS = '';
    CurrID = 0;
    CurrencyCode = '';
}
export class DynamicGridCr {
    ID = 0;
    BranchID = 0;
    Branch = '';
    CreditDays = '';
    CreditLimit: '';
    ApprovedBy = 0;
    ApprovedName = '';
    EffectiveDate = '';
    StatusCrID = 0;
    StatusV = ''
}

export class DynamicGridAlert {
    ID = 0;
    BranchID = 0;
    Branch = '';
    AlertTypeID = 0;
    AlertType = '';
    EmailAlertID = '';
}
export class DynamicGridAttach {

    AttachName = '';
    AttachID = 0;
    AttachFile = '';
}

export class PartyAttachType {

    ID = 0;
    GeneralName = '';

}
export class BranchList {

    CID = 0;
    Branch = '';

}

export class GSTList {

    ID = 0;
    GSTINTax = '';

}
export class Currency {

    ID = 0;
    CurrencyCode = '';

}


