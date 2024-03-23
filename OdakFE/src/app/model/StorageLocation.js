"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageLoactionMaster = exports.Port = void 0;
var Port = /** @class */ (function () {
    function Port() {
        this.ID = 0;
        this.PortCode = '';
    }
    return Port;
}());
exports.Port = Port;
var StorageLoactionMaster = /** @class */ (function () {
    function StorageLoactionMaster() {
        this.ID = 0;
        this.SLTypeID = 0;
        this.OfficeID = 0;
        this.StorageLoc = '';
        this.StorageCode = '';
        this.PortID = 0;
        this.Remarks = '';
        this.StatusID = 0;
        this.AlertMessage = '';
        this.StorageStatus = '';
        this.StatusResult = '';
        this.StorageLocation = '';
        this.status = 0;
    }
    return StorageLoactionMaster;
}());
exports.StorageLoactionMaster = StorageLoactionMaster;
//# sourceMappingURL=StorageLocation.js.map