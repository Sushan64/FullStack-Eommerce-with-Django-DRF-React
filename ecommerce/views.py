
from django.shortcuts import render
from django.contrib.auth import update_session_auth_hash
from rest_framework.response import Response 
from . import models
from rest_framework.decorators import api_view
from . import serializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics, status, viewsets
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()
# Create your views here.
def home(request):
  
  return render(request, 'index.html')

@api_view(['GET'])
def productDetail(request, slug):
  product = models.Product.objects.get(slug=slug)
  product_serializer = serializer.ProductSerializer(product)
  return Response(product_serializer.data)


class CategoryPostView(generics.ListAPIView):
  serializer_class = serializer.ProductSerializer
  
  def get_queryset(self):
    category= self.kwargs.get('category')
    return models.Product.objects.filter(category__name=category)
    

class ProductAPI(generics.ListCreateAPIView):
  queryset = models.Product.objects.all()
  serializer_class = serializer.ProductSerializer

class CategoryAPIView(generics.ListAPIView):
  queryset = models.Category.objects.all()
  serializer_class = serializer.CategorySerializer
  pagination_class = None

class UserUploadedProduct(generics.ListAPIView):
  serializer_class = serializer.ProductSerializer
  
  def get_queryset(self):
    publisher = self.request.user
    return models.Product.objects.filter(publisher=publisher)


class AttributeAPIView(generics.ListAPIView):
  queryset = models.AttributeValue.objects.all()
  serializer_class = serializer.AttributeValueSerializer
  pagination_class = None

class AddReviewView(APIView):
  def post(self, request):
    product_id = request.data.get('product_id')
    comment = request.data.get('comment')
    rating = request.data.get('rating')
    product = models.Product.objects.get(id=product_id)
    review, new_created = models.Review.objects.get_or_create(user=request.user, product=product)
    if not new_created:
      review.comment = comment
      review.rating = rating
      review.save()
    
    review_serializer = serializer.ReviewSerializer(review)
    return Response(review_serializer.data)


class DeleteReviewView(APIView):
  permission_classes = [IsAuthenticated]
  def delete(self, request, id):
    try:
      deleted, _ = models.Review.objects.filter(id=id, user=request.user).delete()
      if deleted == 0:
        return Response({'success':False, 'error': 'Item Not Found or Access Denied'}, status=status.HTTP_404_NOT_FOUND)
      return Response({'success':True, 'message': 'Item Removed from Cart'}, status=200)
    except Exception as e:
      return Response({'success':False, 'error': f"Failed To Remove from Cart: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      


class AddToCartApiView(APIView):
  permission_classes = [IsAuthenticated]
  def post(self, request):
    product_id = request.data.get('product_id')
    quantity= int(request.data.get('quantity', 1))
    selected_attributes = request.data.get('selected_attributes', {})
    product = models.Product.objects.get(id=product_id)
    cart, _ = models.Cart.objects.get_or_create(user=request.user)
    item, new_created = models.CartItems.objects.get_or_create(cart=cart, product=product)
    item.selected_attributes = selected_attributes
    if not new_created:
      item.quantity += quantity
    item.save()
      
    cart_serializer = serializer.CartSerializer(cart)
    print(cart_serializer.data)
    return Response(cart_serializer.data)
    
  def get(self, request):
    print("Current user making request:", request.user)
    cart, _ = models.Cart.objects.get_or_create(user=request.user)
    cart_serializer = serializer.CartSerializer(cart)
    return Response(cart_serializer.data)

class CartItemDelete(APIView):
  permission_classes = [IsAuthenticated]
  
  def delete(self, request, id):
    try:
      deleted, _ = models.CartItems.objects.filter(id=id, cart__user=request.user).delete()
      if deleted == 0:
        return Response({'success':False, 'error': 'Review Not Found or Access Denied'}, status=status.HTTP_404_NOT_FOUND)
      return Response({'success':True, 'message': 'Review Removed'}, status=200)
    except Exception as e:
      return Response({'success':False, 'error': f"Failed To Remove your review: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegisterView(generics.CreateAPIView):
  permission_classes = [AllowAny]
  query_set = User.objects.all()
  serializer_class = serializer.RegisterUserSerializer

class CustomLoginView(TokenObtainPairView):
  serializer_class = serializer.CustomTokenObtainPairSerializer

class LogoutView(APIView):
  def post(self, request):
    try:
      refresh_token = request.data.get('refresh')
      token = RefreshToken(refresh_token)
      token.blacklist()
      return Response(status=status.HTTP_205_RESET_CONTENT)
    except Exception:
      return Response(status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
  def get(self, request):
    user_serializer = serializer.ProfileSerializer(request.user)
    return Response(user_serializer.data)
    
  def post(self, request):
    user = request.user
    username= request.data.get('username')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    email = request.data.get('email')
    
    user.username = username or user.username
    user.first_name = first_name or user.first_name
    user.last_name = last_name or user.last_name
    user.email = email or user.email
    user.save()
    return Response({'success':True, 'message': 'Profile Update successfully!'}, status=200)


class ChangePasswordView(APIView):
  def post(self, request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')
    
    if not user.check_password(old_password):
      return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
      
    if new_password != confirm_password:
      return Response({'error': "Password didn't match"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not new_password or len(new_password)<6:
      return Response({'error': 'New password must be at least 6 characters long'}, status=status.HTTP_400_BAD_REQUEST)
      
    user.set_password(new_password)
    user.save()
    update_session_auth_hash(request, user)
    return Response({'success': 'Password updated successfully;'})