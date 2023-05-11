SELECT
    make,
    max(price)
FROM
    car
GROUP BY
    model,
    make
HAVING
    make = 'Land Rover'
    -- SELECT
    --     gender,
    --     count(*)
    -- FROM
    --     person
    -- GROUP BY
    --     gender
    -- HAVING
    --     count(*) > 30
    -- SELECT
    --     *
    -- FROM
    --     person
    -- WHERE
    --     gender = 'Male'
    --     AND (country_of_birth = 'Poland'
    --         OR country_of_birth = 'China')
    -- SELECT DISTINCT
    --     country_of_birth
    -- FROM
    --     person
    -- ORDER BY
    --     country_of_birth DESC
    -- SELECT
    --     *
    -- FROM
    --     person
    -- WHERE
    --     person.country_of_birth = 'China'
    -- SELECT
    --     *
    -- FROM
    --     person
    -- ORDER BY
    --     country_of_birth;
