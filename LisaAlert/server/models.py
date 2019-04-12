from django.db import models


class Operation(models.Model):
    operation_name = models.CharField(max_length=200)
    operation_id = models.AutoField(primary_key=True)

    def __str__(self):
        return self.operation_name


class User(models.Model):
    operation_id = models.ForeignKey(Operation, on_delete=models.CASCADE)
    person_id = models.IntegerField(primary_key=True)
    nickname = models.CharField(max_length=50, unique=True)
    online = models.BooleanField()
    group_id = models.IntegerField()
    password = models.CharField(max_length=50)

    def __str__(self):
        return self.nickname


class Route(models.Model):
    time = models.DateTimeField(primary_key=True)
    lat = models.FloatField()
    lng = models.FloatField()
    person_id = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.time)+" "+self.person_id.nickname


class Markup(models.Model):
    lat = models.FloatField()
    lng = models.FloatField()
    memo = models.CharField(max_length=30)

    def __str__(self):
        return self.memo


class Color(models.Model):
    color = models.CharField(max_length=6)
    group_id = models.IntegerField(primary_key=True)

    def __str__(self):
        return "#"+self.color
