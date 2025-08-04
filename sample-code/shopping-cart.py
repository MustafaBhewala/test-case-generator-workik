"""
E-commerce shopping cart system with item management
Perfect for testing object-oriented Python code with various edge cases
"""

from datetime import datetime
from typing import Dict, List, Optional
import uuid

class CartItem:
    """Represents an item in the shopping cart"""
    
    def __init__(self, product_id: str, name: str, price: float, quantity: int = 1):
        if not product_id or not isinstance(product_id, str):
            raise ValueError("Product ID must be a non-empty string")
        
        if not name or not isinstance(name, str):
            raise ValueError("Product name must be a non-empty string")
            
        if price < 0:
            raise ValueError("Price cannot be negative")
            
        if quantity < 1:
            raise ValueError("Quantity must be at least 1")
        
        self.product_id = product_id
        self.name = name.strip()
        self.price = round(float(price), 2)
        self.quantity = int(quantity)
        self.added_at = datetime.now()
    
    def get_total_price(self) -> float:
        """Calculate total price for this item (price * quantity)"""
        return round(self.price * self.quantity, 2)
    
    def update_quantity(self, quantity: int) -> None:
        """Update the quantity of this item"""
        if quantity < 1:
            raise ValueError("Quantity must be at least 1")
        self.quantity = int(quantity)

class ShoppingCart:
    """Shopping cart that manages cart items"""
    
    def __init__(self, user_id: str):
        if not user_id or not isinstance(user_id, str):
            raise ValueError("User ID must be a non-empty string")
            
        self.user_id = user_id
        self.cart_id = str(uuid.uuid4())
        self.items: Dict[str, CartItem] = {}
        self.created_at = datetime.now()
        self.discount_percent = 0.0
        self.tax_rate = 0.08  # 8% tax rate
    
    def add_item(self, product_id: str, name: str, price: float, quantity: int = 1) -> None:
        """Add an item to the cart or update quantity if it exists"""
        if product_id in self.items:
            # Item exists, update quantity
            current_item = self.items[product_id]
            new_quantity = current_item.quantity + quantity
            current_item.update_quantity(new_quantity)
        else:
            # New item
            self.items[product_id] = CartItem(product_id, name, price, quantity)
    
    def remove_item(self, product_id: str) -> bool:
        """Remove an item from the cart"""
        if product_id in self.items:
            del self.items[product_id]
            return True
        return False
    
    def update_item_quantity(self, product_id: str, quantity: int) -> bool:
        """Update the quantity of a specific item"""
        if product_id not in self.items:
            return False
        
        if quantity < 1:
            # Remove item if quantity is 0 or negative
            return self.remove_item(product_id)
        
        self.items[product_id].update_quantity(quantity)
        return True
    
    def get_item(self, product_id: str) -> Optional[CartItem]:
        """Get a specific item from the cart"""
        return self.items.get(product_id)
    
    def get_all_items(self) -> List[CartItem]:
        """Get all items in the cart"""
        return list(self.items.values())
    
    def get_total_items(self) -> int:
        """Get total number of items in cart"""
        return sum(item.quantity for item in self.items.values())
    
    def get_subtotal(self) -> float:
        """Calculate subtotal (before discount and tax)"""
        return round(sum(item.get_total_price() for item in self.items.values()), 2)
    
    def apply_discount(self, discount_percent: float) -> None:
        """Apply a percentage discount to the cart"""
        if discount_percent < 0 or discount_percent > 100:
            raise ValueError("Discount must be between 0 and 100 percent")
        self.discount_percent = discount_percent
    
    def get_discount_amount(self) -> float:
        """Calculate the discount amount"""
        if self.discount_percent <= 0:
            return 0.0
        subtotal = self.get_subtotal()
        return round(subtotal * (self.discount_percent / 100), 2)
    
    def get_tax_amount(self) -> float:
        """Calculate tax amount (applied after discount)"""
        subtotal = self.get_subtotal()
        discount = self.get_discount_amount()
        taxable_amount = subtotal - discount
        return round(taxable_amount * self.tax_rate, 2)
    
    def get_total(self) -> float:
        """Calculate final total (subtotal - discount + tax)"""
        subtotal = self.get_subtotal()
        discount = self.get_discount_amount()
        tax = self.get_tax_amount()
        return round(subtotal - discount + tax, 2)
    
    def clear_cart(self) -> None:
        """Remove all items from the cart"""
        self.items.clear()
        self.discount_percent = 0.0
    
    def is_empty(self) -> bool:
        """Check if the cart is empty"""
        return len(self.items) == 0
    
    def get_cart_summary(self) -> Dict:
        """Get a summary of the cart"""
        return {
            'cart_id': self.cart_id,
            'user_id': self.user_id,
            'total_items': self.get_total_items(),
            'unique_products': len(self.items),
            'subtotal': self.get_subtotal(),
            'discount_percent': self.discount_percent,
            'discount_amount': self.get_discount_amount(),
            'tax_rate': self.tax_rate,
            'tax_amount': self.get_tax_amount(),
            'total': self.get_total(),
            'created_at': self.created_at.isoformat()
        }

def calculate_bulk_discount(cart: ShoppingCart) -> float:
    """Calculate bulk discount based on cart value"""
    subtotal = cart.get_subtotal()
    
    if subtotal >= 500:
        return 15.0  # 15% discount for $500+
    elif subtotal >= 200:
        return 10.0  # 10% discount for $200+
    elif subtotal >= 100:
        return 5.0   # 5% discount for $100+
    else:
        return 0.0   # No discount

def apply_loyalty_bonus(cart: ShoppingCart, loyalty_level: str) -> float:
    """Apply loyalty program bonus discount"""
    loyalty_discounts = {
        'bronze': 2.0,
        'silver': 5.0,
        'gold': 8.0,
        'platinum': 12.0
    }
    
    return loyalty_discounts.get(loyalty_level.lower(), 0.0)
