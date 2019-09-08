export interface IClientsDbModel {
    ClientID: number;
    ClientName: string;
    ClientPhone?: string;
    ClientEmail?: string;
    ClientAddress?: string;
    ClientCity?: string;
    ClientState?: string;
    ClientZip?: string;
    ClientSSN?: string;
    InsuranceCoID?: number;
    ClientInsuranceMemberID?: string;
    ClientDoB?: Date;
    ClientSecondaryPhone?: string;
    ClientSecondaryEmail?: string;
    InsuranceCompanyPhone?: string;
    PolicyHolderName?: string;
    PolicyHolderDoB?: Date;
    PolicyHolderIsSameAsClient?: boolean;
    IsDischarged?: boolean;
    DischargeReason?: string;
    DischargeDate?: Date;
    DischargeNote?: string;
}