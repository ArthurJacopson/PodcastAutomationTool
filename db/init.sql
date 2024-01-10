CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    last_edited TIMESTAMP
);

INSERT INTO projects (name, description) VALUES ('Project 1', 'Description 1');
INSERT INTO projects (name, description) VALUES ('Project 2', 'Description 2');