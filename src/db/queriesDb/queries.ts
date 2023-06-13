export const queries = {
    get: {
        ssd: `SELECT
        vessel.name AS vessel,
        company.name AS company,
        catch_zone.name AS catch_zone,
        ssd.date
            FROM
        ssd
        JOIN vessel ON vessel.id = ssd.vessel_id
        JOIN company ON company.id = ssd.company_id
        JOIN catch_zone ON catch_zone.id = ssd.catch_zone_id
        `,
    },
    post: {
        catch_zones: `INSERT INTO catch_zone (id, NAME)
        VALUES %L
        ON CONFLICT (id)
        DO UPDATE SET
            name = excluded.name;
        `,
    },
};
