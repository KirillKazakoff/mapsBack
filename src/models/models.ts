// models
export type Vessel = {
    id: string;
    name: string;
    company_id: string;
    type: string;
};

export type SSD = {
    id: string;
    date: string;
    vessel_id: string;
    company_id: string;
    agreement_no: string;
    catch_zone_id: string;
    coordinates: string;
    status: string;
};

export type ProductionInput = {
    id_ssd: string;
    name: string;
    total: number;
};

export type ProductionTransport = ProductionInput;

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
    productionTransport: ProductionTransport[];
    reserve: Reserve[];
    bait: Bait[];
};
