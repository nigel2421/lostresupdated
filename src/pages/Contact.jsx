import { useState } from 'react';
import { 
  FaWhatsapp, 
  FaCalendarAlt, 
  FaPalette, 
  FaPrint, 
  FaPlus, 
  FaMinus, 
  FaMagic, 
  FaPenFancy 
} from 'react-icons/fa';
import { macaronFlavors } from '../data';
import './Contact.css';

const Contact = () => {
  const [activeTab, setActiveTab] = useState('customizer'); // 'customizer' or 'general'
  const [selectedPackage, setSelectedPackage] = useState('box12');
  const [bulkQuantity, setBulkQuantity] = useState(30);
  const [selectedFlavors, setSelectedFlavors] = useState(() => {
    const initial = {};
    macaronFlavors.forEach(f => {
      initial[f.id] = 0;
    });
    return initial;
  });
  
  const [customColor, setCustomColor] = useState('Soft Blush Pink & Gold');
  const [edibleLogo, setEdibleLogo] = useState(false);
  const [logoText, setLogoText] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // General inquiry state
  const [generalMessage, setGeneralMessage] = useState('');

  const packages = [
    { id: 'box6', name: 'Artisanal Gift Box (6 pcs)', size: 6, price: 1800, desc: 'Perfect for intimate gifting & tastings.' },
    { id: 'box12', name: 'Premium Pâtisserie Box (12 pcs)', size: 12, price: 3500, desc: 'Our most popular selection size.' },
    { id: 'tower30', name: 'Elegant Dessert Tower (30 pcs)', size: 30, price: 9000, desc: '3-tier acrylic display tower included.' },
    { id: 'tower50', name: 'Grand Celebration Tower (50 pcs)', size: 50, price: 14500, desc: '5-tier majestic showcase tower included.' },
    { id: 'bulk', name: 'Bespoke Custom Bulk Order', size: 'any', pricePerUnit: 280, desc: 'Create a custom quantity (Minimum 30 macarons).' },
  ];

  const handleGeneralContact = () => {
    const phoneNumber = '254723734211';
    const message = generalMessage.trim() 
      ? `Hello Los Tres Macarons! I'd like to get in touch: \n\n${generalMessage}`
      : "Hello Los Tres Macarons! I'd like to get in touch regarding your delicious macarons. 🧁✨";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFlavorQtyChange = (flavorId, increment) => {
    setSelectedFlavors(prev => {
      const currentVal = prev[flavorId] || 0;
      const newVal = Math.max(0, currentVal + increment);
      return {
        ...prev,
        [flavorId]: newVal
      };
    });
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

  // Calculations
  const packageDetail = packages.find(p => p.id === selectedPackage);
  const targetSize = packageDetail.size;
  const totalAllocated = Object.values(selectedFlavors).reduce((a, b) => a + b, 0);

  const basePrice = targetSize === 'any' 
    ? bulkQuantity * packageDetail.pricePerUnit 
    : packageDetail.price;

  const finalMacaronCount = targetSize === 'any' ? bulkQuantity : targetSize;
  const printFee = edibleLogo ? finalMacaronCount * 15 : 0;
  const grandTotal = basePrice + printFee;

  const handleCustomOrderSubmit = (e) => {
    e.preventDefault();
    
    // Format flavors list
    const flavorStrings = [];
    Object.entries(selectedFlavors).forEach(([id, qty]) => {
      if (qty > 0) {
        const flavor = macaronFlavors.find(m => m.id === parseInt(id));
        const name = flavor ? cleanMacaronName(flavor.name) : 'Macaron';
        flavorStrings.push(`- ${qty}x ${name}`);
      }
    });

    const message = `Hello Los Tres Macarons! 🧁✨

I would like to place a *Custom Macaron Order*:

*1. Selected Package:*
• ${packageDetail.name} (${finalMacaronCount} pieces)

*2. Flavour Selections:*
${flavorStrings.length > 0 ? flavorStrings.join('\n') : '• Baker\'s choice (assorted mix)'}

*3. Custom Art & Styling:*
• Colour Palette: ${customColor}
• Edible Logo Printing: ${edibleLogo ? `Yes (Text: "${logoText || 'Included with image link later'}")` : 'No'}

*4. Event & Delivery:*
• Event Date: ${eventDate || 'To be specified'}
• Custom Request: ${additionalNotes || 'None'}

*Calculated Total Price:* Ksh ${grandTotal.toLocaleString()}

Looking forward to confirming my booking details!`;

    const phoneNumber = '254723734211';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-header-container">
        <h1>Bespoke Special Orders</h1>
        <p className="contact-subtitle">Let us paint your events with the delicate, custom flavor of our Parisian art.</p>
        <div className="boutique-divider" />

        {/* Tab Switching controls */}
        <div className="contact-tabs">
          <button 
            className={`contact-tab-btn ${activeTab === 'customizer' ? 'active' : ''}`}
            onClick={() => setActiveTab('customizer')}
          >
            <FaMagic /> Custom Order Builder
          </button>
          <button 
            className={`contact-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <FaPenFancy /> General Inquiry
          </button>
        </div>
      </div>

      <div className="contact-content-container">
        {activeTab === 'customizer' ? (
          <form className="customizer-form" onSubmit={handleCustomOrderSubmit}>
            <div className="customizer-grid">
              
              {/* Left Column: Selections */}
              <div className="customizer-selections-card">
                
                {/* Step 1: Choose Package */}
                <div className="customizer-section">
                  <h3 className="section-title">1. Choose Celebration Package</h3>
                  <div className="package-options-grid">
                    {packages.map(p => (
                      <div 
                        key={p.id}
                        className={`package-option-card ${selectedPackage === p.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedPackage(p.id);
                          // Reset flavors if bulk vs fixed changes, optional
                        }}
                      >
                        <div className="package-radio-indicator" />
                        <div className="package-card-info">
                          <span className="package-name">{p.name}</span>
                          <span className="package-price">
                            {p.size === 'any' ? `Ksh ${p.pricePerUnit}/pc` : `Ksh ${p.price.toLocaleString()}`}
                          </span>
                          <p className="package-desc">{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedPackage === 'bulk' && (
                    <div className="bulk-qty-selector">
                      <label htmlFor="bulkQtyInput">Total Macarons Quantity (Minimum 30):</label>
                      <div className="bulk-input-controls">
                        <button 
                          type="button" 
                          onClick={() => setBulkQuantity(q => Math.max(30, q - 5))}
                          className="bulk-control-btn"
                        >
                          <FaMinus />
                        </button>
                        <input 
                          id="bulkQtyInput"
                          type="number" 
                          min="30"
                          value={bulkQuantity} 
                          onChange={(e) => setBulkQuantity(Math.max(30, parseInt(e.target.value) || 30))}
                        />
                        <button 
                          type="button" 
                          onClick={() => setBulkQuantity(q => q + 5)}
                          className="bulk-control-btn"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Flavor Breakdown */}
                <div className="customizer-section">
                  <div className="section-header-row">
                    <h3 className="section-title">2. Allocate Your Flavours</h3>
                    {targetSize !== 'any' && (
                      <span className={`allocation-badge ${totalAllocated === targetSize ? 'success' : ''}`}>
                        {totalAllocated} / {targetSize} allocated
                      </span>
                    )}
                  </div>
                  
                  {targetSize !== 'any' && (
                    <div className="allocation-progress-bar-container">
                      <div 
                        className={`allocation-progress-bar ${totalAllocated > targetSize ? 'over' : ''}`} 
                        style={{ width: `${Math.min(100, (totalAllocated / targetSize) * 100)}%` }} 
                      />
                    </div>
                  )}

                  {targetSize !== 'any' && (
                    <p className="allocation-help-text">
                      {totalAllocated < targetSize 
                        ? `Select ${targetSize - totalAllocated} more macarons, or leave unallocated for Baker's Choice assortments.`
                        : totalAllocated === targetSize 
                        ? 'Perfect! Your packaging box is fully customized.'
                        : `You have selected ${totalAllocated - targetSize} too many macarons for this box size.`}
                    </p>
                  )}

                  <div className="flavor-allocator-list">
                    {macaronFlavors.map(flavor => {
                      const qty = selectedFlavors[flavor.id] || 0;
                      return (
                        <div key={flavor.id} className="flavor-allocator-item">
                          <img 
                            src={flavor.image} 
                            alt={flavor.name} 
                            className="flavor-allocator-img"
                          />
                          <div className="flavor-allocator-details">
                            <span className="flavor-allocator-name">{cleanMacaronName(flavor.name)}</span>
                            <span className="flavor-allocator-cat">{flavor.category}</span>
                          </div>
                          <div className="flavor-allocator-controls">
                            <button 
                              type="button"
                              onClick={() => handleFlavorQtyChange(flavor.id, -1)}
                              className="qty-btn"
                              disabled={qty === 0}
                              aria-label={`Decrease quantity of ${cleanMacaronName(flavor.name)}`}
                            >
                              <FaMinus size={13} />
                            </button>
                            <span className="qty-value">{qty}</span>
                            <button 
                              type="button"
                              onClick={() => handleFlavorQtyChange(flavor.id, 1)}
                              className="qty-btn"
                              disabled={targetSize !== 'any' && totalAllocated >= targetSize}
                              aria-label={`Increase quantity of ${cleanMacaronName(flavor.name)}`}
                            >
                              <FaPlus size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Custom Styling, Dates & Dynamic Pricing Card */}
              <div className="customizer-options-column">
                
                {/* Styling Details Card */}
                <div className="customizer-options-card">
                  <h3 className="section-title">3. Styling &amp; Theme</h3>
                  
                  <div className="option-input-field">
                    <label htmlFor="customColorSelect">
                      <FaPalette className="input-icon" /> Color Theme or Palette
                    </label>
                    <select 
                      id="customColorSelect"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                    >
                      <option value="Soft Blush Pink & Gold">Soft Blush Pink &amp; Gold</option>
                      <option value="Lavender Mist & Silver">Lavender Mist &amp; Silver</option>
                      <option value="Mint Green & Pearl White">Mint Green &amp; Pearl White</option>
                      <option value="Unicorn Pastel Swirl">Unicorn Pastel Swirl</option>
                      <option value="Corporate Custom Branding">Corporate Custom Branding (Attach link/details)</option>
                      <option value="Gender Reveal Mix (Pink & Blue)">Gender Reveal Mix (Pink &amp; Blue)</option>
                    </select>
                  </div>

                  <div className="option-checkbox-field">
                    <label className="checkbox-label-container">
                      <input 
                        type="checkbox"
                        checked={edibleLogo}
                        onChange={(e) => setEdibleLogo(e.target.checked)}
                      />
                      <span className="checkmark" />
                      <span className="checkbox-text">
                        <FaPrint className="input-icon" /> Include Custom Edible Logo/Text Print (+Ksh 15 / pc)
                      </span>
                    </label>
                  </div>

                  {edibleLogo && (
                    <div className="option-input-field text-input-animation">
                      <label htmlFor="logoText">Short Printed Text / Message</label>
                      <input 
                        id="logoText"
                        type="text"
                        value={logoText}
                        onChange={(e) => setLogoText(e.target.value)}
                        placeholder="e.g. 'HAPPY BIRTHDAY', 'N & J 2026'"
                        maxLength="25"
                      />
                    </div>
                  )}

                  <div className="option-input-field">
                    <label htmlFor="eventDatePicker">
                      <FaCalendarAlt className="input-icon" /> Preferred Event Date
                    </label>
                    <input 
                      id="eventDatePicker"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="option-input-field">
                    <label htmlFor="specialInstructions">Special Instructions or Custom Requests</label>
                    <textarea 
                      id="specialInstructions"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="e.g. 'I will send our high-res corporate logo via chat', 'Need dietary vegan boxes kept completely separate'"
                      rows="3"
                    />
                  </div>
                </div>

                {/* Live Dynamic Costing Display */}
                <div className="live-costing-card">
                  <h4>Custom Order Summary</h4>
                  <div className="costing-row-divider" />
                  
                  <div className="costing-list">
                    <div className="costing-row">
                      <span>{packageDetail.name}</span>
                      <span>Ksh {basePrice.toLocaleString()}</span>
                    </div>
                    {edibleLogo && (
                      <div className="costing-row text-highlight-pink">
                        <span>Edible Logo Printing ({finalMacaronCount} pcs @ Ksh 15)</span>
                        <span>+ Ksh {printFee.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="costing-row-divider" />
                    <div className="costing-row grand-total-row">
                      <span>Total Estimated Cost</span>
                      <span className="grand-total-price">Ksh {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="customizer-whatsapp-submit"
                  >
                    <FaWhatsapp size={20} /> Order custom via WhatsApp
                  </button>
                  <p className="order-disclaimer-text">
                    *Taxes included. Complete delivery costs inside or outside Nairobi CBD will be added upon scheduling.
                  </p>
                </div>

              </div>
            </div>
          </form>
        ) : (
          <div className="general-inquiry-container">
            <div className="general-inquiry-card">
              <h2>Let's Plan Your Dessert Table</h2>
              <p>For custom consultations, caterings, bulk gifts, or urgent inquiries, speak directly with our head pâtissier via WhatsApp.</p>
              
              <div className="inquiry-input-box">
                <label htmlFor="generalMessageArea">Your Message</label>
                <textarea
                  id="generalMessageArea"
                  value={generalMessage}
                  onChange={(e) => setGeneralMessage(e.target.value)}
                  placeholder="Tell us about your event, ideas, or questions..."
                  rows="5"
                />
              </div>

              <button 
                onClick={handleGeneralContact}
                className="general-whatsapp-submit"
              >
                <FaWhatsapp size={22} /> Speak to Pâtissier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
