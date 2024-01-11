from flask import Blueprint, jsonify, request

from db import db

from api.models.project import Project

bp = Blueprint('project_routes', __name__)


@bp.route('/projects', methods=['GET'])
def get_projects():
    try:
        projects = Project.query.all()
        projects = [project.toJSON() for project in projects]
        response = jsonify(projects)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

    except Exception as e:
        error_message = f'Error retrieving projects: {str(e)}'
        return jsonify({'error': error_message}), 500


@bp.route('/create/<project_name>', methods=['POST'])
def create_project(project_name):
    """
    Endpoint to be used when creating a new project.
    :param project_name: the name of the project to be created.
    """
    try:
        new_project = Project(name=project_name)
        db.session.add(new_project)
        db.session.commit()
        project = Project.query.first()
    
    except Exception as e:
        error_message = f'Error connecting to the database: {str(e)}'
        return jsonify({'error': error_message}), 500

    else:
        result = {'message': 'Database connection successful', 'project_id': project.project_id, 'name': project.name}
        return jsonify(result), 200
