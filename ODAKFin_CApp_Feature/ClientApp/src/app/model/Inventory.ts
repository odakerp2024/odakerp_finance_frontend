export class Inventory {
    ID = 0;
    CntrType = '';
    Size = '';
    GeneralName = '';
    LineName = '';
    PortName = '';

    CntrNo = '';
    TypeID = 0;
    ISOCode = '';
    ModuleID = 0;
    LineID = 0;
    StatusID = 0;
    Remarks = 0;
    IsPickUp = 0;
    PickUpLocID = 0;
    PickUpDate = '';
    PickUpRef = '';
    IsDropOff = 0;
    DropOffLocID = 0;
    DropOffDate = '';
    DropOffRef = '';
    StatusDescription = '';
}
export class DynamicGridStatus {
    SID = 0;
    ToStatus = '';
    ToStatusID = 0;
    //ToStatusDescription = ''
}

export class StatusCodes {
    ID = 0;
    Status = '';
    StatusDescription = '';
    StatusID = 0;
    ValidVslVoy = 0;
    ValidNextLoc = 0;
    ValidTransMode = 0;
    ValidDepot = 0;
    ValidBL = 0;
    ValidCustomer = 0;
    ValidTerminal = 0;
}
