from django.urls import path
from . import views
urlpatterns = [
    path('', views.main_view, name='main_page'),
    path('update/', views.update, name='update'),
    path('set_op/', views.set_operation, name='set_op'),
    path('get_op/', views.get_operations, name='get_op'),
    path('create_group/', views.create_group, name='create_group'),
    path('leave_op/', views.leave_operation, name='leave_op'),
    path('add_mark/', views.add_markup, name='add_mark'),
    path('front_update/', views.frontend_update, name='front_update')
]
