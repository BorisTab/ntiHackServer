from django.db import models


class Operation(models.Model):
    operation_name = models.CharField(max_length=200)
    operation_id = models.AutoField(primary_key=True)


class User(models.Model):
    operation_id = models.ForeignKey(Operation, on_delete=models.CASCADE)
    person_id = models.IntegerField(primary_key=True)
    nickname = models.CharField(max_length=50, unique=True)
    online = models.BooleanField()
    group_id = models.IntegerField()
    password = models.CharField(max_length=50)


class Route(models.Model):
    time = models.DateTimeField(primary_key=True)
    lat = models.FloatField()
    lng = models.FloatField()
    person_id = models.ForeignKey(User, on_delete=models.CASCADE)


class Markup(models.Model):
    lat = models.FloatField()
    lng = models.FloatField()
    memo = models.CharField(max_length=30)

