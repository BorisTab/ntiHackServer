from django.urls import path
from . import views
urlpatterns = [
    path('', views.main_view, name='main_page'),
    path('person/update/', views.update, name='update'),
    path('operation/set/', views.set_operation, name='set_op'),
    path('operation/get/', views.get_operations, name='get_op'),
    path('group/create/', views.create_group, name='create_group'),
    path('operation/leave/', views.leave_operation, name='leave_op'),
    path('memo/add/', views.add_markup, name='add_mark'),
    path('map/update/', views.frontend_update, name='front_update')
]
