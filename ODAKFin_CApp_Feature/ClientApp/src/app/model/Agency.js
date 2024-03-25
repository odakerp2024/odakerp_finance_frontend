"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicGridPorts = exports.DynamicGridAgency = exports.Agency = void 0;
var Agency = /** @class */ (function () {
    function Agency() {
        this.ID = 0;
        this.AgencyName = '';
        this.AgencyCode = '';
        this.CountryID = 0;
        this.CityID = 0;
        this.Address = '';
        this.StateID = 0;
        this.PinCode = '';
        this.TelNo = '';
        this.EmailDetail = '';
        this.TaxGSTNo = '';
        this.Notes = '';
        this.Status = 0;
    }
    return Agency;
}());
exports.Agency = Agency;
var DynamicGridAgency = /** @class */ (function () {
    function DynamicGridAgency() {
        this.PID = 0;
        this.PrincipalID = 0;
        this.PrincipalName = '';
    }
    return DynamicGridAgency;
}());
exports.DynamicGridAgency = DynamicGridAgency;
var DynamicGridPorts = /** @class */ (function () {
    function DynamicGridPorts() {
        this.CID = 0;
        this.PortID = 0;
        this.PortName = '';
    }
    return DynamicGridPorts;
}());
exports.DynamicGridPorts = DynamicGridPorts;
//# sourceMappingURL=Agency.js.map