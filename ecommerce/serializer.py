
from rest_framework import routers, serializers, viewsets
from .models import Product, AttributeValue, Cart, CartItems, Review, User, Category
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields =['username', 'first_name', 'last_name', 'role',]

class ProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields= ['username', 'first_name', 'last_name', 'email', 'role']

class CategorySerializer(serializers.ModelSerializer):
  class Meta:
    model = Category
    fields= "__all__"

class AttributeValueSerializer(serializers.ModelSerializer):
  attribute = serializers.StringRelatedField()
  class Meta:
    model = AttributeValue
    fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
  user = UserSerializer(read_only=True)
  class Meta:
    model = Review
    exclude = ['product']

class ProductSerializer(serializers.ModelSerializer):
  attributes_id = serializers.PrimaryKeyRelatedField(queryset=AttributeValue.objects.all(), source="attributes", many=True, write_only=True)
  attributes = serializers.SerializerMethodField()
  product_review = ReviewSerializer(many=True, read_only=True)
  category = serializers.SlugRelatedField(queryset=Category.objects.all(), slug_field="name")
  class Meta:
    model = Product
    fields ="__all__"

  def create(self, validated_data):
    attributes = validated_data.pop("attributes", [])
    product = Product.objects.create(**validated_data)
    product.attributes.set(attributes)
    return product
    
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


class RegisterUserSerializer(serializers.ModelSerializer):
  password1 = serializers.CharField(write_only=True)
  password2 = serializers.CharField(write_only=True)
  
  class Meta:
    model = User
    fields = ['username', 'email', 'password1', 'password2']

  def validate_email(self, value):
    if User.objects.filter(email__iexact=value).exists():
        raise serializers.ValidationError("This email address is already in use.")
    return value

  def validate(self, attrs):
    if attrs['password1'] != attrs['password2']:
      raise serializers.ValidationError("Password don't match")
    return attrs
      
  def create(self, validated_data):
    user = User.objects.create(username=validated_data['username'], email=validated_data['email'])
    user.set_password(validated_data['password1'])
    user.save()
    return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
  def validate(self, attrs):
    data = super().validate(attrs)
    data['user'] = {
      'id': self.user.id,
      'username': self.user.username,
      'email': self.user.email
    }
    return data
    
    