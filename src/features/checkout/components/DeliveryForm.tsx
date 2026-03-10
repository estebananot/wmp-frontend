import React, { useState, useEffect } from 'react';
import { DeliveryInfo, CustomerFormData } from '../../../types';
import '../checkout-styles.css';

interface DeliveryFormProps {
  onSubmit: (data: DeliveryInfo) => void;
  onBack: () => void;
  customerInfo?: CustomerFormData | null;
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({ onSubmit, onBack, customerInfo }) => {
  const [formData, setFormData] = useState<DeliveryInfo>({
    address: '',
    city: '',
    department: '',
    postalCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (customerInfo?.phoneNumber) {
      localStorage.setItem('last_phone', customerInfo.phoneNumber);
    }
  }, [customerInfo]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'address':
        if (!value.trim()) return 'La dirección es requerida';
        if (value.trim().length < 10) return 'La dirección debe tener al menos 10 caracteres';
        return '';
      case 'city':
        if (!value.trim()) return 'La ciudad es requerida';
        return '';
      case 'department':
        return '';
      case 'postalCode':
        if (value && !/^\d{4,10}$/.test(value)) return 'Código postal inválido';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof DeliveryInfo] || '');
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      address: true,
      city: true,
      department: true,
      postalCode: true,
    });

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      onSubmit(formData);
    }
  };

  const CITIES = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 
    'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Manizales',
    'Pasto', 'Neiva', 'Armenia', 'Popayán', 'Valledupar',
    'Montería', 'Sincelejo', 'Tunja', 'Florencia', 'Riohacha'
  ];

  return (
    <form onSubmit={handleSubmit} className="delivery-form">
      <div className="delivery-form__header">
        <h3 className="delivery-form__title">Dirección de Entrega</h3>
      </div>

      <div className={`form-group ${errors.address && touched.address ? 'form-group--error' : ''}`}>
        <label className="form-label">Dirección *</label>
        <input
          type="text"
          name="address"
          className="form-input"
          placeholder="Calle 123 #45-67, Barrio"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="street-address"
        />
        {errors.address && touched.address && (
          <span className="form-error">{errors.address}</span>
        )}
      </div>

      <div className={`form-group ${errors.city && touched.city ? 'form-group--error' : ''}`}>
        <label className="form-label">Ciudad *</label>
        <select
          name="city"
          className="form-input form-select"
          value={formData.city}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="address-level2"
        >
          <option value="">Seleccionar ciudad</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        {errors.city && touched.city && (
          <span className="form-error">{errors.city}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Departamento</label>
          <input
            type="text"
            name="department"
            className="form-input"
            placeholder="Cundinamarca"
            value={formData.department}
            onChange={handleChange}
            autoComplete="address-level1"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Código Postal</label>
          <input
            type="text"
            name="postalCode"
            className="form-input"
            placeholder="110111"
            value={formData.postalCode}
            onChange={handleChange}
            maxLength={10}
            autoComplete="postal-code"
          />
          {errors.postalCode && touched.postalCode && (
            <span className="form-error">{errors.postalCode}</span>
          )}
        </div>
      </div>

      <div className="delivery-form__actions">
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          Atrás
        </button>
        <button type="submit" className="btn btn--primary">
          Continuar
        </button>
      </div>
    </form>
  );
};

export default DeliveryForm;
