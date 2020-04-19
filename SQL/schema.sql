DROP TABLE IF EXISTS city;
CREATE TABLE city (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(100),
    formatted_query VARCHAR(255),
    lattitude VARCHAR(255),
    longitude VARCHAR(255)
);

-- INSERT INTO city(city_name, lattitude,longitude) VALUES ('seattle', 1234567890,0987654321);