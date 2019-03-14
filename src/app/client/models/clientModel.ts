import { CPTCodes } from "./cptCodeModel";
import { ICDCodes } from "./icdCodeModel";

export class Clients {
    GeneralDetails: GeneralDetails;
    InsuranceDetails?: InsuranceDetails;
    ClientSessionDetails?: ClientSessionDetails[];
}

export class GeneralDetails {
    ClientID: number;
    ClientName: string;
    ClientLastName: string;
    ClientSSN?: string;
    ClientAddress?: string;
    ClientCity?: string;
    ClientState?: string;
    ClientZip?: string;
    ClientPhone?: string;
    ClientEmail?: string;
    ClientDoB?: string;
    ClientSecondaryPhone?: string;
    ClientSecondaryEmail?: string;
    IsDischarged?: boolean;
}

export class InsuranceDetails {
    InsuranceCompany: InsuranceCompanies;
    InsuranceMemberID?: string;
    PolicyHolderName?: string;
    InsuranceCompanyPhone?: string;
    PolicyDoB?: string;
    IsSameAsClient?: boolean;
}

export class InsuranceCompanies {
    InsuranceCompanyID: number;
    InsuranceCompanyName?: string;
    InsurancePhone?: string;
}

export class ClientSessionDetails {
    ClientSessionID: number;
    ClientSessionDate: string;
    ClientSessionNotes: string;
    ClientSessionICDCodes?:ICDCodes[];
    ClientSessionCPTCodes?:CPTCodes[];
}

export class DischargeDetail {
    ClientID: number;
    DischargeReason: string;
    DischargeNote: string;
}