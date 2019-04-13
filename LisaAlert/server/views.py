from django.shortcuts import render
from django.http import request
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from .models import Operation, Route, User, Markup, Color
from time import sleep
from datetime import datetime
import json

waiting_for_response = []


# GET-method
def get_operations(request):
    operations = Operation.objects.all()
    response = []
    for operation in operations:
        operation = dict(id=operation.operation_id, name=operation.operation_name)
        response.append(operation)

    return JsonResponse({"operations": response})


# POST-method
@csrf_exempt
def set_operation(request):
    data = json.loads(request.body.decode("utf-8"))
    nickname = data["nickname"]
    operation_id = data["id"]

    user = User.objects.get(nickname=nickname)
    operation = Operation.objects.get(operation_id=operation_id)
    user.operation_id = operation
    user.online = True
    user.save()

    person_id = user.person_id
    waiting_for_response.append(person_id)
    while person_id in waiting_for_response:
        sleep(1)

    group = User.objects.get(nickname=nickname).group_id
    return JsonResponse({"status": "OK", "group_id": group})

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

    return JsonResponse({"status": "OK"})


def create_group(request):
    existing_group_ids = set([user.group_id for user in User.objects.all()])
    group_id = len(list(existing_group_ids))

    nicknames = request.POST["users"]
    for nickname in nicknames:
        user = User.objects.get(nickname=nickname)
        user.group_id = group_id
        user.save()
        waiting_for_response.remove(nickname)

    return HttpResponse("")


def leave_operation(request):
    group_id = request.POST['group_id']
    people_in_group = User.objects.filter(group_id=group_id)
    for user in people_in_group:
        user.online = False
        user.group_id = None
        user.save()
    return JsonResponse({"status": "OK"})

@csrf_exempt
def add_markup(request):
    data = json.loads(request.body.decode("utf-8"))
    lat = data['lat']
    lng = data['lng']
    memo = data['memo']
    markup = Markup(lat=lat, lng=lng, memo=memo)
    markup.save()
    return JsonResponse({"status": "OK"})

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
        route_entries = Route.objects.filter(person_id=user.person_id)
        route = [{'lat': point.lat, 'lng': point.lng} for point in route_entries]
        infobox = """<h1 style='color:#000'>
                    <p>"""+user.nickname+"""</p>
                    <p>Группа: Лиса """ + str(user.group_id) + """</p>
                </h1>"""
        user_data= {"color": colors[user.group_id],
                    'coordinates': route[::-1][0],
                    'route': route,
                    'infobox': infobox}
        data['users'].append(user_data)
    return JsonResponse(data)


def main_view(request):
    return render(request, 'server/main_page.html')








