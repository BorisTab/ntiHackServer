from django.shortcuts import render
from django.http import request
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Operation, Route, User, Markup, Color
from .server_response import ServerResponse
from datetime import datetime
import json


def get_operations(request):
    operations = Operation.objects.all()
    message = []
    for operation in operations:
        operation = dict(id=operation.id, name=operation.name, description=operation.description)
        message.append(operation)
    response = ServerResponse(message=message, status="OK")

    return JsonResponse(response.to_dict())


# POST-method
@csrf_exempt
def set_operation(request):
    data = json.loads(request.body.decode("utf-8"))
    nickname = data["nickname"]
    uid = data["id"]

    user = User.objects.get(nickname=nickname)
    operation = Operation.objects.get(id=uid)
    user.operation_id = operation
    user.online = True
    user.waiting_for_assignment = True
    user.save()
    response = ServerResponse(status="OK", message="Wait for assignment")

    return JsonResponse(response.to_dict())


def get_unallocated_users(request):
    users = User.objects.filter(waiting_for_assignment=True)
    names = [user.nickname for user in users]
    response = ServerResponse(status="OK", message=names)

    return JsonResponse(response.to_dict())

@csrf_exempt
def create_group(request):
    existing_group_ids = list(set([user.group_id for user in User.objects.all()]))
    existing_group_ids.remove(-1)
    group_id = len(existing_group_ids)+1

    data = json.loads(request.body.decode("utf-8"))
    nicknames = data['users']
    for nickname in nicknames:
        user = User.objects.get(nickname=nickname)
        user.group_id = group_id
        user.waiting_for_assignment = False
        user.save()
    response = ServerResponse(status="OK", message="")

    return JsonResponse(response.to_dict())


@csrf_exempt
def is_assigned(request):
    data = json.loads(request.body.decode("utf-8"))
    nickname = data['nickname']
    user = User.objects.get(nickname=nickname)
    flag = user.waiting_for_assignment
    if flag:
        message = {"assigned": True}
    else:
        message = {"assigned": False}

    response = ServerResponse(status="OK", message=message)
    return JsonResponse(response.to_dict())


@csrf_exempt
def update(request):
    data = json.loads(request.body.decode("utf-8"))
    latitude = data['lat']
    longitude = data['lng']
    person_id = data['person_id']
    time = data['time']

    user = User.objects.get(person_id=person_id)
    route_point = Route(lat=latitude, lng=longitude, time=time, person_id=user)
    route_point.save()
    response = ServerResponse(status="OK", message="")

    return JsonResponse(response.to_dict())


@csrf_exempt
def leave_operation(request):
    data = json.loads(request.body.decode("utf-8"))
    nickname = data['nickname']
    sender = User.objects.get(nickname=nickname)
    users_in_group = User.objects.filter(group_id=sender.group_id)
    for user in users_in_group:
        user.online = False
        user.group_id = -1
        user.save()

    response = ServerResponse(status="OK", message="")
    return JsonResponse(response.to_dict())


@csrf_exempt
def add_markup(request):
    data = json.loads(request.body.decode("utf-8"))
    lat = data['lat']
    lng = data['lng']
    memo = data['memo']
    markup = Markup(lat=lat, lng=lng, memo=memo)
    markup.save()
    response = ServerResponse(status="OK", message="")
    return JsonResponse(response.to_dict())


@csrf_exempt
def frontend_update(request):
    data = {'users': [], 'markups': []}

    markups = Markup.objects.all()
    for markup in markups:
        markup_data = {'memo': markup.memo,
                       'coordinates': {}
                       }
        markup_data['coordinates']['lat'] = markup.lat
        markup_data['coordinates']['lng'] = markup.lng
        data['markups'].append(markup_data)

    users = User.objects.all()
    colors = [color.color for color in Color.objects.all().order_by('group_id')]

    for user in users:
        if user.group_id != -1:
            route_entries = Route.objects.filter(person_id=user.person_id)
            route = [{'lat': point.lat, 'lng': point.lng} for point in route_entries]
            infobox = """<h1 style='color:#000'>
                        <p>"""+user.nickname+"""</p>
                        <p>Группа: Лиса """ + str(user.group_id) + """</p>
                    </h1>"""
            user_data= {"color": colors[user.group_id],
                        'infobox': infobox}

            try:
                user_data['coordinates'] = route[::-1][0]
                user_data['route'] = route
            except IndexError:
                user_data['coordinates'] = []
                user_data['route'] = []

            data['users'].append(user_data)

    response = ServerResponse(status="OK", message=data)

    return JsonResponse(response.to_dict())


def main_view(request):
    return render(request, 'server/main_page.html')








