
import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Cookie, Star, ShoppingBag } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore';
import { checkIsAdmin } from './admin';
import Header from './Header';
import Footer from './Footer';
import ProductModal from './ProductModal';
import ScrollToTop from './ScrollToTop';
import ProtectedRoute from './ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const MyAccount = lazy(() => import('./pages/MyAccount'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AllReviewsPage = lazy(() => import('./pages/AllReviewsPage'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Orders = lazy(() => import('./pages/Orders'));
const Users = lazy(() => import('./pages/Users'));
const DataDeletion = lazy(() => import('./pages/DataDeletion'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const LegalInfo = lazy(() => import('./pages/LegalInfo'));
const DisclaimerPage = lazy(() => import('./DisclaimerPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const GrantAdmin = lazy(() => import('./pages/GrantAdmin'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const App = () => {
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleFlavorsClick = () => {
    if (location.pathname === '/') {
      const element = document.getElementById('catalog-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/?scroll=catalog', { state: { scrollTo: 'catalog' } });
    }
  };

  useEffect(() => {
    let unsubscribeOrders;
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userIsAdmin = await checkIsAdmin(user);
        setIsAdmin(userIsAdmin);

        const ordersQuery = userIsAdmin
          ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
          : query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));

        unsubscribeOrders = onSnapshot(ordersQuery, (querySnapshot) => {
          const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(ordersData);
        }, (error) => {
          console.error("Error fetching orders in App: ", error);
        });
      } else {
        setIsAdmin(false);
        setOrders([]);
        if (unsubscribeOrders) unsubscribeOrders();
      }
      setLoading(false);
    });
    return () => {
      unsubscribeAuth();
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMenuOpen]);

  const addToCart = (product, option, quantity = 1) => {
    if (!product || !option) return;

    let isUpdated = false;
    setCart((prevCart) => {
      const cartItemId = `${product.id}-${option.box}`;
      const existingItem = prevCart.find((item) => item.id === cartItemId);

      if (existingItem) {
        isUpdated = true;
        return prevCart.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            ...product,
            id: cartItemId,
            macaron: product,
            quantity,
            option,
          },
        ];
      }
    });

    toast.success(
      isUpdated
        ? `Updated ${product.name} in cart! 🛒`
        : `${product.name} added to cart! 🎉`,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const removeFromCart = (itemToRemove) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== itemToRemove.id)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openProductModal = (product, option) => {
    setSelectedProduct({ macaron: product, option });
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`app-wrapper ${isMenuOpen ? 'menu-open' : ''}`}>
      <ScrollToTop />
      <div className="app">
        <Header
          user={user}
          cart={cart}
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
          closeMenu={closeMenu}
        />
        <main className="app-container">
          <Suspense fallback={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
              fontSize: '1.2rem',
              color: '#e75480'
            }}>
              Loading...
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home onAddToCart={addToCart} onSelectMacaron={openProductModal} cart={cart} />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart cart={cart} onRemoveItem={removeFromCart} onClearCart={clearCart} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/my-account" element={<ProtectedRoute user={user}><MyAccount user={user} /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute user={user}><MyOrders user={user} orders={orders} isAdmin={isAdmin} /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute user={user} adminOnly><Dashboard orders={orders} /></ProtectedRoute>} />
              <Route path="/all-reviews" element={<ProtectedRoute user={user} adminOnly><AllReviewsPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute user={user} adminOnly><Orders orders={orders} /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute user={user} adminOnly><Users orders={orders} /></ProtectedRoute>} />
              <Route path="/data-deletion" element={<DataDeletion />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<LegalInfo />} />
              <Route path="/disclaimer" element={<DisclaimerPage user={user} onClearCart={clearCart} />} />
              <Route path="/grant-admin" element={<GrantAdmin />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        
        {/* Mobile Sticky Bottom Navigation Bar */}
        <div className="mobile-sticky-nav-bar">
          <button 
            className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}
            onClick={handleFlavorsClick}
          >
            <div className="mobile-nav-icon-wrapper">
              <Cookie size={20} />
            </div>
            <span>Flavors</span>
          </button>

          <button 
            className={`mobile-nav-item ${location.pathname === '/contact' ? 'active' : ''}`}
            onClick={() => navigate('/contact')}
          >
            <div className="mobile-nav-icon-wrapper">
              <Star size={20} />
            </div>
            <span>Custom</span>
          </button>

          <button 
            className={`mobile-nav-item ${location.pathname === '/cart' ? 'active' : ''}`}
            onClick={() => navigate('/cart')}
          >
            <div className="mobile-nav-icon-wrapper">
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="mobile-nav-badge">{cartItemsCount}</span>
              )}
            </div>
            <span>Cart</span>
          </button>
        </div>

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            show={true}
            onClose={closeProductModal}
            onAddToCart={addToCart}
          />
        )}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default App;
