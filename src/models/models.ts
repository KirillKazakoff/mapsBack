// models
export type Vessel = {
    id: string;
    name: string;
};

export type SSD = {
    id: string;
    date: string;
    vessel_id: string;
    company_id: string;
    agreement_no: string;
    catch_zone_id: string;
    coordinates: string;
};

export type ProductionInput = {
    id_ssd: string;
    name: string;
    total: number;
};

export type ProductionDetails = {
    id_ssd: string;
    name: string;
    sort: string;
    current: number;
    total: number;
};

export type Bait = {
    id_ssd: string;
    name: string;
    total: number;
};

export type Reserve = {
    id_ssd: string;
    water: number;
    fuel: number;
};

export type SSDInfoT = {
    ssd: SSD[];
    productionDetails: ProductionDetails[];
    productionInput: ProductionInput[];
    reserve: Reserve[];
    bait: Bait[];
};
