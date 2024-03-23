"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drodownVeslVoyage = exports.DynamicPDF1 = exports.DynamicGridNotes = exports.DynamicGridManifest = exports.DynamicGridSchedule = exports.VoyageDetails = exports.SlotOperator = exports.DynamicGridOperator = exports.DynamicGridService = exports.ServiceSetup = exports.Vessel = exports.CurrencyMaster = exports.BasicMaster = exports.ChargeTBMaster = exports.CTSizes = exports.CTTypes = exports.ContainerType = exports.Notes = exports.ComponentMaster = exports.Assembly = exports.ContLocationMaster = exports.RepairMaster = exports.DamageMaster = exports.NotesGrid = exports.DynamicGrid = exports.GeneralMaster = exports.LinerName = exports.Commodity = exports.Terminal = exports.Login = exports.MyAgency = exports.Depot = exports.StateMaster = exports.UOMMaster = exports.Cargo = exports.Port = exports.City = exports.State = exports.Country = void 0;
var Country = /** @class */ (function () {
    function Country() {
        this.ID = 0;
        this.CountryCode = '';
        this.CountryName = '';
        this.Status = '';
    }
    return Country;
}());
exports.Country = Country;
var State = /** @class */ (function () {
    function State() {
        this.ID = 0;
        this.StateName = '';
    }
    return State;
}());
exports.State = State;
var City = /** @class */ (function () {
    function City() {
        this.ID = 0;
        this.CityCode = '';
        this.CountryCode = '';
        this.CityName = '';
        this.Status = '';
        this.StateName = '';
        this.CountryID = 0;
        this.StateID = 0;
    }
    return City;
}());
exports.City = City;
var Port = /** @class */ (function () {
    function Port() {
        this.ID = 0;
        this.PortName = '';
        this.PortCode = '';
        this.CountryCode = '';
        this.MainPort = '';
        this.SeaPort = '';
        this.ICDPort = '';
        this.Status = '';
        this.CountryID = 0;
        this.OffLocID = 0;
    }
    return Port;
}());
exports.Port = Port;
var Cargo = /** @class */ (function () {
    function Cargo() {
        this.ID = 0;
        this.PkgCode = '';
        this.PkgDescription = '';
        this.StatusResult = '';
        this.Status = '';
    }
    return Cargo;
}());
exports.Cargo = Cargo;
var UOMMaster = /** @class */ (function () {
    function UOMMaster() {
        this.ID = 0;
        this.UOMCode = '';
        this.UOMDesc = '';
        this.StatusResult = '';
        this.Status = '';
    }
    return UOMMaster;
}());
exports.UOMMaster = UOMMaster;
var StateMaster = /** @class */ (function () {
    function StateMaster() {
        this.ID = 0;
        this.Country = '';
        this.StateCode = '';
        this.StateName = '';
        this.StatusResult = '';
        this.Status = 0;
        this.CountryID = 0;
    }
    return StateMaster;
}());
exports.StateMaster = StateMaster;
var Depot = /** @class */ (function () {
    function Depot() {
        this.ID = 0;
        this.DepName = '';
        this.DepCountry = 0;
        this.DepCity = 0;
        this.DepCountryName = '';
        this.DepCityName = '';
        this.StatusName = '';
        this.Status = 0;
        this.CountryName = '';
        this.CountryCode = 0;
        this.CityName = '';
        this.CityCode = 0;
        this.PortName = '';
        this.PID = 0;
        this.PortID = 0;
        this.Port = '';
    }
    return Depot;
}());
exports.Depot = Depot;
var MyAgency = /** @class */ (function () {
    function MyAgency() {
    }
    return MyAgency;
}());
exports.MyAgency = MyAgency;
var Login = /** @class */ (function () {
    function Login() {
    }
    return Login;
}());
exports.Login = Login;
var Terminal = /** @class */ (function () {
    function Terminal() {
        this.ID = 0;
        this.TerminalCode = '';
        this.TerminalName = '';
        this.PortID = '';
        this.Status = '';
        this.PortName = '';
        this.StatusName = '';
    }
    return Terminal;
}());
exports.Terminal = Terminal;
var Commodity = /** @class */ (function () {
    function Commodity() {
        this.ID = 0;
        this.CommodityUnCode = '';
        this.CommodityName = '';
        this.HSCode = '';
        this.DangerousFlag = '';
        this.CommodityType = 0;
        this.CommodityTypeID = 0;
        this.Remarks = '';
    }
    return Commodity;
}());
exports.Commodity = Commodity;
var LinerName = /** @class */ (function () {
    function LinerName() {
        this.ID = 0;
        this.CustomerName = '';
    }
    return LinerName;
}());
exports.LinerName = LinerName;
var GeneralMaster = /** @class */ (function () {
    function GeneralMaster() {
        this.ID = 0;
        this.GeneralName = '';
        this.Program = '';
    }
    return GeneralMaster;
}());
exports.GeneralMaster = GeneralMaster;
var DynamicGrid = /** @class */ (function () {
    function DynamicGrid() {
        this.PortID = 0;
        this.PID = 0;
        this.Port = '';
    }
    return DynamicGrid;
}());
exports.DynamicGrid = DynamicGrid;
var NotesGrid = /** @class */ (function () {
    function NotesGrid() {
        this.ID = 0;
        /*    LocAddress = '';*/
        this.Notes = '';
    }
    return NotesGrid;
}());
exports.NotesGrid = NotesGrid;
var DamageMaster = /** @class */ (function () {
    function DamageMaster() {
        this.ID = 0;
        this.DamageCode = '';
        this.DamageDescription = '';
        this.StatusResult = '';
        this.Status = '';
    }
    return DamageMaster;
}());
exports.DamageMaster = DamageMaster;
var RepairMaster = /** @class */ (function () {
    function RepairMaster() {
        this.ID = 0;
        this.RepairCode = '';
        this.RepairDescription = '';
        this.StatusResult = '';
        this.Status = '';
    }
    return RepairMaster;
}());
exports.RepairMaster = RepairMaster;
var ContLocationMaster = /** @class */ (function () {
    function ContLocationMaster() {
        this.ID = 0;
        this.LocationCode = '';
        this.Description = '';
        this.StatusResult = '';
        this.Status = '';
    }
    return ContLocationMaster;
}());
exports.ContLocationMaster = ContLocationMaster;
var Assembly = /** @class */ (function () {
    function Assembly() {
        this.ID = 0;
        this.GeneralName = '';
        this.Assembly = '';
    }
    return Assembly;
}());
exports.Assembly = Assembly;
var ComponentMaster = /** @class */ (function () {
    function ComponentMaster() {
        this.ID = 0;
        this.ComponentCode = '';
        this.ComponentDescription = '';
        this.StatusResult = '';
        this.Status = '';
        this.AssemblyID = 0;
        this.Assembly = '';
        this.GeneralName = '';
    }
    return ComponentMaster;
}());
exports.ComponentMaster = ComponentMaster;
var Notes = /** @class */ (function () {
    function Notes() {
        this.ID = 0;
        this.Notes = '';
        this.LocAddress = '';
        this.Itemsv = '';
        this.GeneralName = '';
        this.DocID = '';
    }
    return Notes;
}());
exports.Notes = Notes;
var ContainerType = /** @class */ (function () {
    function ContainerType() {
        this.ID = 0;
        this.Type = '';
        this.EQTypeID = 0;
        this.Size = '';
        this.SizeID = 0;
        this.ISOCode = '';
        this.Height = '';
        this.TEUS = '';
        this.SeqNo = '';
        this.IsSealReqd = '';
        this.IntBasic = '';
        this.GeneralName = '';
        this.Width = '';
        this.Length = '';
        this.TareWeight = '';
        this.MaxPayload = '';
        this.Remarks = '';
    }
    return ContainerType;
}());
exports.ContainerType = ContainerType;
var CTTypes = /** @class */ (function () {
    function CTTypes() {
        this.ID = 0;
        this.GeneralName = '';
    }
    return CTTypes;
}());
exports.CTTypes = CTTypes;
var CTSizes = /** @class */ (function () {
    function CTSizes() {
        this.ID = 0;
        this.GeneralName = '';
    }
    return CTSizes;
}());
exports.CTSizes = CTSizes;
var ChargeTBMaster = /** @class */ (function () {
    function ChargeTBMaster() {
        this.ID = 0;
        this.ChargeCode = '';
    }
    return ChargeTBMaster;
}());
exports.ChargeTBMaster = ChargeTBMaster;
var BasicMaster = /** @class */ (function () {
    function BasicMaster() {
    }
    return BasicMaster;
}());
exports.BasicMaster = BasicMaster;
var CurrencyMaster = /** @class */ (function () {
    function CurrencyMaster() {
    }
    return CurrencyMaster;
}());
exports.CurrencyMaster = CurrencyMaster;
var Vessel = /** @class */ (function () {
    function Vessel() {
    }
    return Vessel;
}());
exports.Vessel = Vessel;
var ServiceSetup = /** @class */ (function () {
    function ServiceSetup() {
    }
    return ServiceSetup;
}());
exports.ServiceSetup = ServiceSetup;
var DynamicGridService = /** @class */ (function () {
    function DynamicGridService() {
    }
    return DynamicGridService;
}());
exports.DynamicGridService = DynamicGridService;
var DynamicGridOperator = /** @class */ (function () {
    function DynamicGridOperator() {
    }
    return DynamicGridOperator;
}());
exports.DynamicGridOperator = DynamicGridOperator;
var SlotOperator = /** @class */ (function () {
    function SlotOperator() {
    }
    return SlotOperator;
}());
exports.SlotOperator = SlotOperator;
var VoyageDetails = /** @class */ (function () {
    function VoyageDetails() {
    }
    return VoyageDetails;
}());
exports.VoyageDetails = VoyageDetails;
var DynamicGridSchedule = /** @class */ (function () {
    function DynamicGridSchedule() {
    }
    return DynamicGridSchedule;
}());
exports.DynamicGridSchedule = DynamicGridSchedule;
var DynamicGridManifest = /** @class */ (function () {
    function DynamicGridManifest() {
    }
    return DynamicGridManifest;
}());
exports.DynamicGridManifest = DynamicGridManifest;
var DynamicGridNotes = /** @class */ (function () {
    function DynamicGridNotes() {
    }
    return DynamicGridNotes;
}());
exports.DynamicGridNotes = DynamicGridNotes;
var DynamicPDF1 = /** @class */ (function () {
    function DynamicPDF1() {
        this.aclFilename = '';
    }
    return DynamicPDF1;
}());
exports.DynamicPDF1 = DynamicPDF1;
var drodownVeslVoyage = /** @class */ (function () {
    function drodownVeslVoyage() {
        this.ID = 0;
        this.VesselName = "";
    }
    return drodownVeslVoyage;
}());
exports.drodownVeslVoyage = drodownVeslVoyage;
//# sourceMappingURL=common.js.map