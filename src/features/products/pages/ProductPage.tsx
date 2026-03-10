import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { RootState } from '../../../app/store';
import { setProducts, setLoading, setError } from '../../products/productsSlice';
import { 
  addToCart, 
  updateQuantity, 
  removeFromCart,
  setCurrentProduct, 
  clearCart, 
  setStep 
} from '../../checkout/checkoutSlice';
import { ProductList } from '../components/ProductList';
import { PaymentModal } from '../../checkout/components/PaymentModal';
import { Product } from '../../../types';
import { productsService } from '../../../services/productsService';

export const ProductPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading, error } = useSelector((state: RootState) => state.products);
  const { cart } = useSelector((state: RootState) => state.checkout);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [dispatch]);

  const fetchProducts = async () => {
    dispatch(setLoading(true));
    try {
      const data = await productsService.getProducts();
      dispatch(setProducts(data));
      dispatch(setError(null));
    } catch (err: any) {
      dispatch(setError(err.message || 'Error al cargar productos'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    dispatch(addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrl,
    }));
    dispatch(setCurrentProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    }));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      dispatch(setStep('customer'));
      navigate('/checkout');
    }
  };

  return (
    <div className="page page--products">
      <header className="header">
        <div className="header__content">
          <h1 className="header__title">Wompi Shop</h1>
          <div className="header__actions">
            <Link to="/history" className="header__history" title="Historial">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </Link>
            <button
              className="header__cart"
              onClick={handleCheckout}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
              {cart.length > 0 && (
                <span className="header__cart-badge">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="page__header">
          <h2 className="page__title">Productos</h2>
          <p className="page__subtitle">
            {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
          </p>
        </div>

        <ProductList
          products={products}
          cart={cart}
          loading={loading}
          error={error}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onRetry={fetchProducts}
        />
      </main>
    </div>
  );
};

export default ProductPage;
