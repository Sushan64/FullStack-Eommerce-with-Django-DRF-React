from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response 
from . import models
from rest_framework.decorators import api_view
from . import serializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status

# Create your views here.
def home(request):
  return render(request, 'index.html')

@api_view(['GET'])
def productAPI(request):
  products = models.Product.objects.all()
  product_serializer = serializer.ProductSerializer(products, many=True)
  return Response(product_serializer.data)

@api_view(['GET'])
def categoryAPI(request, category):
  category= models.Product.objects.filter(category=category)
  category_seri = serializer.ProductSerializer(category, many=True)
  return Response(category_seri.data)

@api_view(['GET'])
def productDetail(request, slug):
  product = models.Product.objects.get(slug=slug)
  product_serializer = serializer.ProductSerializer(product)
  return Response(product_serializer.data)


class AddToCartApiView(APIView):
  permission_classes = [IsAuthenticated]
  def post(self, request):
    product_id = request.data.get('product_id')
    quantity= int(request.data.get('quantity', 1))
    selected_attributes = request.data.get('selected_attributes', {})
    product = models.Product.objects.get(id=product_id)
    cart, _ = models.Cart.objects.get_or_create(user=request.user)
    item, created = models.CartItems.objects.get_or_create(cart=cart, product=product)
    item.selected_attributes = selected_attributes
    if not created:
      item.quantity += quantity
      item.save()
      
    cart_serializer = serializer.CartSerializer(cart)
    print(cart_serializer.data)
    return Response(cart_serializer.data)
    
  def get(self, request):
    cart, _ = models.Cart.objects.get_or_create(user=request.user)
    cart_serializer = serializer.CartSerializer(cart)
    return Response(cart_serializer.data)


class CartItemDelete(APIView):
  permission_classes = [IsAuthenticated]
  authentication_class = [TokenAuthentication]
  def delete(self, request, id):
    try:
      deleted, _ = models.CartItems.objects.filter(id=id).delete()
      if deleted == 0:
        return Response({'success':False, 'failed': 'Item Not Found'}, status=status.HTTP_404_NOT_FOUND)
      return Response({'success':True, 'message': 'Item Removed from Cart'}, status=200)
    except Exception as e:
      return Response({'success':False, 'error': f"Failed To Remove from Cart: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      