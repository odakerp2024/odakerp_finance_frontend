"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLCargoDtls = exports.DynamicNavioPDF = exports.PortVessel = exports.BLContainer = exports.BLTypes = exports.BLNo = exports.BOL = void 0;
var BOL = /** @class */ (function () {
    function BOL() {
        this.MainID = 0;
        this.ShipperName = "";
        this.ShipperAddress = "";
        this.Consignee = "";
        this.ConsigneeAddress = "";
        this.Notify = "";
        this.NotifyAddress = "";
        this.NotifyAlso = "";
        this.NotifyAlsoAddress = "";
        this.SeqNo = "";
        this.BLID = 0;
        this.BkgID = 0;
        this.ShipperType = "";
        this.ConsigneeType = "";
        this.NotifyType = "";
        this.NotifyAlsoType = "";
        this.BLNumberID = 0;
        this.Origin = "";
        this.LoadPort = "";
        this.Discharge = "";
        this.Destination = "";
        this.BLTypeID = 0;
        this.OriginID = 0;
        this.LoadPortID = 0;
        this.DischargeID = 0;
        this.DestinationID = 0;
        this.DeliveryAgent = 0;
        this.DeliveryAgentAddress = "";
        this.MarksNos = "";
        this.Packages = "";
        this.Description = "";
        this.Weight = "";
        this.FreightTermsID = "";
        this.FreightPayableAt = "";
        this.NoOfOriginal = "";
        this.RFLBol = 0;
        this.BLIssueDate = "";
        this.PlaceOfIssue = "";
        this.ShipOnboardDate = "";
        this.PrintWt = 0;
        this.PrintNetWt = 0;
        this.NotPrint = 0;
        this.AttachShippingBill = "";
        this.AttachCustomerApproval = "";
        this.BLStatus = 0;
        this.ChkBLID = 0;
        this.BLNumber = "";
        this.PaymentTermsID = 0;
    }
    return BOL;
}());
exports.BOL = BOL;
var BLNo = /** @class */ (function () {
    function BLNo() {
        this.ID = 0;
        this.BLNumber = "";
        this.BkgId = "";
        this.MainID = 0;
    }
    return BLNo;
}());
exports.BLNo = BLNo;
var BLTypes = /** @class */ (function () {
    function BLTypes() {
        this.ID = 0;
        this.BLType = "";
    }
    return BLTypes;
}());
exports.BLTypes = BLTypes;
var BLContainer = /** @class */ (function () {
    function BLContainer() {
        this.ID = 0;
        //BLID = "";
        //BkgID = "";
        this.ContainerNo = "";
        this.ContrType = "";
        this.AgentSealNo = "";
        this.CustomerSealNo = "";
        this.GrsWt = "";
        this.NetWt = "";
        this.NoOfPkgs = "";
        this.Volume = "";
    }
    return BLContainer;
}());
exports.BLContainer = BLContainer;
var PortVessel = /** @class */ (function () {
    function PortVessel() {
        this.ID = 0;
        this.PortName = "";
    }
    return PortVessel;
}());
exports.PortVessel = PortVessel;
var DynamicNavioPDF = /** @class */ (function () {
    function DynamicNavioPDF() {
        this.navioFilename = '';
        this.id = '';
        this.printvalue = '';
    }
    return DynamicNavioPDF;
}());
exports.DynamicNavioPDF = DynamicNavioPDF;
var BLCargoDtls = /** @class */ (function () {
    function BLCargoDtls() {
        this.ID = 0;
        this.ContainerNo = "";
        this.ContrType = "";
        this.AgentSealNo = "";
        this.CustomerSealNo = "";
        this.GrsWt = "";
        this.NetWt = "";
        this.NoOfPkgs = "";
        this.Volume = "";
        this.Itemsv1 = "";
    }
    return BLCargoDtls;
}());
exports.BLCargoDtls = BLCargoDtls;
//# sourceMappingURL=boldata.js.map