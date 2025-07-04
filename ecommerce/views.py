from django.shortcuts import render
from django.http import JsonResponse
from . import models
from rest_framework.decorators import api_view
from . import serializer

# Create your views here.
def home(request):
  return render(request, 'index.html')

@api_view(['GET'])
def productAPI(request):
  products = models.Product.objects.all()
  product_serializer = serializer.ProductSerializer(products, many=True)
  return JsonResponse(product_serializer.data, safe=False)
  