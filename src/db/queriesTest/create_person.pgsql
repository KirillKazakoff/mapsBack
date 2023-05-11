CREATE TABLE "person"(
    id bigserial NOT NULL PRIMARY KEY,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    gender varchar(20) NOT NULL,
    date_of_birth date NOT NULL,
    country_of_birth varchar(100),
    email varchar(150)
);

