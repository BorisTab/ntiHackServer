from django.contrib import admin
from .models import Operation, User, Route
# Register your models here.
admin.site.register(Operation)
admin.site.register(User)
admin.site.register(Route)