export class Region {
    ID = 0;
    RegionName = '';
    Status = '';
    StatusV = '';
}
export class Office {
    ID = 0;
    OfficeLoc = '';
    CompanyName = '';
    CountryID = 0;
    CityID = 0;
    StateID = 0;
    Pincode = '';
    TaxGSTNo = '';
    TelNo = '';
    FaxNo = '';
    Address = '';
    StatusID = 0;
}

export class SalesOffice {
    ID = 0;
    SalesOffLoc = '';
    OfficeLocID = 0;
    OfficeID = 0;
    Status = 0;
    OfficeLoc = '';
    GeoLocID = 0;
}
export class State {
    ID = 0;
    StateName = '';

}

export class Org {
    ID = 0;
    OrgName = '';
    CountryID = 0;
    CityID = 0;
    StateID = 0;
    Pincode = '';
    TaxGSTNo = '';
    IsLiner = 0;
    IsFF = 0;
    Address = '';
    StatusID = 0;
    IsTransport = 0;
    Itemsv: '';
    ItemsValue: '';
    RegionID = 0
    OfficeLocID = 0;
    DivisionDetails = '';
}
export class DynamicGrid {
    ID = 0;
    RegionID = 0;
    SalesOffLocID = 0;
    OfficeLoc = '';
}
export class SalesOfficeDD {
    ID = 0;
    SalesOffLoc = '';
}
export class DivisionTypes {
    ID = 0;
    Divison = '';
    IsTrue = 0;
}