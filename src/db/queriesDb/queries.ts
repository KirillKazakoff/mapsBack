import {
    Coordinates,
    ProductionDetails,
    ProductionInput,
    ProductionTransport,
    Reserve,
    SSD,
} from '../../models/models';
import { Bait } from '../../models/models';

//prettier-ignore
export const queries = {
    get: {
        bySSDId: (tableName: string, id: string) => `SELECT * 
            FROM ${tableName}
            WHERE id_ssd = '${id}'
        `,
        ssd: `SELECT vessel.name AS vessel,
            vessel.type AS vessel_type,
            company.name AS company,
            catch_zone.name AS catch_zone,
            ssd.date,
            ssd.coordinates,
            ssd.id,
            ssd.status
                FROM
            ssd
            JOIN vessel ON vessel.id = ssd.vessel_id
            JOIN company ON company.id = ssd.company_id
            JOIN catch_zone ON catch_zone.id = ssd.catch_zone_id
        `,

        vessels: (companyId: string) => {
            if (companyId === 'all') {
                return `SELECT * FROM vessel`;
            }
            return `SELECT * FROM vessel WHERE company_id = '${companyId}'`;
        },
        
        ssdByVessel: (id: string) => ``,
        vessel: (id: string) => ``,

        productionDetails: (id: string) => ``,
        productionInput: (id: string) => ``,
        productionTransport: (id: string) => ``,
        bait: (id: string) => ``,
        reserve: (id: string) => ``,
        
    },
    post: {
        ssd: (ssd: SSD) => `INSERT INTO ssd
            (id, date, company_id, agreement_no, catch_zone_id, coordinates, vessel_id, status)
            values ('${ssd.id}', '${ssd.date}', '${ssd.company_id}', '${ssd.agreement_no}', '${ssd.catch_zone_id}', '${ssd.coordinates}', '${ssd.vessel_id}', '${ssd.status}') 
        `,
        production_details: (details: ProductionDetails) => `INSERT INTO production_details
            (id_ssd, name, sort, current, total)
            VALUES ('${details.id_ssd}', '${details.name}', '${details.sort}', '${details.current}', '${details.total}' )
        `,
        production_input: (input: ProductionInput) => `INSERT INTO production_input
            (id_ssd, name, total)
            VALUES ('${input.id_ssd}', '${input.name}', ${input.total})
        `,
        production_transport: (transport: ProductionTransport) => `INSERT INTO production_transport
            (id_ssd, name, total)
            VALUES ('${transport.id_ssd}', '${transport.name}', ${transport.total})
        `,
        bait: (bait: Bait) => `INSERT INTO bait
            (id_ssd, name, total)    
            VALUES ('${bait.id_ssd}', '${bait.name}', '${bait.total}')
        `,
        reserve: (reserve: Reserve) => `INSERT INTO Reserve 
            (id_ssd, water, fuel)
            VALUES ('${reserve.id_ssd}', ${reserve.water}, ${reserve.fuel})
        `,
        coordinates: (coordinates: Coordinates) => `UPDATE ssd 
            SET coordinates = '${coordinates.coordinates}'
            WHERE id = (
                SELECT id FROM ssd 
                WHERE ssd.vessel_id = '${coordinates.vessel_id}'
                ORDER BY date
                LIMIT 1
            )
        `,
        // coordinates: (coordinates: Coordinates) => `UPDATE ssd 
        //     SET coordinates = '${coordinates.coordinates}'
        //     WHERE vessel_id = '${coordinates.vessel_id}'
        //         AND date = '${coordinates.date}' 
        //     ORDER BY 
        // `,
        catch_zones: `INSERT INTO catch_zone 
            (id, NAME)
            VALUES %L
            ON CONFLICT (id)
            DO UPDATE SET
                name = excluded.name;
        `,
    },
};

queries.get.ssdByVessel = (id: string) => {
    return `${queries.get.ssd} WHERE ssd.vessel_id = '${id}' ORDER BY ssd.date DESC`;
};
queries.get.vessel = (id: string) => {
    return `SELECT * FROM vessel WHERE vessel.id = '${id}'`;
};
queries.get.productionTransport = (id: string) => {
    return queries.get.bySSDId('production_transport', id);
};
queries.get.productionDetails = (id: string) => {
    return queries.get.bySSDId('production_details', id);
};
queries.get.productionInput = (id: string) => {
    return queries.get.bySSDId('production_input', id);
};
queries.get.reserve = (id: string) => {
    return queries.get.bySSDId('reserve', id);
};
queries.get.bait = (id: string) => {
    return queries.get.bySSDId('bait', id);
};
