import React from 'react';
import { Product, CartItem } from '../../../types';
import { ProductCard } from './ProductCard';
import { Loader } from '../../common/components/Loader';

interface ProductListProps {
  products: Product[];
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onRetry?: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  cart,
  loading,
  error,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="products-loading">
        <Loader />
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <div className="error-state">
          <span className="error-state__icon">⚠️</span>
          <h3 className="error-state__title">Error al cargar productos</h3>
          <p className="error-state__message">{error}</p>
          {onRetry && (
            <button className="error-state__button" onClick={onRetry}>
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="products-empty">
        <div className="empty-state">
          <span className="empty-state__icon">📭</span>
          <h3 className="empty-state__title">No hay productos</h3>
          <p className="empty-state__message">No hay productos disponibles en este momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => {
        const cartItem = cart.find(item => item.productId === product.id);
        const cartQuantity = cartItem ? cartItem.quantity : 0;
        
        return (
          <ProductCard 
            key={product.id} 
            product={product} 
            cartQuantity={cartQuantity}
            onAddToCart={onAddToCart}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveFromCart={onRemoveFromCart}
          />
        );
      })}
    </div>
  );
};

export default ProductList;
