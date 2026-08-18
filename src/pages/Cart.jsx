import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiMapPin, FiTruck, FiChevronRight } from 'react-icons/fi';
import ConfirmationModal from '../ConfirmationModal';
import '../ConfirmationModal.css';
import './Cart.css';

const Cart = ({ cart = [], onRemoveItem, onClearCart }) => {
  const [deliveryOption, setDeliveryOption] = useState('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
  const navigate = useNavigate();

  const macaronsTotal = cart.reduce(
    (acc, item) => acc + item.option.price * item.quantity,
    0
  );

  const deliveryFee =
    deliveryOption === 'cbd' ? 400 : deliveryOption === 'outside-cbd' ? 1000 : 0;
  const grandTotal = macaronsTotal + deliveryFee;

  const handleProceedToCheckout = () => {
    if (deliveryOption !== 'pickup' && !deliveryAddress.trim()) {
      alert("Please enter a delivery address.");
      return;
    }
    navigate('/disclaimer', {
      state: {
        cart,
        deliveryOption,
        deliveryAddress,
        deliveryFee,
        macaronsTotal,
        grandTotal,
      },
    });
  };

  const showConfirmation = (action, item = null) => {
    setConfirmationAction(action);
    setItemToRemove(item);
    setIsConfirmationVisible(true);
  };

  const hideConfirmation = () => {
    setIsConfirmationVisible(false);
    setConfirmationAction(null);
    setItemToRemove(null);
  };

  const handleConfirm = () => {
    if (confirmationAction === 'clear') {
      onClearCart();
    } else if (confirmationAction === 'remove') {
      onRemoveItem(itemToRemove);
    }
    hideConfirmation();
  };

  const cleanMacaronName = (name) => {
    if (name.includes("Gourmet White Chocolate Raspberry")) return "White Choc Raspberry";
    if (name.includes("Decadent Peanut Paste Snickers")) return "Snickers Peanut Paste";
    if (name.includes("Premium Pistachio")) return "Pistachio";
    if (name.includes("Zesty Lemon")) return "Lemon Ganache";
    if (name.includes("Rich Coffee & Salted Caramel")) return "Coffee Caramel";
    if (name.includes("Custom-Made")) return "Custom Crafted";
    if (name.includes("Assorted Macaron")) return "Assorted Flavors";
    if (name.includes("Vegan Macarons")) return "Vegan Delights";
    return name.split(" - ")[0];
  };

  return (
    <div className="cart-page-wrapper">
      <div className="cart-page-container">
        <h1 className="cart-page-title">Your Gourmet Selection</h1>
        <div className="boutique-divider" />

        {cart.length > 0 ? (
          <div className="cart-grid-layout">
            {/* Left side: Items */}
            <div className="cart-items-column">
              <div className="cart-items-card">
                <div className="card-header">
                  <h3>Selected Delicacies ({cart.reduce((a, b) => a + b.quantity, 0)} items)</h3>
                </div>
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-page-item">
                      <div className="item-details">
                        <p className="item-name">
                          {cleanMacaronName(item.macaron ? item.macaron.name : item.name)} 
                          <span className="item-box-tag">Box of {item.option.box}</span>
                        </p>
                        <p className="item-price-calc">
                          {item.quantity} x <span className="highlight-price">Ksh {item.option.price.toLocaleString()}</span>
                        </p>
                      </div>
                      <div className="item-actions">
                        <button
                          onClick={() => showConfirmation('remove', item)}
                          className="item-remove-button"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-card-footer">
                  <button
                    onClick={() => showConfirmation('clear')}
                    className="clear-cart-button"
                  >
                    Clear All Items
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: Checkout Summary & Options */}
            <div className="cart-summary-column">
              <div className="cart-summary-card">
                <div className="card-header">
                  <h3>Delivery &amp; Summary</h3>
                </div>
                
                {/* Delivery Options */}
                <div className="delivery-selection-block">
                  <p className="block-label">Choose your preference</p>
                  <div className="delivery-pills">
                    <button
                      className={`delivery-pill ${deliveryOption === 'pickup' ? 'active' : ''}`}
                      onClick={() => setDeliveryOption('pickup')}
                    >
                      <FiMapPin size={16} />
                      <div className="pill-info">
                        <span className="pill-title">Pickup</span>
                        <span className="pill-desc">Ksh 0</span>
                      </div>
                    </button>

                    <button
                      className={`delivery-pill ${deliveryOption === 'cbd' ? 'active' : ''}`}
                      onClick={() => setDeliveryOption('cbd')}
                    >
                      <FiTruck size={16} />
                      <div className="pill-info">
                        <span className="pill-title">In CBD</span>
                        <span className="pill-desc">Ksh 400</span>
                      </div>
                    </button>

                    <button
                      className={`delivery-pill ${deliveryOption === 'outside-cbd' ? 'active' : ''}`}
                      onClick={() => setDeliveryOption('outside-cbd')}
                    >
                      <FiTruck size={16} />
                      <div className="pill-info">
                        <span className="pill-title">Outside CBD</span>
                        <span className="pill-desc">Ksh 1,000</span>
                      </div>
                    </button>
                  </div>

                  {deliveryOption !== 'pickup' && (
                    <div className="address-input-wrapper">
                      <label htmlFor="cartAddress">Delivery Address</label>
                      <textarea
                        id="cartAddress"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Provide your detailed delivery directions..."
                        rows="3"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Total calculations */}
                <div className="summary-calculation-block">
                  <div className="calc-row">
                    <span>Macarons Total:</span>
                    <span>Ksh {macaronsTotal.toLocaleString()}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="calc-row">
                      <span>Delivery Fee:</span>
                      <span>Ksh {deliveryFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="calc-row grand-total-row">
                    <span>Grand Total:</span>
                    <span className="grand-price">Ksh {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="proceed-checkout-button"
                >
                  Proceed to Checkout <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart-view">
            <div className="empty-cart-icon">
              <FiShoppingBag size={48} />
            </div>
            <h2>Your basket is empty</h2>
            <p>Indulge yourself with Kenya's finest Parisian delicacies.</p>
            <Link to="/" className="browse-boutique-btn">
              Browse Boutique
            </Link>
          </div>
        )}
      </div>

      <ConfirmationModal
        show={isConfirmationVisible}
        onClose={hideConfirmation}
        onConfirm={handleConfirm}
        title={confirmationAction === 'clear' ? "Clear Selection" : "Remove Macaron"}
        message={
          confirmationAction === 'clear'
            ? "Are you sure you want to clear your current selection?"
            : `Are you sure you want to remove ${itemToRemove?.macaron ? itemToRemove?.macaron.name : itemToRemove?.name} from your selection?`
        }
      />
    </div>
  );
};

export default Cart;
