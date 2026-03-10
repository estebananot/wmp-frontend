import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { RootState } from '../../../app/store';
import { setHistory, setHistoryLoading, setHistoryError } from '../transactionSlice';
import { transactionsService } from '../../../services/transactionsService';
import { Button } from '../../common/components/Button';

export const HistoryPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { history, historyLoading, historyError } = useSelector(
    (state: RootState) => state.transaction
  );

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    dispatch(setHistoryLoading(true));
    dispatch(setHistoryError(null));
    try {
      const transactions = await transactionsService.getAll();
      dispatch(setHistory(transactions));
    } catch (err: any) {
      dispatch(setHistoryError(err.message || 'Error al cargar historial'));
    } finally {
      dispatch(setHistoryLoading(false));
    }
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="history-badge history-badge--success">✓ Aprobado</span>;
      case 'DECLINED':
        return <span className="history-badge history-badge--error">✗ Rechazado</span>;
      case 'PENDING':
        return <span className="history-badge history-badge--pending">⏳ Pendiente</span>;
      default:
        return <span className="history-badge history-badge--error">Error</span>;
    }
  };

  return (
    <div className="page page--history">
      <header className="header">
        <div className="header__content">
          <Link to="/" className="header__back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="header__title">Historial de Transacciones</h1>
        </div>
      </header>

      <main className="main">
        {historyLoading && (
          <div className="history-loading">
            <div className="status-card__spinner" />
            <p>Cargando historial...</p>
          </div>
        )}

        {historyError && (
          <div className="history-error">
            <p>{historyError}</p>
            <Button variant="secondary" onClick={fetchHistory}>
              Reintentar
            </Button>
          </div>
        )}

        {!historyLoading && !historyError && history.length === 0 && (
          <div className="history-empty">
            <span className="history-empty__icon">📋</span>
            <h3>No hay transacciones</h3>
            <p>Aún no has realizado ninguna compra.</p>
            <Button onClick={() => navigate('/')}>
              Ver Productos
            </Button>
          </div>
        )}

        {!historyLoading && !historyError && history.length > 0 && (
          <div className="history-list">
            {history.map((tx) => (
              <div
                key={tx.id}
                className="history-item"
                onClick={() => navigate(`/transaction/${tx.id}/status`)}
              >
                <div className="history-item__header">
                  <span className="history-item__number">{tx.transactionNumber}</span>
                  {getStatusBadge(tx.status)}
                </div>
                <div className="history-item__body">
                  <span className="history-item__amount">{formatPrice(tx.totalAmount)}</span>
                  <span className="history-item__date">{formatDate(tx.createdAt)}</span>
                </div>
                <div className="history-item__arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
