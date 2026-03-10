import React, { useState } from 'react';
import { Product } from '../../../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  cartQuantity, 
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart
}) => {
  const [quantity, setQuantity] = useState(1);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isLowStock = product.stock < 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;
  const isInCart = cartQuantity > 0;

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  const handleCartIncrease = () => {
    if (cartQuantity < product.stock) {
      onUpdateQuantity(product.id, cartQuantity + 1);
    }
  };

  const handleCartDecrease = () => {
    if (cartQuantity > 1) {
      onUpdateQuantity(product.id, cartQuantity - 1);
    } else {
      onRemoveFromCart(product.id);
    }
  };

  return (
    <div className={`product-card ${isOutOfStock ? 'product-card--out-of-stock' : ''}`}>
      <div className="product-card__image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-card__placeholder">
            <span>📦</span>
          </div>
        )}
        {isLowStock && (
          <span className="product-card__badge product-card__badge--low">
            ¡Últimas {product.stock}!
          </span>
        )}
        {isOutOfStock && (
          <span className="product-card__badge product-card__badge--out">
            Agotado
          </span>
        )}
      </div>

      <div className="product-card__content">
        <span className="product-card__category">
          {product.category}
        </span>
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        
        <div className="product-card__footer">
          <div className="product-card__price">
            <span className="product-card__price-value">{formatPrice(product.price)}</span>
            <span className="product-card__stock">
              {product.stock} {product.stock === 1 ? 'disponible' : 'disponibles'}
            </span>
          </div>
          
          {isInCart ? (
            <div className="product-card__quantity-controls">
              <button 
                className="quantity-btn"
                onClick={handleCartDecrease}
                disabled={isOutOfStock}
              >
                −
              </button>
              <span className="quantity-value">{cartQuantity}</span>
              <button 
                className="quantity-btn"
                onClick={handleCartIncrease}
                disabled={isOutOfStock || cartQuantity >= product.stock}
              >
                +
              </button>
            </div>
          ) : (
            <div className="product-card__add-section">
              <div className="product-card__quantity-selector">
                <button 
                  className="quantity-btn"
                  onClick={handleDecrease}
                  disabled={quantity <= 1 || isOutOfStock}
                >
                  −
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={handleIncrease}
                  disabled={quantity >= product.stock || isOutOfStock}
                >
                  +
                </button>
              </div>
              <button
                className="product-card__button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? 'Agotado' : 'Agregar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
