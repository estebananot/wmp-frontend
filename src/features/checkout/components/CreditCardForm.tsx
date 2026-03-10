import React, { useState } from 'react';
import { PaymentInfo } from '../../../types';
import '../checkout-styles.css';

interface CreditCardFormProps {
  onSubmit: (data: PaymentInfo) => void;
  onBack: () => void;
  loading?: boolean;
}

const detectCardType = (number: string): 'visa' | 'mastercard' | null => {
  const cleaned = number.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
  return null;
};

export const CreditCardForm: React.FC<CreditCardFormProps> = ({ onSubmit, onBack, loading }) => {
  const [formData, setFormData] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardType: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [expiryInput, setExpiryInput] = useState('');

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').substr(0, 19) : '';
  };

  const formatExpiry = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      const month = cleaned.slice(0, 2);
      const year = cleaned.slice(2, 4);
      return `${month}${year ? '/' + year : ''}`;
    }
    return cleaned;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      setFormData(prev => ({ ...prev, cardNumber: formattedValue, cardType: detectCardType(formattedValue) }));
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substr(0, 4);
      setFormData(prev => ({ ...prev, cvv: formattedValue }));
    } else if (name === 'cardHolder') {
      formattedValue = value.toUpperCase();
      setFormData(prev => ({ ...prev, cardHolder: formattedValue }));
    } else if (name === 'expiry') {
      const formattedExpiry = formatExpiry(value);
      setExpiryInput(formattedExpiry);
      
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        const month = cleaned.slice(0, 2);
        const year = cleaned.slice(2, 4);
        setFormData(prev => ({ ...prev, expiryMonth: month, expiryYear: year }));
      } else {
        setFormData(prev => ({ ...prev, expiryMonth: cleaned, expiryYear: '' }));
      }
    }

    setTouched(prev => ({ ...prev, [name]: true }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'cardNumber':
        const cleaned = value.replace(/\s/g, '');
        if (!cleaned) return 'Número requerido';
        if (cleaned.length < 13) return 'Mínimo 13 dígitos';
        if (cleaned.length > 19) return 'Máximo 19 dígitos';
        return '';
      case 'cardHolder':
        if (!value.trim()) return 'Nombre requerido';
        if (value.trim().length < 2) return 'Nombre muy corto';
        return '';
      case 'expiry':
        const month = formData.expiryMonth;
        const year = formData.expiryYear;
        if (!month || !year) return 'Fecha requerida';
        const monthNum = parseInt(month, 10);
        if (monthNum < 1 || monthNum > 12) return 'Mes inválido (01-12)';
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        const yearNum = parseInt(year, 10);
        if (yearNum < currentYear) return 'Año inválido';
        if (yearNum === currentYear && monthNum < currentMonth) return 'Tarjeta vencida';
        return '';
      case 'cvv':
        if (!value) return 'CVC requerido';
        if (value.length < 3) return 'Mínimo 3 dígitos';
        return '';
      default:
        return '';
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const fields = ['cardNumber', 'cardHolder', 'expiry', 'cvv'];
    fields.forEach((key) => {
      let value = '';
      if (key === 'cardNumber') value = formData.cardNumber;
      else if (key === 'cardHolder') value = formData.cardHolder;
      else if (key === 'expiry') value = expiryInput;
      else if (key === 'cvv') value = formData.cvv;
      
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      cardNumber: true,
      cardHolder: true,
      expiry: true,
      cvv: true,
    });

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      onSubmit({
        ...formData,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
      });
    }
  };

  const getCardBrandLogo = () => {
    if (formData.cardType === 'visa') {
      return (
        <div className="card-brand-logo card-brand-logo--visa">
          VISA
        </div>
      );
    }
    if (formData.cardType === 'mastercard') {
      return (
        <div className="card-brand-logo card-brand-logo--mastercard">
          <span className="mc-circle mc-circle--red"></span>
          <span className="mc-circle mc-circle--orange"></span>
        </div>
      );
    }
    return null;
  };

  const formatCardDisplay = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.length === 0) return '#### #### #### ####';
    const groups = cleaned.padEnd(16, '#').match(/.{1,4}/g) || [];
    return groups.join(' ');
  };

  const getCardBackground = () => {
    if (formData.cardType === 'visa') {
      return 'card-preview--visa';
    }
    if (formData.cardType === 'mastercard') {
      return 'card-preview--mastercard';
    }
    return 'card-preview--default';
  };

  return (
    <form onSubmit={handleSubmit} className="credit-card-form">
      <div className="credit-card-form__header">
        <h3 className="credit-card-form__title">Datos de Pago</h3>
      </div>

      <div className="card-preview-container">
        <div className={`card-preview ${getCardBackground()}`}>
          <div className="card-preview__chip">
            <div className="chip-line"></div>
            <div className="chip-line"></div>
            <div className="chip-line"></div>
            <div className="chip-line"></div>
          </div>
          
          <div className="card-preview__number">
            {formatCardDisplay(formData.cardNumber)}
          </div>
          
          <div className="card-preview__footer">
            <div className="card-preview__holder">
              <span className="card-preview__label">TITULAR</span>
              <span className="card-preview__value">{formData.cardHolder || 'NOMBRE APELLIDO'}</span>
            </div>
            <div className="card-preview__expiry">
              <span className="card-preview__label">VENCE</span>
              <span className="card-preview__value">
                {formData.expiryMonth && formData.expiryYear 
                  ? `${formData.expiryMonth}/${formData.expiryYear}` 
                  : 'MM/YY'}
              </span>
            </div>
          </div>
          
          {getCardBrandLogo()}
        </div>
      </div>

      <div className="card-form-fields">
        <div className={`form-group ${errors.cardHolder && touched.cardHolder ? 'form-group--error' : ''}`}>
          <label className="form-label">Nombre del titular</label>
          <input
            type="text"
            name="cardHolder"
            className="form-input"
            placeholder="JUAN PEREZ"
            value={formData.cardHolder}
            onChange={handleChange}
            onBlur={() => setTouched(prev => ({ ...prev, cardHolder: true }))}
            autoComplete="cc-name"
          />
          {errors.cardHolder && touched.cardHolder && (
            <span className="form-error">{errors.cardHolder}</span>
          )}
        </div>

        <div className={`form-group ${errors.cardNumber && touched.cardNumber ? 'form-group--error' : ''}`}>
          <label className="form-label">Número de tarjeta</label>
          <input
            type="text"
            name="cardNumber"
            className="form-input"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={handleChange}
            onBlur={() => setTouched(prev => ({ ...prev, cardNumber: true }))}
            maxLength={19}
            autoComplete="cc-number"
          />
          {errors.cardNumber && touched.cardNumber && (
            <span className="form-error">{errors.cardNumber}</span>
          )}
        </div>

        <div className="form-row">
          <div className={`form-group ${errors.expiry && touched.expiry ? 'form-group--error' : ''}`}>
            <label className="form-label">Fecha de vencimiento</label>
            <input
              type="text"
              name="expiry"
              className="form-input"
              placeholder="MM/YY"
              value={expiryInput}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, expiry: true }))}
              maxLength={5}
            />
            {errors.expiry && touched.expiry && (
              <span className="form-error">{errors.expiry}</span>
            )}
          </div>

          <div className={`form-group ${errors.cvv && touched.cvv ? 'form-group--error' : ''}`}>
            <label className="form-label">CVC</label>
            <input
              type="text"
              name="cvv"
              className="form-input"
              placeholder="123"
              value={formData.cvv}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, cvv: true }))}
              maxLength={4}
              autoComplete="cc-csc"
            />
            {errors.cvv && touched.cvv && (
              <span className="form-error">{errors.cvv}</span>
            )}
          </div>
        </div>
      </div>

      <div className="credit-card-form__actions">
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          Atrás
        </button>
        <button type="submit" className="btn btn--success" disabled={loading}>
          {loading ? 'Procesando...' : 'Confirmar pago'}
        </button>
      </div>
    </form>
  );
};

export default CreditCardForm;
