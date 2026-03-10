import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { setTransactionId, setStatus, setLoading, setError, setPaymentStatus, resetTransaction, setTransactionResult } from '../transactionSlice';
import { transactionsService } from '../../../services/transactionsService';
import { Button } from '../../common/components/Button';

export const StatusPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, loading, error, transactionResult } = useSelector((state: RootState) => state.transaction);
  const [pollingCount, setPollingCount] = useState(0);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const fetchTransaction = async () => {
      dispatch(setLoading(true));
      dispatch(setTransactionId(id));

      try {
        const transaction = await transactionsService.getTransaction(id);
        dispatch(setPaymentStatus(transaction));
        dispatch(setTransactionResult(transaction));
        
        if (transaction.status === 'PENDING') {
          dispatch(setStatus('processing'));
          pollTransactionStatus(id);
        } else if (transaction.status === 'APPROVED') {
          dispatch(setStatus('completed'));
        } else if (transaction.status === 'DECLINED') {
          dispatch(setStatus('failed'));
        } else {
          dispatch(setStatus('failed'));
        }
      } catch (err: any) {
        dispatch(setError(err.message || 'Error al obtener transacción'));
        dispatch(setStatus('failed'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTransaction();

    return () => {
      dispatch(resetTransaction());
    };
  }, [id, dispatch, navigate]);

  const pollTransactionStatus = async (transactionId: string) => {
    const maxPolls = 30;
    const pollInterval = 2000;

    const poll = async () => {
      if (pollingCount >= maxPolls) {
        dispatch(setError('Timeout: No se pudo verificar el estado de la transacción'));
        return;
      }

      try {
        const transaction = await transactionsService.getTransaction(transactionId);
        dispatch(setPaymentStatus(transaction));
        dispatch(setTransactionResult(transaction));

        if (transaction.status === 'APPROVED') {
          dispatch(setStatus('completed'));
        } else if (transaction.status === 'DECLINED' || transaction.status === 'ERROR') {
          dispatch(setStatus('failed'));
        } else {
          setPollingCount(prev => prev + 1);
          setTimeout(poll, pollInterval);
        }
      } catch (err) {
        setPollingCount(prev => prev + 1);
        setTimeout(poll, pollInterval);
      }
    };

    setTimeout(poll, pollInterval);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !transactionResult) {
    return (
      <div className="page page--status">
        <div className="status-page">
          <div className="status-card status-card--loading">
            <div className="status-card__spinner" />
            <h2 className="status-card__title">Verificando transacción...</h2>
            <p className="status-card__message">Por favor espera mientras procesamos tu pago.</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="page page--status">
        <div className="status-page">
          <div className="status-card status-card--processing">
            <div className="status-card__spinner" />
            <h2 className="status-card__title">Procesando Pago</h2>
            <p className="status-card__message">Tu transacción está siendo procesada. Por favor espera...</p>
            <p className="status-card__id">ID: {id}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="page page--status">
        <div className="status-page">
          <div className="status-card status-card--error">
            <span className="status-card__icon">❌</span>
            <h2 className="status-card__title">Pago Fallido</h2>
            <p className="status-card__message">
              {error || 'Hubo un problema procesando tu pago. Por favor intenta de nuevo.'}
            </p>
            <div className="status-card__actions">
              <Button variant="secondary" onClick={() => navigate('/')}>
                Volver a Productos
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'completed' && transactionResult) {
    const tx = transactionResult as any;
    const totalAmount = tx?.totalAmount || 0;
    const transactionNumber = tx?.transactionNumber || id;
    const createdAt = tx?.createdAt || new Date().toISOString();

    return (
      <div className="page page--status">
        <div className="status-page status-page--success">
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="confetti" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)]
              }} />
            ))}
          </div>
          
          <div className="status-card status-card--success">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
            
            <h2 className="status-card__title">🎉 ¡Felicitaciones!</h2>
            <p className="status-card__subtitle">Tu compra ha sido exitosa</p>
            <p className="status-card__message">
              Recibirás un correo de confirmación con los detalles de tu pedido.
            </p>
            
            <div className="status-card__details">
              <div className="status-detail">
                <span className="status-detail__label">N° Transacción</span>
                <span className="status-detail__value status-detail__value--code">{transactionNumber}</span>
              </div>
              <div className="status-detail status-detail--highlight">
                <span className="status-detail__label">Total Pagado</span>
                <span className="status-detail__value status-detail__value--amount">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <div className="status-detail">
                <span className="status-detail__label">Estado</span>
                <span className="status-detail__badge status-detail__badge--success">
                  ✓ Aprobado
                </span>
              </div>
              <div className="status-detail">
                <span className="status-detail__label">Fecha</span>
                <span className="status-detail__value">
                  {formatDate(createdAt)}
                </span>
              </div>
            </div>

            <div className="status-card__actions">
              <Button onClick={() => navigate('/')}>
                Seguir Comprando
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StatusPage;
