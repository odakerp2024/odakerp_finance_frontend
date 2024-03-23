import { ClassStmt } from "@angular/compiler";


export class MYPortTariff {
    TID = 0;
    ID = 0;
    Name = "";
    PortTariffTypeID = 0;
    PrincibleID = 0;
    EffectiveDate = "";
    PortID = 0;
    TerminalID = 0;
    EquipmentTypeID = 0;
    ChargeID = 0;
    StartMoveID = 0;
    EndMove = 0;
    StatusID = 0;
    Remarks = "";
    Itemsv = "";
    ItemsSlab = "";
    AlertMegId = 0;
    AlertMessage = "";
    ShipmentType = "";
    ShipmentTypeID = 0;
    TariffTypeID = 0;
    TariffType = '';
    ChargeCode = '';
    ChargeCodeID = 0;
    Commodity = '';
    CommodityID = 0;
    BasisID = 0;
    Basis = '';
    CurrencyID = 0;
    Currency = '';
    ServiceType = '';
    ServiceTypeID = 0;
    Amount = 0;
    ISSlab = 0;
    ImpChargeID = 0;
    ExpChargeID = 0;

}

export class MyDynamicGrid {
    TID = 0;
    ShipmentType = '';
    ShipmentTypeID = 0;
    TariffType = '';
    TariffTypeID = 0;
    ChargeCode = '';
    ChargeCodeID = 0;
    Commodity = '';
    CommodityID = 0;
    BasisID = 0;
    Basis = '';
    CurrencyID = 0;
    Currency = '';
    ServiceType = '';
    ServiceTypeID = 0;
    Amount = 0;
    ISSlab = 0;

}
export class MyDynamicGridSlab {

    SLID = 0;
    SlabFrom = "";
    SlabTo = "";
    // Currency = "";
    CurrencyID = 0;
    Amount = 0.00;

}

export class MyDynamicGridIHC {

    SLID = 0;
    SlabFrom = "";
    SlabTo = "";
    CurrencyID = 0;
    RevenueAmount = "";
    CostAmount = "";
    LineAmount = "";

}

export class MyDynamicGridDOCharges {

    SLID = 0;
    SlabUpto = "";
    CurrencyID = 0;
    Amount = 0.00;

}
export class myDynamicGridTHCCharges {


    SLID = 0;
    ChargeCodeID = 0;
    CommodityID = 0;
    CurrencyID = 0;
    ShipmentID = 0;
    CntrType = 0;
    Amount = 0.00;
    ExRate = 0.00;
    LocalAmount = 0.00;
}

export class myDynamicIHCBrackupCharges {

    SLID = 0;
    ChargeCodeID = 0;
    PaymentTo = 0;
    Amount = "";


}

