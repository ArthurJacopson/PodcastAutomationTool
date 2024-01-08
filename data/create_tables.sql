CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY, -- SERIAL creates an auto-incrementing integer counter
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Defaults to using the current timestamp if none is provided
    last_edited TIMESTAMP,
    -- thumbnail
    -- project composition
)

CREATE TABLE project_compositions (
    composition_id SERIAL PRIMARY KEY,
    podcast_id INT REFERENCES projects(project_id) ON DELETE CASCADE, -- ON DELETE CASCADE means that if the project referenced is deleted, the associated composition will be deleted too
    file_id INT REFERENCES multimedia_files(file_id),
    comp_start_time TIMESTAMP NOT NULL, -- the time at which the file should start playing in the podcast composition
    comp_end_time TIMESTAMP NOT NULL, -- the time at which the file should stop playing in the podcast composition 
    file_start_time TIMESTAMP NOT NULL, -- the time (in the frame of reference of the file) at which the file should start playing
    file_end_time TIMESTAMP NOT NULL, -- the time (in the frame of reference of the file) at which the file should stop playing
)

CREATE TABLE multimedia_files (
    file_id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
)

CREATE TABLE edits()