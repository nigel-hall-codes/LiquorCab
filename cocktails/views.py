from django.shortcuts import render
from django.http import HttpResponse
import json
from forms import InventoryForm
import predict
from .models import Inventory
from django.conf import settings
from django.core import serializers
from .models import Cocktails
import convertIngredients
from itertools import chain







# Create your views here.

def postimage(request):

    if request.method == 'POST':
        form = InventoryForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                data = predict.run(request.FILES['image'])
            except:
                pass
            instance = Inventory(image=request.FILES['image'], prediction=data['description'])
            instance.save()
            # image = instance.image




        # data = {'data': 'otherdata'}
        # data = request.FILES
        # Inventory.objects.create(image=data)
        # Inventory.save()


        # data = predict.run(data)
        return HttpResponse(
            json.dumps(data),
            content_type='application/json')
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )

def make_cond(name, value):
    cond = json.dumps({name:value})[1:-1] # remove '{' and '}'
    return ' ' + cond # avoid '\"'

def getcocktails(request):
    inventory = Inventory.objects.all()
    cList = []

    cs = Cocktails.objects.all()
    for i in inventory:
        # print i.prediction
        if not cs.filter(ingredients__icontains=i.prediction):
            continue
        else:
            cList.append(cs.filter(ingredients__icontains=i.prediction))

    cs = list(chain(cs))
    for c in cs:
        print c.name
    data = serializers.serialize("json", cs)
    return HttpResponse(
        json.dumps(data),
        content_type='application/json')

