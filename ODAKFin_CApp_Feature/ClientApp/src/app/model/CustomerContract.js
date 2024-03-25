"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicGridAttach = exports.DynamicGridContainer = exports.RateRequest = exports.SalesPersonMaster = exports.RouteMaster = exports.Port = exports.Agency = exports.CustomerMaster = exports.CustomerContract = void 0;
var CustomerContract = /** @class */ (function () {
    function CustomerContract() {
        this.Status = 0;
        this.ValidStatusID = 0;
        this.OfficeLocation = 0;
        this.OpenCount = 0;
    }
    return CustomerContract;
}());
exports.CustomerContract = CustomerContract;
var CustomerMaster = /** @class */ (function () {
    function CustomerMaster() {
    }
    return CustomerMaster;
}());
exports.CustomerMaster = CustomerMaster;
var Agency = /** @class */ (function () {
    function Agency() {
        this.ID = 0;
        this.AgencyName = '';
    }
    return Agency;
}());
exports.Agency = Agency;
var Port = /** @class */ (function () {
    function Port() {
        this.ID = 0;
        this.PortName = '';
    }
    return Port;
}());
exports.Port = Port;
var RouteMaster = /** @class */ (function () {
    function RouteMaster() {
        this.ID = 0;
        this.GeneralName = '';
    }
    return RouteMaster;
}());
exports.RouteMaster = RouteMaster;
var SalesPersonMaster = /** @class */ (function () {
    function SalesPersonMaster() {
        this.ID = 0;
        this.UserName = '';
    }
    return SalesPersonMaster;
}());
exports.SalesPersonMaster = SalesPersonMaster;
var RateRequest = /** @class */ (function () {
    function RateRequest() {
        this.ID = 0;
        this.RequestNo = '';
    }
    return RateRequest;
}());
exports.RateRequest = RateRequest;
var DynamicGridContainer = /** @class */ (function () {
    function DynamicGridContainer() {
    }
    return DynamicGridContainer;
}());
exports.DynamicGridContainer = DynamicGridContainer;
var DynamicGridAttach = /** @class */ (function () {
    function DynamicGridAttach() {
        this.AID = 0;
        this.AttachName = '';
        this.AttachFile = '';
    }
    return DynamicGridAttach;
}());
exports.DynamicGridAttach = DynamicGridAttach;
//# sourceMappingURL=CustomerContract.js.map