import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../app/store';
import { useDispatch } from 'react-redux';
import { 
  setStep, 
  setCustomerInfo, 
  setDeliveryInfo, 
  setPaymentInfo, 
  processCheckout, 
  clearCheckout,
  updateQuantity,
  removeFromCart
} from '../checkoutSlice';
import { CustomerForm } from '../components/CustomerForm';
import { DeliveryForm } from '../components/DeliveryForm';
import { CreditCardForm } from '../components/CreditCardForm';
import { SummaryBackdrop } from '../components/SummaryBackdrop';
import { CustomerFormData, DeliveryInfo, PaymentInfo } from '../../../types';
import '../checkout-styles.css';

export const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { step, loading, error, cart, customerInfo, deliveryInfo, paymentInfo } = useSelector((state: RootState) => state.checkout);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  useEffect(() => {
    const savedCustomer = localStorage.getItem('checkout_customer');
    const savedDelivery = localStorage.getItem('checkout_delivery');
    
    if (savedCustomer) {
      dispatch(setCustomerInfo(JSON.parse(savedCustomer)));
    }
    if (savedDelivery) {
      dispatch(setDeliveryInfo(JSON.parse(savedDelivery)));
    }
  }, [dispatch]);

  if (cart.length === 0) {
    return null;
  }

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const baseFee = 2000;
  const deliveryFee = 5000 * totalQuantity;
  const total = subtotal + baseFee + deliveryFee;

  const handleCustomerSubmit = (data: CustomerFormData) => {
    dispatch(setCustomerInfo(data));
    dispatch(setStep('delivery'));
  };

  const handleDeliverySubmit = (data: DeliveryInfo) => {
    dispatch(setDeliveryInfo(data));
    dispatch(setStep('payment'));
  };

  const handlePaymentSubmit = async (data: PaymentInfo) => {
    dispatch(setPaymentInfo(data));
    setShowSummary(true);
  };

  const handleConfirmPayment = async () => {
    if (!customerInfo || !deliveryInfo || !paymentInfo || cart.length === 0) return;

    // For simplicity, we'll process the first item in cart
    const firstItem = cart[0];
    
    try {
      await dispatch(processCheckout({
        productId: firstItem.productId,
        customerInfo,
        deliveryInfo,
        paymentInfo,
        quantity: totalQuantity,
        productName: firstItem.name,
        productPrice: firstItem.price,
        productImageUrl: firstItem.imageUrl || '',
      })).unwrap();

      dispatch(clearCheckout());
      setShowSummary(false);
      navigate('/');
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  const handleBackToProducts = () => {
    navigate('/');
  };

  const handleQuantityIncrease = (productId: string, currentQuantity: number, stock: number) => {
    if (currentQuantity < stock) {
      dispatch(updateQuantity({ productId, quantity: currentQuantity + 1 }));
    }
  };

  const handleQuantityDecrease = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ productId, quantity: currentQuantity - 1 }));
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const steps = ['customer', 'delivery', 'payment'];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="page page--checkout">
      <header className="header">
        <div className="header__content">
          <button 
            className="header__back"
            onClick={handleBackToProducts}
          >
            ← Volver
          </button>
          <h1 className="header__title">Checkout</h1>
          <div className="header__spacer"></div>
        </div>
      </header>

      <main className="main">
        <div className="checkout">
          <div className="checkout__steps">
            {steps.map((s, index) => (
              <div
                key={s}
                className={`checkout-step ${
                  index <= currentStepIndex ? 'checkout-step--active' : ''
                } ${step === s ? 'checkout-step--current' : ''}`}
              >
                <span className="checkout-step__number">{index + 1}</span>
                <span className="checkout-step__label">
                  {s === 'customer' ? 'Cliente' : s === 'delivery' ? 'Entrega' : 'Pago'}
                </span>
              </div>
            ))}
          </div>

          <div className="checkout__content">
            {step === 'customer' && (
              <CustomerForm
                onSubmit={handleCustomerSubmit}
                initialData={customerInfo}
              />
            )}
            
            {step === 'delivery' && (
              <DeliveryForm
                onSubmit={handleDeliverySubmit}
                onBack={() => dispatch(setStep('customer'))}
                customerInfo={customerInfo}
              />
            )}
            
            {step === 'payment' && (
              <CreditCardForm
                onSubmit={handlePaymentSubmit}
                onBack={() => dispatch(setStep('delivery'))}
                loading={loading}
              />
            )}

            {error && (
              <div className="checkout__error">
                {error}
              </div>
            )}
          </div>

          <div className="checkout__summary">
            <h3 className="checkout__summary-title">Resumen</h3>
            
            {cart.map((item) => (
              <div key={item.productId} className="checkout__product">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="checkout__product-image" />
                )}
                <div className="checkout__product-info">
                  <h4>{item.name}</h4>
                  <p>{formatPrice(item.price)} × {item.quantity}</p>
                  <div className="checkout__quantity-controls">
                    <button 
                      className="checkout__quantity-btn"
                      onClick={() => handleQuantityDecrease(item.productId, item.quantity)}
                    >
                      −
                    </button>
                    <span className="checkout__quantity-value">{item.quantity}</span>
                    <button 
                      className="checkout__quantity-btn"
                      onClick={() => handleQuantityIncrease(item.productId, item.quantity, 999)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="checkout__totals">
              <div className="checkout__total-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="checkout__total-row">
                <span>Tarifa base</span>
                <span>{formatPrice(baseFee)}</span>
              </div>
              <div className="checkout__total-row">
                <span>Envío</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="checkout__total-row checkout__total-row--final">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {showSummary && (
          <SummaryBackdrop
            isOpen={showSummary}
            onClose={() => setShowSummary(false)}
            onConfirm={handleConfirmPayment}
            cart={cart}
            totalQuantity={totalQuantity}
            subtotal={subtotal}
            baseFee={baseFee}
            deliveryFee={deliveryFee}
            total={total}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
};

export default CheckoutPage;
