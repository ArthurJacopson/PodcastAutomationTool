from flask import Flask, jsonify, request
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

projects = []

class Project:
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

@app.route('/projects', methods=['GET'])
def get_projects():
    print(projects[0])
    response = [project.toJSON() for project in projects]
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/create/<project_name>', methods=['POST'])
def create_project(project_name):
    data_str = request.data.decode('utf-8')
    data = json.loads(data_str)
    newProject = Project(data['slug'], data['name'], data['date'], data['size'])
    projects.insert(0, newProject)
    response = "success"
    return response

if __name__ == "__main__":

    initialise_dummy_data()

    app.run()