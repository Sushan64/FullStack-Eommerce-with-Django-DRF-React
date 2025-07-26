from django.urls import path, include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from .models import Product, AttributeValue, Cart, CartItems


class AttributeValueSerializer(serializers.ModelSerializer):
  attribute = serializers.StringRelatedField()
  class Meta:
    model = AttributeValue
    fields = ['attribute', 'value']

class ProductSerializer(serializers.ModelSerializer):
  attributes = serializers.SerializerMethodField()
  class Meta:
    model = Product
    fields ="__all__"
    
  def get_attributes(self, obj):
    grouped = {} # Initial Empty Dict
    for attr in obj.attributes.select_related('attribute').all():
      attr_name = attr.attribute.name #Attribute Name e.g Size, Storage etc.
      attr_value = attr.value #Value eg. 36, 8GB, Red etc.
      if attr_name not in grouped: #Check if the attribute is already on group
        grouped[attr_name] = [] #Create a key with empty list
      grouped[attr_name].append(attr_value) #Append attribute value on attribute name
    return grouped 


class ProductLiteCartSerializer(serializers.ModelSerializer):
  class Meta:
    model = Product
    fields = ['name', 'image', 'slug', 'category', 'free_delivary', 'price']

class CartItemsSerializer(serializers.ModelSerializer):
  product = ProductLiteCartSerializer(read_only=True)
  class Meta:
    model = CartItems
    fields = "__all__"


class CartSerializer(serializers.ModelSerializer):
  cartItems = CartItemsSerializer(many=True, read_only=True)
  class Meta:
    model = Cart
    fields = ['id', 'user', 'cartItems']
    
    