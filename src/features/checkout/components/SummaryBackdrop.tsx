import React from 'react';
import { CartItem } from '../../../types';
import '../checkout-styles.css';

interface SummaryBackdropProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cart: CartItem[];
  totalQuantity: number;
  subtotal: number;
  baseFee: number;
  deliveryFee: number;
  total: number;
  loading?: boolean;
}

export const SummaryBackdrop: React.FC<SummaryBackdropProps> = ({
  isOpen,
  onClose,
  onConfirm,
  cart,
  totalQuantity,
  subtotal,
  baseFee,
  deliveryFee,
  total,
  loading,
}) => {
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="summary-backdrop" onClick={onClose}>
      <div className="summary-content" onClick={(e) => e.stopPropagation()}>
        <div className="summary-header">
          <h3 className="summary-title">Resumen del Pedido</h3>
          <button className="summary-close" onClick={onClose}>×</button>
        </div>

        <div className="summary-body">
          {cart.map((item) => (
            <div key={item.productId} className="summary-product">
              <div className="summary-product__image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} />
                ) : (
                  <div className="summary-product__placeholder">📦</div>
                )}
              </div>
              <div className="summary-product__info">
                <h4 className="summary-product__name">{item.name}</h4>
                <p className="summary-product__qty">Cantidad: {item.quantity}</p>
              </div>
              <div className="summary-product__price">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}

          <div className="summary-divider" />

          <div className="summary-totals">
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Tarifa Base</span>
              <span className="summary-value">{formatPrice(baseFee)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Envío ({totalQuantity} {totalQuantity === 1 ? 'unidad' : 'unidades'})</span>
              <span className="summary-value">{formatPrice(deliveryFee)}</span>
            </div>
            
            <div className="summary-divider" />
            
            <div className="summary-row summary-row--total">
              <span className="summary-label">Total</span>
              <span className="summary-value summary-value--total">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="summary-notice">
            <p>Al confirmar, procesaremos el pago de {formatPrice(total)}</p>
          </div>
        </div>

        <div className="summary-actions">
          <button className="btn btn--secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="btn btn--success" onClick={onConfirm} disabled={loading}>
            {loading ? 'Procesando...' : 'Confirmar y pagar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryBackdrop;
