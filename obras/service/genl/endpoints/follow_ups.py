from flask import json, request
from flask_restplus import Resource

import dal.follow_up
from genl.restplus import api
from misc.helper import get_search_params
from misc.helperpg import EmptySetError

ns = api.namespace("follow_ups", description="Operations related to follow_ups")


@ns.route("/")
class FollowUpCollection(Resource):
    @api.marshal_list_with(dal.follow_up.model)
    @api.param("offset", "From which record to start recording, used for pagination")
    @api.param("limit", "How many records to return")
    @api.param("order_by", "Which field use to order the providers")
    @api.param("order", "ASC or DESC, which ordering to use")
    @api.param("project", "")
    @api.param("verified_progress", "")
    @api.param("check_stage", "")
    def get(self):
        """
        Returns list of follow_up.
        """
        offset = request.args.get("offset", 0)
        limit = request.args.get("limit", 10)
        order_by = request.args.get("order_by", "id")
        order = request.args.get("order", "ASC")

        search_params = get_search_params(
            request.args, ["project", "verified_progress", "check_stage"]
        )

        follow_up = dal.follow_up.page(offset, limit, order_by, order, search_params)

        return follow_up

    @api.response(201, "Follow up successfully created.")
    @api.expect(dal.follow_up.model)
    @api.marshal_with(dal.follow_up.model)
    def post(self):
        """
        Creates a new follow_up.
        """
        follow_up = json.loads(request.data)
        dal.follow_up.create(**follow_up)

        return follow_up, 201


@ns.route("/count")
class FollowUpCount(Resource):
    @api.param("project", "")
    @api.param("verified_progress", "")
    @api.param("check_stage", "")
    def get(self):
        search_params = get_search_params(
            request.args, ["project", "verified_progress", "check_stage"]
        )
        try:
            count = dal.follow_up.count(search_params)
        except EmptySetError:
            count = 0

        return {"count": count}


@ns.route("/<int:follow_up_id>")
@api.response(404, "Follow up not found.")
class FollowUpItem(Resource):
    @api.marshal_with(dal.follow_up.model)
    def get(self, follow_up_id):
        """
        Returns a follow_up.
        """
        try:
            follow_up = dal.follow_up.find(follow_up_id)
        except EmptySetError:
            return {"message": "Follow up not found"}, 404

        return follow_up

    @api.response(200, "Follow up successfully updated.")
    @api.expect(dal.follow_up.model)
    @api.marshal_with(dal.follow_up.model)
    def put(self, follow_up_id):
        """
        Updates a follow_up.
        """
        follow_up = json.loads(request.data)
        follow_up["id"] = follow_up_id
        dal.follow_up.edit(**follow_up)

        return follow_up, 200

    @api.response(204, "Follow up successfully deleted.")
    def delete(self, follow_up_id):
        """
        Deletes a follow_up.
        """
        dal.follow_up.block(follow_up_id)

        return None, 204