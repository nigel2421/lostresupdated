import { useState, useEffect, useRef, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Cookie, 
  Sparkles, 
  Leaf, 
  ArrowRight, 
  Check, 
  Compass, 
  ShoppingBag,
  Star
} from 'lucide-react';
import { macaronFlavors } from '../data';
import StarRating from '../components/StarRating';
import { MacaronSkeletonGrid } from '../components/MacaronSkeletonCard';
import './Home.css';

const Home = ({ onAddToCart, onSelectMacaron }) => {
  const navigate = useNavigate();

  const scrollToSection = (elementRef) => {
    if (elementRef && elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initialOptions = {};
    macaronFlavors.forEach((macaron) => {
      initialOptions[macaron.id] = macaron.options[0];
    });
    return initialOptions;
  });

  // Simulate initial catalog data fetch loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCatalogLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const catalogRef = useRef(null);
  const makeItYoursRef = useRef(null);

  const slides = [
    {
      image: '/images/macaron-slider-1.png',
      alt: 'Beautifully arranged artisanal macarons made with love',
    },
    {
      image: '/images/macaron-slider-5.png',
      alt: 'Gourmet macarons perfect for birthdays, weddings, and special events',
    },
    {
      image: '/images/macaron-slider-10.png',
      alt: 'Customizable macaron flavors and designs for your dream dessert',
    },
  ];

  // Rotate hero background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('scroll') === 'catalog' || location.state?.scrollTo === 'catalog') {
      setTimeout(() => {
        scrollToSection(catalogRef);
      }, 300);
    }
  }, [location.search, location.state]);



  const handleOptionChange = (macaronId, optionStr) => {
    const macaron = macaronFlavors.find((m) => m.id === macaronId);
    if (!macaron) return;
    const option = macaron.options.find(
      (opt) => JSON.stringify(opt) === optionStr
    );
    if (option) {
      setSelectedOptions((prev) => ({
        ...prev,
        [macaronId]: option,
      }));
    }
  };

  const handleAddToCartClick = (e, macaron) => {
    e.stopPropagation();
    const option = selectedOptions[macaron.id] || macaron.options[0];
    onAddToCart(macaron, option);
  };

  const handleCardClick = (macaron) => {
    const option = selectedOptions[macaron.id] || macaron.options[0];
    onSelectMacaron(macaron, option);
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

  const handleCategorySelect = (categoryName) => {
    const nextCategory = activeCategory === categoryName ? 'All' : categoryName;
    setIsCatalogLoading(true);
    setActiveCategory(nextCategory);
    setTimeout(() => {
      setIsCatalogLoading(false);
      scrollToSection(catalogRef);
    }, 300);
  };

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const filteredMacarons = activeCategory === 'All'
    ? macaronFlavors
    : macaronFlavors.filter((m) => m.category === activeCategory);

  return (
    <div className="home-page-container">
      {/* 1. Gourmet Hero Section */}
      <section className="gourmet-hero" id="hero-section">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="hero-slide-wrapper"
            style={{ display: index === currentSlide ? 'block' : 'none' }}
          >
            <div
              className="hero-bg-overlay"
              style={{ backgroundImage: `url(${slide.image})`, opacity: index === currentSlide ? 1 : 0 }}
              role="img"
              aria-label={slide.alt}
            />
          </div>
        ))}
        <div className="gourmet-hero-content">
          <h1>Handcrafted with Love</h1>
          
          <div className="gourmet-hero-card">
            <p>
              Experience the delicate crunch and melt-in-your-mouth perfection of our artisanal Parisian treats.
            </p>
          </div>

          <button className="gourmet-hero-button" onClick={() => scrollToSection(catalogRef)}>
            Shop Now <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* 2. Categories Quick Filter Tabs */}
      <section className="categories-tabs-section">
        <div className="categories-tabs-container">
          <div 
            className={`category-tab-card ${activeCategory === 'Classic Flavors' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('Classic Flavors')}
          >
            <div className="category-tab-icon">
              <Cookie size={20} />
            </div>
            <span className="category-tab-title">Classic</span>
          </div>

          <div 
            className={`category-tab-card ${activeCategory === 'Specialty Flavors' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('Specialty Flavors')}
          >
            <div className="category-tab-icon">
              <Sparkles size={20} />
            </div>
            <span className="category-tab-title">Specialty</span>
          </div>

          <div 
            className={`category-tab-card ${activeCategory === 'Vegan' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('Vegan')}
          >
            <div className="category-tab-icon">
              <Leaf size={20} />
            </div>
            <span className="category-tab-title">Vegan</span>
          </div>
        </div>
      </section>

      {/* 3. Boutique Signatures Catalog Section */}
      <section className="boutique-signatures-section" ref={catalogRef} id="catalog-section">
        <div className="boutique-signatures-header">
          <h2>Boutique Signatures</h2>
          <div className="boutique-divider" />
          <p>
            Our most beloved flavor profiles, carefully curated for the perfect bite.
          </p>
        </div>

        <div className="boutique-flavors-grid">
          {isCatalogLoading ? (
            <MacaronSkeletonGrid count={filteredMacarons.length > 0 ? filteredMacarons.length : 6} />
          ) : (
            filteredMacarons.map((macaron) => {
              const currentOption = selectedOptions[macaron.id] || macaron.options[0];
              const isBestseller = macaron.id === 1 || macaron.id === 3 || macaron.id === 5;
              const isImgLoaded = loadedImages[macaron.id];

              return (
                <div 
                  className="boutique-product-card" 
                  key={macaron.id}
                  onClick={() => handleCardClick(macaron)}
                >
                  <div className="product-image-container">
                    {!isImgLoaded && (
                      <div className="macaron-skeleton-image macaron-skeleton-pulse" />
                    )}
                    <img 
                      src={macaron.image} 
                      alt={macaron.alt || macaron.name} 
                      className="boutique-product-image"
                      onLoad={() => handleImageLoad(macaron.id)}
                      style={{ opacity: isImgLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
                    />
                    {isBestseller && (
                      <div className="bestseller-tag">Bestseller</div>
                    )}
                  </div>

                  <div className="product-info-container">
                    <h3 className="boutique-product-name">{cleanMacaronName(macaron.name)}</h3>
                    <p className="boutique-product-price">Ksh {macaron.price ? macaron.price.toLocaleString() : '300'}</p>
                    
                    <div className="product-rating-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                      <StarRating rating={macaron.averageRating || 5} />
                    </div>

                    <select
                      className="product-options-selector"
                      value={JSON.stringify(currentOption)}
                      onChange={(e) => handleOptionChange(macaron.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {macaron.options.map((option, idx) => (
                        <option key={idx} value={JSON.stringify(option)}>
                          Box of {option.box} @ Ksh {option.price.toLocaleString()}
                        </option>
                      ))}
                    </select>

                    <button 
                      className="boutique-add-button"
                      onClick={(e) => handleAddToCartClick(e, macaron)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {activeCategory !== 'All' && (
          <div className="view-all-flavors-container">
            <button 
              className="view-all-flavors-link"
              onClick={() => setActiveCategory('All')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View All Flavors
            </button>
          </div>
        )}
      </section>

      {/* 4. "Make It Yours" Custom Events Section */}
      <section className="make-it-yours-section" ref={makeItYoursRef}>
        <div className="make-it-yours-container">
          <div className="make-it-yours-images">
            <img 
              src="/images/custom-made.jpg" 
              alt="Custom printed macarons" 
              className="collage-img one"
            />
            <img 
              src="/images/assorted-flavors.jpg" 
              alt="Artisanal gift towers" 
              className="collage-img two"
            />
          </div>

          <div className="make-it-yours-content">
            <div className="special-events-tag">
              ✨ Special Events
            </div>
            <h2>Make It Yours</h2>
            <p>
              From custom printed logos for corporate events to elegantly wrapped gift towers for weddings. We bring your vision to life on our delicate canvas.
            </p>

            <div className="custom-features-list">
              <div className="custom-feature-item">
                <Check className="custom-feature-icon" size={18} />
                <span>Custom edible printing available</span>
              </div>
              <div className="custom-feature-item">
                <Check className="custom-feature-icon" size={18} />
                <span>Bespoke flavor development</span>
              </div>
              <div className="custom-feature-item">
                <Check className="custom-feature-icon" size={18} />
                <span>Artisanal packaging options</span>
              </div>
            </div>

            <button 
              className="inquire-button"
              onClick={() => navigate('/contact')}
            >
              Inquire Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
