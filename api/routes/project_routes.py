from flask import Blueprint, jsonify, request

from db import db

from api.models.project import Project



bp = Blueprint('project_routes', __name__)

@bp.route('/test-db-connection', methods=['GET'])
def test_db_connection():
    """
    Helper function to test the database connection. This will be deleted from the final repo.
    """
    try:
        new_project = Project(name='TEST PROJECT NAME!!')
        db.session.add(new_project)
        db.session.commit()
        project = Project.query.first()
    
    except Exception as e:
        error_message = f'Error connecting to the database: {str(e)}'
        return jsonify({'error': error_message}), 500

    else:
        result = {'message': 'Database connection successful', 'project_id': project.project_id, 'name': project.name}
        return jsonify(result), 200

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

# @bp.route('/create/<project_name>', methods=['POST'])
# def create_project(project_name):
#     data_str = request.data.decode('utf-8')
#     data = json.loads(data_str)
#     newProject = Project(data['slug'], data['name'], data['date'], data['size'])
#     projects.insert(0, newProject)
#     response = "success"
#     return response
