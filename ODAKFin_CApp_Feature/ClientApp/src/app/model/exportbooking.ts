export class ExportBooking {
    ID: 0;
    BookingNo: '';
    BookingParty: '';
    BookingStatus: '';
    BookingDate: '';
    BookingCommission: '';
    EnquiryNo: '';
    Source: '';
    SalesPerson: '';
    Origin: '';
    DischargePort: '';
    LoadPort: '';
    Destination: '';
    Route: '';
    DeliveryTerms: '';
    Commodity: '';
    CargoWeight: '';
    HsCode: '';
    HazarOpt: '';
    ReeferOpt: '';
    OOGOpt: '';
    PaymentTerms: '';
    VesselName: '';
    VoyageNo: '';
    POLTerminal: '';
    TsVesselName: '';
    TsVoyageNo: '';
    Principal: '';
    LinerContractNo: '';
    CusContractNo: '';
    PODAgent: '';
    FPODAgent: '';
    TSPortAgent1: '';
    TSPortAgent2: '';
    SlotOperator: '';
    Ownership: '';
    Fixed: '';   
    FreeDayOrigin:0;
    FreeDaysOrignValue:'';
    FreeDayDestination:0;
    FreeDaysDesValue: '';
    DamageScheme: 0;
    DamageSchemeValue: '';
    SecurityDeposit: 0;
    SecurityDepositValue: '';
    BolReq: 0;
    BolReqValue: '';
    VesselID: 0;
    VoyageID: 0;
    OfficeCode: '';
    Agent: '';

}
export class ExportBkgContainer {
    ID: 0;
    CntrType: '';
    Nos: '';
}
export class ExportBkgHaz {
    ID: 0;
    CommodityName: '';
    HazardousClass: '';
    MCONumber: '';
}
export class ExportBkgReefer {
    ID: 0;
    CommodityName: '';
    Temperature: '';
    Ventilation: '';
    Humidity: '';
}
export class ExportBkgOutGauge {
    ID: 0;
    CommodityName: '';
    CargoLenght: '';
    CargoWidth: '';
    CargoHeight: '';
}
export class ExportBkgOceanFrt {
    ID: 0;
    CommodityName: '';
    CntrType: '';
    Currency: '';
    FrtChargePerAmt: '';
    ManifestAmt: '';
    CommissionPerAmt: '';
    Nos: '';
    FrtChargePerAmtTotal: '';
    ManifestAmtTotal: '';
}

export class ExportBkgShipment {
    ID: 0;
    CntrType: '';
    Currency: '';
    Amount2: '';
    Remarks: '';
    PolCharges: '';
}
