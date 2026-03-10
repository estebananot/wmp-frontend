import React, { useState, useEffect } from 'react';
import { CustomerFormData } from '../../../types';
import '../checkout-styles.css';

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  initialData?: CustomerFormData | null;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    phoneNumber: initialData?.phoneNumber || localStorage.getItem('last_phone') || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return '';
      case 'email':
        if (!value.trim()) return 'El email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Formato de email inválido';
        return '';
      case 'phoneNumber':
        if (!value.trim()) return '';
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length < 10) return 'Mínimo 10 dígitos';
        if (!/^\+?[0-9]{10,15}$/.test(cleaned)) return 'Formato de teléfono inválido';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof CustomerFormData]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phoneNumber: true,
    });

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <div className="customer-form__header">
        <h3 className="customer-form__title">Información del Cliente</h3>
      </div>

      <div className={`form-group ${errors.fullName && touched.fullName ? 'form-group--error' : ''}`}>
        <label className="form-label">Nombre completo *</label>
        <input
          type="text"
          name="fullName"
          className="form-input"
          placeholder="Juan Pérez"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="name"
        />
        {errors.fullName && touched.fullName && (
          <span className="form-error">{errors.fullName}</span>
        )}
      </div>

      <div className={`form-group ${errors.email && touched.email ? 'form-group--error' : ''}`}>
        <label className="form-label">Email *</label>
        <input
          type="email"
          name="email"
          className="form-input"
          placeholder="juan@email.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
        />
        {errors.email && touched.email && (
          <span className="form-error">{errors.email}</span>
        )}
      </div>

      <div className={`form-group ${errors.phoneNumber && touched.phoneNumber ? 'form-group--error' : ''}`}>
        <label className="form-label">Teléfono</label>
        <input
          type="tel"
          name="phoneNumber"
          className="form-input"
          placeholder="300 123 4567"
          value={formData.phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="tel"
        />
        {errors.phoneNumber && touched.phoneNumber && (
          <span className="form-error">{errors.phoneNumber}</span>
        )}
      </div>

      <div className="customer-form__actions">
        <button type="submit" className="btn btn--primary btn--full">
          Continuar
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
