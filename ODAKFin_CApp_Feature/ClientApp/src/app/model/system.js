"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentNumbering = exports.AppConfig = void 0;
var AppConfig = /** @class */ (function () {
    function AppConfig() {
        this.ID = 0;
        this.RefCode = '';
        this.GeneralName = '';
        this.StatusV = '';
        this.SeqNo = '';
        this.StatusN = 0;
    }
    return AppConfig;
}());
exports.AppConfig = AppConfig;
var DocumentNumbering = /** @class */ (function () {
    function DocumentNumbering() {
        this.ID = 0;
        this.ModuleID = 0;
        this.ProgramID = 0;
        this.StatusID = 0;
        this.LinerCode = '';
        this.LinerID = 0;
        this.BLNoLogicID = 0;
        this.LinerName = '';
        this.BLNoLogic = '';
        this.StatusResult = '';
        this.Module = '';
        this.Program = '';
        this.Status = '';
    }
    return DocumentNumbering;
}());
exports.DocumentNumbering = DocumentNumbering;
//# sourceMappingURL=system.js.map