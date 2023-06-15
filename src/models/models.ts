export type SSD = {
    id: string;
    date: string;
    vessel_id: string;
    company_id: string;
    agreement_no: string;
    catch_zone_id: string;
    coordinates: string;
};

export type ProductionCatch = {
    id_ssd: string;
    name: string;
    amount: number;
};

export type ProductionOutput = {
    id_ssd: string;
    name: string;
    current: number;
    total: number;
};

export type Vessel = {
    id: string;
    name: string;
};

export type Reserve = {
    id_ssd: string;
    water: number;
    fuel: number;
};
