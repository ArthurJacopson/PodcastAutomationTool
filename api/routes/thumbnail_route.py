import json
from flask import Blueprint, request, jsonify

from api.editing.utils import thumbnail


bp = Blueprint('thumbnail_route', __name__)


@bp.route("/get-thumbnail", methods=["POST"])
def get_thumbnail():
    """
    Fetches bucket and key of video file that thumbnail is to be generated from.
    """
    data_str = request.data.decode('utf-8')
    data = json.loads(data_str)
    response = thumbnail.generate_thumbnail(data["bucket"], data["key"])
    return jsonify(response)
