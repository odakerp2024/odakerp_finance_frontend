"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myFreightBrackupDynamicgrid = exports.myenquiry = exports.myenquiryRevenuDynamicgrid = exports.myenquiryFreightDynamicgrid = exports.MyCustomerContractDropdown = exports.MyLinerDropdown = exports.mydropdownPort = exports.myDynamicShimpmentPODGrid = exports.myDynamicShimpmentPOLGrid = exports.DynamicGridAttach = exports.myDynamicReeferGrid = exports.myDynamicOutGaugeCargoGrid = exports.myHazardousDynamicGrid = exports.MyCargoMaster = exports.myCntrTypesDynamicGrid = void 0;
var myCntrTypesDynamicGrid = /** @class */ (function () {
    function myCntrTypesDynamicGrid() {
        this.ID = 0;
        this.CntrTypeID = "";
        this.CntrTypes = "";
        this.Nos = "";
    }
    return myCntrTypesDynamicGrid;
}());
exports.myCntrTypesDynamicGrid = myCntrTypesDynamicGrid;
var MyCargoMaster = /** @class */ (function () {
    function MyCargoMaster() {
        this.ID = 0;
        this.CargoName = "";
    }
    return MyCargoMaster;
}());
exports.MyCargoMaster = MyCargoMaster;
var myHazardousDynamicGrid = /** @class */ (function () {
    function myHazardousDynamicGrid() {
        this.ID = 0;
        this.HazarMCONo = "";
        this.HazarClass = "";
        this.CommodityID = 0;
    }
    return myHazardousDynamicGrid;
}());
exports.myHazardousDynamicGrid = myHazardousDynamicGrid;
var myDynamicOutGaugeCargoGrid = /** @class */ (function () {
    function myDynamicOutGaugeCargoGrid() {
        this.ID = 0;
        this.CommodityID = 0;
        this.Length = 0;
        this.Width = 0;
        this.Height = 0;
    }
    return myDynamicOutGaugeCargoGrid;
}());
exports.myDynamicOutGaugeCargoGrid = myDynamicOutGaugeCargoGrid;
var myDynamicReeferGrid = /** @class */ (function () {
    function myDynamicReeferGrid() {
        this.ID = 0;
        this.Temperature = "";
        this.Ventilation = "";
        this.Humidity = "";
        this.CommodityID = 0;
    }
    return myDynamicReeferGrid;
}());
exports.myDynamicReeferGrid = myDynamicReeferGrid;
var DynamicGridAttach = /** @class */ (function () {
    function DynamicGridAttach() {
        this.AID = 0;
        this.AttachName = '';
        this.AttachFile = '';
    }
    return DynamicGridAttach;
}());
exports.DynamicGridAttach = DynamicGridAttach;
var myDynamicShimpmentPOLGrid = /** @class */ (function () {
    function myDynamicShimpmentPOLGrid() {
        this.ID = 0;
        this.CntrTypeID = 0;
        this.ChargeOPT = 0;
        this.CurrencyID = 0;
        this.Amount2 = "";
        this.Remarks = "";
    }
    return myDynamicShimpmentPOLGrid;
}());
exports.myDynamicShimpmentPOLGrid = myDynamicShimpmentPOLGrid;
var myDynamicShimpmentPODGrid = /** @class */ (function () {
    function myDynamicShimpmentPODGrid() {
        this.ID = 0;
        this.CntrTypeID = 0;
        this.ChargeOPT = "";
        this.CurrencyID = 0;
        this.Amount2 = "";
        this.Remarks = "";
    }
    return myDynamicShimpmentPODGrid;
}());
exports.myDynamicShimpmentPODGrid = myDynamicShimpmentPODGrid;
var mydropdownPort = /** @class */ (function () {
    function mydropdownPort() {
        this.ID = 0;
        this.PortName = "";
        this.AgencyID = "";
        this.PortID = 0;
    }
    return mydropdownPort;
}());
exports.mydropdownPort = mydropdownPort;
var MyLinerDropdown = /** @class */ (function () {
    function MyLinerDropdown() {
    }
    return MyLinerDropdown;
}());
exports.MyLinerDropdown = MyLinerDropdown;
var MyCustomerContractDropdown = /** @class */ (function () {
    function MyCustomerContractDropdown() {
    }
    return MyCustomerContractDropdown;
}());
exports.MyCustomerContractDropdown = MyCustomerContractDropdown;
var myenquiryFreightDynamicgrid = /** @class */ (function () {
    function myenquiryFreightDynamicgrid() {
        this.ID = 0;
        this.CntrType = "";
        this.CntrTypeID = "";
        this.Nos = "";
        this.PerAmount = "";
        this.TotalAmount = "";
        this.Currency = "";
        this.ManifestPerAmount = "";
        this.ManifestTotalAmount = "";
        this.CommPerAmount = "";
        this.CommTotal = "";
        this.Commodity = "";
        this.CommodityID = "";
        this.CurrencyID = "";
    }
    return myenquiryFreightDynamicgrid;
}());
exports.myenquiryFreightDynamicgrid = myenquiryFreightDynamicgrid;
var myenquiryRevenuDynamicgrid = /** @class */ (function () {
    function myenquiryRevenuDynamicgrid() {
        this.ID = 0;
        this.CntrType = "";
        this.CntrTypeID = "";
        this.Nos = "";
        this.UOM = "";
        this.PaymentTerms = "";
        this.CostAmount = "";
        this.TotalCostAmount = "";
        this.ChargeCode = "";
        this.ChargeCodeID = "";
        this.Amount = "";
        this.TotalAmount = "";
        this.Currency = "";
        this.Commodity = "";
        this.CommodityID = "";
        this.CurrencyID = "";
        this.PaymentTermID = "";
        this.ExRate = "";
        this.BasicID = "";
    }
    return myenquiryRevenuDynamicgrid;
}());
exports.myenquiryRevenuDynamicgrid = myenquiryRevenuDynamicgrid;
var myenquiry = /** @class */ (function () {
    function myenquiry() {
        this.ID = 0;
        this.RegID = 0;
        this.PortID = 0;
        this.CustomerID = 0;
        this.BkgPartyChk = 0;
        this.ShipperChk = 0;
        this.ShipperID = 0;
        this.EnquiryNo = 0;
        this.EnquiryDate = 0;
        this.EnquirySourceID = 0;
        this.BookingCommissionID = 0;
        this.EnquiryStatusID = 0;
        this.ValidTillDate = '';
        this.SalesPersonID = 0;
        this.OriginID = 0;
        this.LoadPortID = 0;
        this.DischargePortID = 0;
        this.DestinationID = 0;
        this.RouteID = 0;
        this.DeliveryTermsID = 0;
        this.VesselID = 0;
        this.VoyagID = 0;
        this.POLTerminalID = 0;
        this.TranshipmentPortID = 0;
        this.TxtTSVessel = '';
        this.TxtTSVoyage = '';
        this.CargoID = 0;
        this.CargoWeight = '';
        this.HSCode = '';
        this.PrincibleID = 0;
        this.RateApproval = '';
        this.CustomerContract = '';
        this.AttachedRateApprovals = '';
        this.PODAgentID = 0;
        this.FPODAgentID = 0;
        this.TsPort1AgentID = 0;
        this.TsPort2AgentID = 0;
        this.PaymentTerms = 0;
        this.ChargeHead = 0;
        this.AlertMegId = 0;
        this.AlertMessage = '';
        this.HazarOpt = 0;
        this.OOGOpt = 0;
        this.ReeferOpt = 0;
        this.FreeDayOrigin = 0;
        this.FreeDayDestination = 0;
        this.DamageScheme = 0;
        this.SecurityDeposit = 0;
        this.BOLRequirement = 0;
        this.NumberOfDays = '';
        this.NumberOfDaysDestin = '';
        this.txtDamageScheme = '';
        this.txtSecurityDeposit = '';
        this.txtBOLRequirement = '';
        this.PaymentTermsID = 0;
        this.PayTermsID = 0;
        this.PrincibalID = 0;
        this.CustomerContractID = 0;
        this.LineContractID = 0;
        this.FixedOptID = 0;
        this.COCSOCOptID = 0;
        this.SlotOperatorID = 0;
        this.TSTwoAgentID = 0;
        this.TSAgentID = 0;
        this.TSVesselID = 0;
        this.TSVoyageID = 0;
        this.BkgId = 0;
        this.EnqID = 0;
        this.Status = 0;
        this.OfficeCode = 0;
        this.CancelReasonID = 0;
        this.CancelReason = '';
        this.RejectReasonID = 0;
        this.RejectReason = '';
        this.BookingNo = '';
        this.ValidStatusID = 0;
        this.Remarks = '';
        this.Reason = '';
        this.EnqCntrID = 0;
        this.NominationID = 0;
        this.OpenCount = 0;
    }
    return myenquiry;
}());
exports.myenquiry = myenquiry;
var myFreightBrackupDynamicgrid = /** @class */ (function () {
    function myFreightBrackupDynamicgrid() {
        this.ID = 0;
        this.ChargeCodeID = "";
        this.CurrencyID = "";
        this.Amount = "";
    }
    return myFreightBrackupDynamicgrid;
}());
exports.myFreightBrackupDynamicgrid = myFreightBrackupDynamicgrid;
//# sourceMappingURL=enquiry.js.map