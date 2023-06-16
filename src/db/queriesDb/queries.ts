import { SSD } from '../../models/models';

export const queries = {
    get: {
        ssd: `SELECT vessel.name AS vessel,
            company.name AS company,
            catch_zone.name AS catch_zone,
            ssd.date
                FROM
            ssd
            JOIN vessel ON vessel.id = ssd.vessel_id
            JOIN company ON company.id = ssd.company_id
            JOIN catch_zone ON catch_zone.id = ssd.catch_zone_id
        `,
        lastSsdByVessel: (id: string) => `SELECT *
            FROM
                ssd s
            WHERE
                s.vessel_id = '${id}'
            ORDER BY
                s.date DESC
            LIMIT 1;
`,
    },
    post: {
        ssd: (ssd: SSD) => `INSERT INTO ssd
            (id, date, company_id, agreement_no, catch_zone_id, coordinates, vessel_id)
            values ('${ssd.id}', '${ssd.date}', '${ssd.company_id}', '${ssd.agreement_no}', '${ssd.catch_zone_id}', '${ssd.coordinates}', '${ssd.vessel_id}') 
            RETURNING *
        `,
        catch_zones: `INSERT INTO catch_zone (id, NAME)
            VALUES %L
            ON CONFLICT (id)
            DO UPDATE SET
                name = excluded.name;
        `,
    },
};
