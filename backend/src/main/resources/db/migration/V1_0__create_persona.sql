CREATE TABLE persona (
    identifier UUID PRIMARY KEY,
    name VARCHAR(50),
    description VARCHAR(1000),
    custom_instructions VARCHAR(1000),
    checklist VARCHAR(500) ARRAY,
    key_aspects VARCHAR(100) ARRAY
);