from django.test import TestCase, RequestFactory
from datetime import datetime
from .models import Operation, User, Color
from .views import *


class OperationTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.operation = Operation.objects.create(name="Name", description="Description")

    def test_getting_list(self):
        request = self.factory.get("operation/get/")
        response = get_operations(request)
        self.assertEqual(response.status_code, 200)


class UserTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.operation = Operation.objects.create(name="Name", description="Description")
        self.user = User.objects.create(person_id=0, nickname="test", online=False, group_id=-1, password="test",
                                        operation_id=self.operation)

    def test_operation_setting(self):
        data = {'nickname': self.user.nickname, 'id': self.operation.id}
        request = self.factory.post("operation/set/", data, content_type="application/json")
        response = set_operation(request)
        self.assertEqual(response.status_code, 200)

    def test_getting_unallocated(self):
        request = self.factory.get("person/is_waiting")
        response = get_unallocated_users(request)
        self.assertEqual(response.status_code, 200)

    def test_assignment_checking(self):
        data = {"nickname": self.user.nickname}
        request = self.factory.post("person/assigned/", data, content_type="application/json")
        response = is_assigned(request)
        self.assertEqual(response.status_code, 200)

    def test_group_creation(self):
        data = {"users": [self.user.nickname]}
        request = self.factory.post("group/create/", data, content_type="application/json")
        response = create_group(request)
        self.assertEqual(response.status_code, 200)

    def test_data_update(self):
        data = {"nickname": self.user.nickname, 'lat': '37.4568', 'lng': '52.6789', 'time': str(datetime.now())}
        request = self.factory.post("person/update/", data, content_type="application/json")
        response = update(request)
        self.assertEqual(response.status_code, 200)

    def test_markup_adding(self):
        data = {'lat': '37.4568', 'lng': '52.6789', 'memo': 'test'}
        request = self.factory.post("memo/add/", data, content_type="application/json")
        response = add_markup(request)
        self.assertEqual(response.status_code, 200)

    def test_operation_leaving(self):
        data = {"nickname": self.user.nickname}
        request = self.factory.post("operation/leave/", data, content_type="application/json")
        response = leave_operation(request)
        self.assertEqual(response.status_code, 200)


class FrontendTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.operation = Operation.objects.create(name="Name", description="Description")
        self.user = User.objects.create(person_id=0, nickname="test", online=True, group_id=1, password="test",
                                        operation_id=self.operation)
        self.color1 = Color.objects.create(color="000000", group_id=1)
        self.color2 =Color.objects.create(color="ffffff", group_id=2)

    def test_frontend_update(self):
        first_position_data = {"nickname": self.user.nickname, 'lat': '37.4568', 'lng': '53.6789', 'time': str(datetime.now())}
        second_position_data = {"nickname": self.user.nickname, 'lat': '34.4568', 'lng': '52.6789', 'time': str(datetime.now())}
        first_request = self.factory.post("person/update/", first_position_data, content_type="application/json")
        second_request = self.factory.post("person/update/", second_position_data, content_type="application/json")
        update(first_request)
        update(second_request)
        first_markup_data = {'lat': '37.4568', 'lng': '52.6789', 'memo': 'test1'}
        second_markup_data = {'lat': '37.4568', 'lng': '56.6789', 'memo': 'test2'}
        first_markup_request = self.factory.post("memo/add/", first_markup_data, content_type="application/json")
        second_markup_request = self.factory.post("memo/add/", second_markup_data, content_type="application/json")
        add_markup(first_markup_request)
        add_markup(second_markup_request)

        request = self.factory.get("map/update/")
        response = frontend_update(request)
        self.assertEqual(response.status_code, 200)

