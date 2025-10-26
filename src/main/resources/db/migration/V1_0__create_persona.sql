CREATE TABLE persona (
    identifier UUID PRIMARY KEY,
    name VARCHAR(50),
    description VARCHAR(500),
    custom_instructions VARCHAR(500),
    checklist VARCHAR(100) ARRAY,
    key_aspects VARCHAR(100) ARRAY
);