export class CustomerContract {
    ID: string;
    CustomerID: string;
    PrincipalID: string;
    ContractNo: string;
    ContractDate: string;
    SalesPersonID: string;
    ValidTill: string;
    OriginID: string;
    LoadPortID: string;
    DischargePortID: string;
    DestinationID: string;
    RouteID: string;
    DeliveryTermsID: string;
    Remarks: string;
    SessionYear: string;
    CCNo: string;
    Status=0;
    FreeDaysOriginType: string;
    FreeDaysOrigin: string;
    FreeDaysDestination: string;
    FreeDaysDestinationType: string;
    DamageSchemeType: string;
    DamageScheme: string;
    SecDepositType: string;
    SecDeposit: string;
    BOLReqType: string;
    BOLReq: string;
    ItemsSchedule: '';
    Itemsv: '';
    RRID: 0;
    Reason: string;
    RejectReason: string;
    CancelReasonID: string;
    RejectReasonID: string;
    CancelReasonValue: string;
    RejectReasonValue: string;
    ContractDateTill: string;
    ValidStatusID = 0;
    OfficeLocation = 0;
    OpenCount = 0;

}
export class CustomerMaster {
    ID: string;
    CustomerName: string;
}
export class Agency {
    ID = 0;
    AgencyName = '';
   
}
export class Port {
    ID = 0;
    PortName = ''; 
}
export class RouteMaster {
    ID = 0;
    GeneralName = '';
}
export class SalesPersonMaster {
    ID = 0;
    UserName = '';
}
export class RateRequest {
    ID = 0;
    RequestNo = '';
}
export class DynamicGridContainer {
    CID: 0;
    ContainerTypeID: 0;
    Nos: '';
    CargoTypeID: 0;
    OceanAmount: '';
    OceanCurrencyID: 0;
    SlotAmount: '';
    //SlotCurrencyID: 0;
    //POLStdID: 0;
    //POLAmount: '';
    //POLCurrencyID: 0;
    PODStdID: 0;
    PODAmount: '';
    /*PODCurrencyID: 0;*/
}
export class DynamicGridAttach {
    AID = 0;
    AttachName = '';
    AttachFile = '';
}