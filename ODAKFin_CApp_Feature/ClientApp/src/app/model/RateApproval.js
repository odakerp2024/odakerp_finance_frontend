"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonValues = exports.CntrTypeDetailsCharges = exports.MyRateApproval = void 0;
var MyRateApproval = /** @class */ (function () {
    function MyRateApproval() {
        this.ID = 0;
        this.LineName = '';
        this.PrincipleID = 0;
        this.RequestDate = '';
        this.RequestNo = '';
        this.EnquiryID = 0;
        this.SalesPersonID = 0;
        this.ValidTill = '';
        this.DischargePortID = 0;
        this.OriginID = 0;
        this.LoadPortID = 0;
        this.DestinationID = 0;
        this.RouteType = '';
        this.SessionFinYear = '';
        this.DeliveryTermID = 0;
        this.RouteTypeID = 0;
        this.DeliveryTerms = '';
        this.SalesPerson = '';
        this.StatusID = 0;
        this.CargoTypes = '';
        this.Remarks = '';
        this.FreeDaysOrigin = 0;
        this.FreeDaysOrgValue = '';
        this.FreeDaysDest = 0;
        this.FreeDaysDestValue = '';
        this.DamageScheme = 0;
        this.DamageSchemeValue = '';
        this.SecurityDeposit = 0;
        this.SecurityDepositDesc = '';
        this.BOLReq = 0;
        this.BOLReqDesc = '';
    }
    return MyRateApproval;
}());
exports.MyRateApproval = MyRateApproval;
var CntrTypeDetailsCharges = /** @class */ (function () {
    function CntrTypeDetailsCharges() {
        this.PID = 0;
        this.CntrTypeID = 0;
        this.Nos = '';
        this.CargoTypeID = 0;
        this.FrieghtAmount = '';
        this.FrtCurrID = 0;
        this.SlotAmount = '';
        this.SlotCurrID = 0;
        this.StdSplID = 0;
        this.StdSplAmount = '';
        this.StdSplCurrID = 0;
        this.StdSplVID = 0;
        this.StdSplVAmount = '';
        this.StdSplVCurrID = 0;
    }
    return CntrTypeDetailsCharges;
}());
exports.CntrTypeDetailsCharges = CntrTypeDetailsCharges;
var CommonValues = /** @class */ (function () {
    function CommonValues() {
    }
    return CommonValues;
}());
exports.CommonValues = CommonValues;
//# sourceMappingURL=RateApproval.js.map