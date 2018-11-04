export class Clients {
    GeneralDetails: GeneralDetails;
    InsuranceDetails?: InsuranceDetails;
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