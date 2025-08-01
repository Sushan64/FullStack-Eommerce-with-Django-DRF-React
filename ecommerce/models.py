from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

# Create your models here.

def auto_slug(instance):
  base_slug = slugify(instance.name)
  slug = base_slug
  num = 1
  while instance.__class__.objects.filter(slug=slug).exists():
    slug = f"{base_slug}-{num}"
    num+=1
  return slug

  
CHOICES = (
    ('Male', 'Male'),
    ('Female', 'Female'),
    ('Tech', 'Tech'),
    ('Electronic', 'Electronic'),
    ('Grocery', 'Grocery'),
    ('Cloth', 'Cloth'),
)

class Attribute(models.Model):
  name = models.CharField(max_length=100)
  def __str__(self):
    return self.name

class AttributeValue(models.Model):
  attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE)
  value = models.CharField(max_length=20)
  
  def clean(self):
    if self.value and self.attribute.name.lower() =='colors':
      if not self.value.startswith("#"):
        raise ValidationError({'value': 'Color value must start with "#" (hex code) and less the 6.'})
      if len(self.value) !=7:
        raise ValidationError('Hex code must be exactly 7 characters long  e.g. #123456')
        
      
  def __str__(self):
    return f"{self.attribute}:{self.value}"

class Product(models.Model):
  name = models.CharField(max_length=100)
  image = models.ImageField(upload_to="image/")
  category = models.CharField(max_length=15, choices=CHOICES, null=True, blank=True)
  slug = models.SlugField(max_length=10, unique=True, blank=True)
  description = models.TextField()
  attributes = models.ManyToManyField(AttributeValue)
  free_delivary = models.BooleanField()
  price = models.IntegerField()
  
  def save(self, *args, **kwargs):
    if not self.slug:
      self.slug = auto_slug(self)
    super().save(*args, **kwargs)
    
  def __str__(self):
    return self.name


class Cart(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
  def __str__(self):
    return f"Cart: {self.user}"

class CartItems(models.Model):
  cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="cartItems")
  product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cartProduct")
  selected_attributes = models.JSONField(default=dict)
  quantity = models.PositiveIntegerField(default=1)
  def __str__(self):
    return f"CartItems {self.quantity}"