import json
from flask import Blueprint, jsonify, request

bp = Blueprint('project_routes', __name__)


projects = []

class Project:
    """
    Project model
    TODO: needs to be moved to models directory when working on issue #88
    TODO: move this class to models/project.py

    """
    def __init__(self, slug, name, date, size):
        self.slug = slug
        self.name = name
        self.date = str(date)
        self.size = size 

    def toJSON(self):
        return {"slug": self.slug,
                "name": self.name,
                "date": self.date,
                "size": self.size}

    def __repr__(self):        
        return f"Project: {self.name}"

def initialise_dummy_data():
    global projects

    a = Project("project-a", "Project A", "Oct 14, 2023", 25.61)
    b = Project("project-b", "Project B", "Sep 12, 2023", 22.23)
    c = Project("project-c", "Project c", "June 17, 2023", 345.23)

    projects = [a, b, c]

@bp.route('/projects', methods=['GET'])
def get_projects():
    print(projects[0])
    response = [project.toJSON() for project in projects]
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@bp.route('/create/<project_name>', methods=['POST'])
def create_project(project_name):
    data_str = request.data.decode('utf-8')
    data = json.loads(data_str)
    newProject = Project(data['slug'], data['name'], data['date'], data['size'])
    projects.insert(0, newProject)
    response = "success"
    return response
