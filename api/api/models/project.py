from flask_sqlalchemy import SQLAlchemy

from db import db

class Project(db.Model):
    __tablename__ = 'projects'

    project_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(1000), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    last_edited = db.Column(db.DateTime, nullable=True, server_default=db.func.now())
    size = 20

    def __repr__(self):
        return f"<Project(project_id={self.project_id}, name={self.name}, description={self.description})>"

    def toJSON(self):
        return {
            "project_id": self.project_id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at,
            "last_edited": self.last_edited,
            "size": self.size
        }