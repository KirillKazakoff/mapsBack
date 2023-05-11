CREATE TABLE "car"(
    id bigserial NOT NULL PRIMARY KEY,
    make varchar(100) NOT NULL,
    model varchar(100) NOT NULL,
    price numeric(19, 2) NOT NULL
);

