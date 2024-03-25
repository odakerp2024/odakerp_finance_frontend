"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionTypes = exports.SalesOfficeDD = exports.DynamicGrid = exports.Org = exports.State = exports.SalesOffice = exports.Office = exports.Region = void 0;
var Region = /** @class */ (function () {
    function Region() {
        this.ID = 0;
        this.RegionName = '';
        this.Status = '';
        this.StatusV = '';
    }
    return Region;
}());
exports.Region = Region;
var Office = /** @class */ (function () {
    function Office() {
        this.ID = 0;
        this.OfficeLoc = '';
        this.CompanyName = '';
        this.CountryID = 0;
        this.CityID = 0;
        this.StateID = 0;
        this.Pincode = '';
        this.TaxGSTNo = '';
        this.TelNo = '';
        this.FaxNo = '';
        this.Address = '';
        this.StatusID = 0;
    }
    return Office;
}());
exports.Office = Office;
var SalesOffice = /** @class */ (function () {
    function SalesOffice() {
        this.ID = 0;
        this.SalesOffLoc = '';
        this.OfficeLocID = 0;
        this.OfficeID = 0;
        this.Status = 0;
        this.OfficeLoc = '';
        this.GeoLocID = 0;
    }
    return SalesOffice;
}());
exports.SalesOffice = SalesOffice;
var State = /** @class */ (function () {
    function State() {
        this.ID = 0;
        this.StateName = '';
    }
    return State;
}());
exports.State = State;
var Org = /** @class */ (function () {
    function Org() {
        this.ID = 0;
        this.OrgName = '';
        this.CountryID = 0;
        this.CityID = 0;
        this.StateID = 0;
        this.Pincode = '';
        this.TaxGSTNo = '';
        this.IsLiner = 0;
        this.IsFF = 0;
        this.Address = '';
        this.StatusID = 0;
        this.IsTransport = 0;
        this.RegionID = 0;
        this.OfficeLocID = 0;
        this.DivisionDetails = '';
    }
    return Org;
}());
exports.Org = Org;
var DynamicGrid = /** @class */ (function () {
    function DynamicGrid() {
        this.ID = 0;
        this.RegionID = 0;
        this.SalesOffLocID = 0;
        this.OfficeLoc = '';
    }
    return DynamicGrid;
}());
exports.DynamicGrid = DynamicGrid;
var SalesOfficeDD = /** @class */ (function () {
    function SalesOfficeDD() {
        this.ID = 0;
        this.SalesOffLoc = '';
    }
    return SalesOfficeDD;
}());
exports.SalesOfficeDD = SalesOfficeDD;
var DivisionTypes = /** @class */ (function () {
    function DivisionTypes() {
        this.ID = 0;
        this.Divison = '';
        this.IsTrue = 0;
    }
    return DivisionTypes;
}());
exports.DivisionTypes = DivisionTypes;
//# sourceMappingURL=org.js.map