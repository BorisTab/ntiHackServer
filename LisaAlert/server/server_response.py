import json


class ServerResponse:
    message = None
    status = None

    def __init__(self, message, status):
        self.message = message
        self.status = status

    def to_dict(self):
        data = {"status": self.status, "message": self.message}
        return data
