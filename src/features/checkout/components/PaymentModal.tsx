import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../app/store';
import { setStep, setCustomerInfo, setDeliveryInfo, setPaymentInfo, processCheckout, clearCheckout } from '../checkoutSlice';
import { CustomerForm } from './CustomerForm';
import { DeliveryForm } from './DeliveryForm';
import { CreditCardForm } from './CreditCardForm';
import { SummaryBackdrop } from './SummaryBackdrop';
import { CustomerFormData, DeliveryInfo, PaymentInfo, Product } from '../../../types';
import { Button } from '../../common/components/Button';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

type Step = 'customer' | 'delivery' | 'payment' | 'summary' | 'processing' | 'complete';

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { step, loading, error, cart, customerInfo, deliveryInfo, paymentInfo } = useSelector((state: RootState) => state.checkout);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedCustomer = localStorage.getItem('checkout_customer');
      const savedDelivery = localStorage.getItem('checkout_delivery');
      
      if (savedCustomer) {
        dispatch(setCustomerInfo(JSON.parse(savedCustomer)));
      }
      if (savedDelivery) {
        dispatch(setDeliveryInfo(JSON.parse(savedDelivery)));
      }
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const quantity = cart.length > 0 ? cart.reduce((sum, item) => sum + item.quantity, 0) : 1;
  const subtotal = cart.length > 0 
    ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : product.price * quantity;
  const baseFee = 2000;
  const deliveryFee = 5000 * quantity;
  const total = subtotal + baseFee + deliveryFee;

  const handleCustomerSubmit = (data: CustomerFormData) => {
    dispatch(setCustomerInfo(data));
  };

  const handleDeliverySubmit = (data: DeliveryInfo) => {
    dispatch(setDeliveryInfo(data));
  };

  const handlePaymentSubmit = async (data: PaymentInfo) => {
    dispatch(setPaymentInfo(data));
    setShowSummary(true);
  };

  const handleConfirmPayment = async () => {
    if (!customerInfo || !deliveryInfo || !paymentInfo) return;

    const productId = cart.length > 0 ? cart[0].productId : product.id;
    const productName = cart.length > 0 ? cart[0].name : product.name;
    const productPrice = cart.length > 0 ? cart[0].price : product.price;
    const productImageUrl = cart.length > 0 ? cart[0].imageUrl : product.imageUrl;
    const qty = cart.length > 0 ? cart.reduce((sum, item) => sum + item.quantity, 0) : 1;

    try {
      await dispatch(processCheckout({
        productId,
        customerInfo,
        deliveryInfo,
        paymentInfo,
        quantity: qty,
        productName,
        productPrice,
        productImageUrl,
      })).unwrap();

      dispatch(clearCheckout());
      setShowSummary(false);
      onClose();
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  const handleClose = () => {
    setShowSummary(false);
    onClose();
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
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>×</button>
        
        <div className="payment-modal">
          <div className="payment-modal__header">
            <h2 className="payment-modal__title">Checkout</h2>
            <div className="payment-modal__steps">
              {steps.map((s, index) => (
                <div
                  key={s}
                  className={`payment-step ${
                    index <= currentStepIndex ? 'payment-step--active' : ''
                  } ${step === s ? 'payment-step--current' : ''}`}
                >
                  <span className="payment-step__number">{index + 1}</span>
                  <span className="payment-step__label">
                    {s === 'customer' ? 'Cliente' : s === 'delivery' ? 'Entrega' : 'Pago'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="payment-modal__body">
            {step === 'customer' && (
              <CustomerForm
                onSubmit={handleCustomerSubmit}
              />
            )}
            
            {step === 'delivery' && (
              <DeliveryForm
                onSubmit={handleDeliverySubmit}
                onBack={() => dispatch(setStep('customer'))}
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
              <div className="payment-modal__error">
                {error}
              </div>
            )}
          </div>

          {showSummary && (
            <SummaryBackdrop
              isOpen={showSummary}
              onClose={() => setShowSummary(false)}
              onConfirm={handleConfirmPayment}
              cart={cart.length > 0 ? cart : [{ productId: product.id, name: product.name, price: product.price, quantity: 1, imageUrl: product.imageUrl }]}
              totalQuantity={quantity}
              subtotal={subtotal}
              baseFee={baseFee}
              deliveryFee={deliveryFee}
              total={total}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
