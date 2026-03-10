import React, { useEffect, useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const BASE_FEE = 2000;
const DELIVERY_FEE = 5000;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFeeTotal = DELIVERY_FEE * cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = subtotal + BASE_FEE + deliveryFeeTotal;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? 'cart-overlay--open' : ''}`}
        onClick={onClose}
      />
      <div className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}>
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Tu Carrito</h2>
          <button className="cart-drawer__close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-drawer__empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            <p>Tu carrito está vacío</p>
            <span>Agrega productos para continuar</span>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <div className="cart-item__placeholder">📦</div>
                    )}
                  </div>
                  <div className="cart-item__details">
                    <h4 className="cart-item__name">{item.name}</h4>
                    <p className="cart-item__price">{formatPrice(item.price)}</p>
                    <div className="cart-item__quantity">
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      >
                        -
                      </button>
                      <span className="cart-item__qty-value">{item.quantity}</span>
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-item__remove"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-drawer__summary">
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="cart-summary__row">
                <span>BaseFee</span>
                <span>{formatPrice(BASE_FEE)}</span>
              </div>
              <div className="cart-summary__row">
                <span>Delivery ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatPrice(deliveryFeeTotal)}</span>
              </div>
              <div className="cart-summary__divider" />
              <div className="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button className="cart-drawer__checkout">
                Ir a Pagar
              </button>

              <button
                className="cart-drawer__clear"
                onClick={onClearCart}
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
