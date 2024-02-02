FROM postgres:latest

# Expose the default PostgreSQL port
EXPOSE 5432

# Specify a volume for the database to make it persistent
VOLUME /var/lib/postgresql/data

# Copy the initialization script to the container
#COPY init.sql /docker-entrypoint-initdb.d/

# The init.sql script will be executed on container startup to create the specified database and user
