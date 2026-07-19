import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, Info, X } from 'lucide-react';
import { mockCakes } from '../utils/mockData';
import useCartStore, { WEIGHT_MULTIPLIERS } from '../store/useCartStore';
import useDocumentMetadata from '../hooks/useDocumentMetadata';

const FLAVOR_BASE_PRICES = {
  // Chocolate Cakes
  'Chocolate Oreo': 500,
  'Cafe Mocha': 500,
  'Dutch Truffle': 580,
  'Chocolate Blakcurrent': 580,
  'Chocolate Blackcurrent': 580,
  'Chocolate Blueberry': 580,
  'Chocolate Mango': 580,
  'Chocolate Strawberry': 580,
  'Chocolate Truffle': 600,
  'Chocolate Nutella': 700,

  // Classic Cakes
  'Plain Vanilla': 450,
  'Black Forest': 500,
  'Mango Cake': 500,
  'Strawberry': 500,
  'Pineapple': 500,
  'Blackcurrent': 500,
  'Butterscotch': 500,

  // Fusion Cakes
  'Rajbhog': 700,
  'Rasmalai': 750,
  'Gulab Jamun': 750,

  // Cheesecakes
  'Red Velvet Cheesecake': 700,
  'Blueberry Cheesecake': 700
};

const BENTO_FLAVOR_BASE_PRICES = {
  // Bento Cakes (Basic)
  'Vanilla': 300,
  'Blueberry': 300,
  'Black Forest': 300,
  'White Forest': 300,
  'Pineapple': 300,
  'Butterscotch': 300,
  'Strawberry': 300,
  // Bento Cakes (Premium)
  'Rasmalai': 380,
  'Chocolate Truffle': 350,
  'Red Velvet': 380,
  'Oreo': 300,
  'KitKat': 380,
  'Nutella': 350,
  'Biscoff': 380
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cake = mockCakes.find(c => c.id === id);
  const addToCart = useCartStore(state => state.addToCart);

  useDocumentMetadata(
    cake ? `${cake.name} | Order Online in Mumbai` : "Order Cake Online",
    cake ? `${cake.name} - Delicious eggless ${cake.flavor} cake from Kalpana's Cakes & Bakes. Order now for fresh delivery in Vikhroli East, Mumbai.` : "Order fresh, premium homemade cakes online."
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [isEggless, setIsEggless] = useState(true);
  const [nameOnCake, setNameOnCake] = useState('');
  const [message, setMessage] = useState('');
  const [instructions, setInstructions] = useState('');

  // Custom weight state
  const [isCustomWeight, setIsCustomWeight] = useState(false);
  const [customWeightValue, setCustomWeightValue] = useState(4);

  // Check if Bento Cake
  const isBento = cake && (cake.categoryGroup === 'Bento Cakes' || (cake.tags && cake.tags.includes('Bento Cakes')));
  const flavorPrices = isBento ? BENTO_FLAVOR_BASE_PRICES : FLAVOR_BASE_PRICES;

  // Disable flavor selection for specific cakes as requested
  const priceDependsOnFlavor = (() => {
    if (!cake) return true;

    const NO_FLAVOR_SELECT_CAKES = new Set([
      "chocolate truffle",
      "dutch truffle",
      "chocolate chocochips",
      "classic rasmalai",
      "royal gulab jamun",
      "dark glaze chocolate truffle",
      "golden jubilee truffle",
      "classic chocolate drip crown",
      "traditional rajbhog",
      "chocolate rocher",
      "spiderman city adventure",
      "chocolate nutella hazelnut",
      "ferrero rocher",
      "red velvet crumbs",
      "butterscotch",
      "mini chocolate bento",
      "choco glaze truffle",
      "18th birthday 2-tier chocolate overload",
      "chocolate drip birthday",
      "chocolate glaze mousse",
      "chocolate strawberry",
      "black forest",
      "white forest",
      "oreo",
      "chocolate hazelnut",
      "chocolate truffle heart",
      "red velvet heart",
      "black forest rectangle",
      "classic truffle",
      "golden drip truffle",
      "chocolate truffle rectangle",
      "truffle overload",
      "classic pineapple",
      "kitkat chocolate overload",
      "truffle tub",
      "blueberry",
      "chocolate glaze",
      "classic dutch",
      "royal chocolate drip"
    ]);

    // Extract base name to match both custom and regular cakes (stripping categories suffix if present)
    const baseName = cake.custom
      ? cake.name
      : cake.name.replace(/ (Trending|Birthday|Anniversary|Gourmet|Bento|Photo|Designer|Half Birthday) Cakes?$/, '');

    const normalizedName = baseName
      .toLowerCase()
      .trim()
      .replace(/ cakes?$/, '') // Remove trailing "cake" or "cakes" for robust match
      .replace(/\s+/g, ' ')
      .trim();

    return !NO_FLAVOR_SELECT_CAKES.has(normalizedName);
  })();

  // Retrieve the default flavor choice matching reference descriptions
  const getDefaultFlavor = () => {
    if (!cake) return isBento ? 'Chocolate Truffle' : 'Chocolate Truffle';
    if (['c92', 'c93', 'c97', 'c98', 'c100', 'c102', 'c103', 'c104', 'c105', 'c106', 'c107', 'c108', 'c112'].includes(cake.id)) return 'Chocolate Truffle';

    const searchTarget = `${cake.name} ${cake.flavor || ''} ${cake.description || ''}`.toLowerCase();

    // Sort keys by length descending to match more specific flavors first (e.g., "Chocolate Oreo" before "Oreo")
    const sortedFlavors = Object.keys(flavorPrices).sort((a, b) => b.length - a.length);

    for (const f of sortedFlavors) {
      // Normalize string comparisons: remove spaces and non-alphanumeric chars
      const normalizedF = f.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normalizedTarget = searchTarget.replace(/[^a-z0-9]/g, '');

      if (normalizedTarget.includes(normalizedF)) {
        return f;
      }
    }

    // Keyword mapping fallback for generic flavor descriptions
    const FLAVOR_KEYWORD_MAP = {
      'butterscotch': 'Butterscotch',
      'butter scotch': 'Butterscotch',
      'vanilla': 'Plain Vanilla',
      'pineapple': 'Pineapple',
      'strawberry': 'Strawberry',
      'black forest': 'Black Forest',
      'blueberry': 'Blueberry Cheesecake',
      'red velvet': 'Red Velvet Cheesecake',
      'chocolate': 'Chocolate Truffle',
      'mango': 'Mango Cake',
      'oreo': 'Chocolate Oreo',
      'mocha': 'Cafe Mocha',
      'nutella': 'Chocolate Nutella',
      'rajbhog': 'Rajbhog',
      'rasmalai': 'Rasmalai',
      'gulab jamun': 'Gulab Jamun'
    };

    const BENTO_FLAVOR_KEYWORD_MAP = {
      'butterscotch': 'Butterscotch',
      'butter scotch': 'Butterscotch',
      'vanilla': 'Vanilla',
      'pineapple': 'Pineapple',
      'strawberry': 'Strawberry',
      'black forest': 'Black Forest',
      'blueberry': 'Blueberry',
      'red velvet': 'Red Velvet',
      'chocolate': 'Chocolate Truffle',
      'oreo': 'Oreo',
      'kitkat': 'KitKat',
      'kit kat': 'KitKat',
      'nutella': 'Nutella',
      'biscoff': 'Biscoff',
      'rasmalai': 'Rasmalai'
    };

    const keywordMap = isBento ? BENTO_FLAVOR_KEYWORD_MAP : FLAVOR_KEYWORD_MAP;
    for (const [kw, fName] of Object.entries(keywordMap)) {
      if (searchTarget.includes(kw)) {
        return fName;
      }
    }

    return isBento ? 'Chocolate Truffle' : 'Chocolate Truffle';
  };

  // Calculate the design premium fee for any cake based on default flavor base price
  const designPremium = (() => {
    if (!cake) return 0;
    const defaultFlavorName = getDefaultFlavor();
    const refBasePrice = flavorPrices[defaultFlavorName] || 600;

    const halfKgPrice = cake.prices && cake.prices['0.5 KG'] ? cake.prices['0.5 KG'] : cake.price;
    return Math.max(0, halfKgPrice - refBasePrice);
  })();

  const [selectedFlavor, setSelectedFlavor] = useState(() => getDefaultFlavor());

  // Parse minimum weight limit from description if present (e.g. "Minimum 2 Kg")
  const getMinWeightLimit = () => {
    if (!cake || !cake.description) return 0.5;
    const desc = cake.description.toLowerCase();
    const match = desc.match(/minimum\s+(\d+(?:\.\d+)?)\s*kg/i);
    if (match) {
      // Cap the minimum limit at 1.5 KG so it doesn't exceed our maximum selectable weight of 1.5 KG
      return Math.min(1.5, parseFloat(match[1]));
    }
    return 0.5;
  };

  // Determine available weights dynamically based on prices database and minimum limits
  const availableWeights = (() => {
    const minLimit = getMinWeightLimit();
    if (!cake) return ['0.5 KG', '1 KG', '1.5 KG'].filter(w => parseFloat(w) >= minLimit);
    if (!cake.prices) return ['0.5 KG', '1 KG', '1.5 KG'].filter(w => parseFloat(w) >= minLimit);

    const list = [];
    if (cake.prices['0.5 KG'] !== null && cake.prices['0.5 KG'] !== undefined) list.push('0.5 KG');
    if (cake.prices['1 KG'] !== null && cake.prices['1 KG'] !== undefined) list.push('1 KG');
    if (cake.prices['1.5 KG'] !== null && cake.prices['1.5 KG'] !== undefined) list.push('1.5 KG');

    if (list.length === 0) {
      list.push('0.5 KG', '1 KG', '1.5 KG');
    }

    return list.filter(w => parseFloat(w) >= minLimit);
  })();

  const [weight, setWeight] = useState('1 KG');

  // Check if cake is a Photo Cake or Semi-Fondant
  const isSemiFondant = (() => {
    if (!cake || !cake.description) return false;
    const desc = cake.description.toLowerCase();
    return desc.includes('semi fondant') || desc.includes('semi-fondant');
  })();

  const isPhotoCake = (() => {
    if (!cake) return false;
    if (cake.categoryGroup === 'Photo Cakes' || (cake.tags && cake.tags.includes('Photo Cakes'))) return true;
    if (cake.description && cake.description.toLowerCase().includes('photo cake')) return true;
    return false;
  })();

  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Reset states when ID or cake changes
  useEffect(() => {
    if (cake) {
      setNameOnCake('');
      setMessage('');
      setInstructions('');
      setIsCustomWeight(false);
      setSelectedImage(0);
      setUploadedPhoto(null);
      setPhotoPreview(null);
      setSelectedFlavor(getDefaultFlavor());

      const minLimit = getMinWeightLimit();
      let defaultWeight = '1 KG';

      if (cake.id === 'c135') {
        defaultWeight = '1.5 KG';
      } else if (cake.prices) {
        const valid = ['0.5 KG', '1 KG', '1.5 KG'].filter(w => {
          return cake.prices[w] !== null && cake.prices[w] !== undefined && parseFloat(w) >= minLimit;
        });
        defaultWeight = valid.length > 0 ? valid[0] : `${minLimit} KG`;
      } else {
        defaultWeight = minLimit >= 1 ? `${minLimit} KG` : '0.5 KG';
      }
      setWeight(defaultWeight);
    }
  }, [id, cake]);

  if (!cake) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <h2 className="text-2xl font-serif text-bakery-darkBrown">Cake not found!</h2>
      </div>
    );
  }

  const hasImages = cake.images && cake.images.length === 4;
  const galleryImages = hasImages ? cake.images : [cake.image, cake.image, cake.image, cake.image];
  const galleryViews = hasImages ? [
    { classes: 'object-center' },
    { classes: 'object-center' },
    { classes: 'object-center' },
    { classes: 'object-center' }
  ] : [
    { classes: 'object-center scale-100' },
    { classes: 'object-left scale-150 origin-left' },
    { classes: 'object-right scale-150 origin-right' },
    { classes: 'object-top scale-150 origin-top' }
  ];

  // Calculate current price dynamically
  const currentPrice = (() => {
    if (isCustomWeight) {
      let baseKgPrice;
      const flavorHalfKgPrice = flavorPrices[selectedFlavor] || 600;
      baseKgPrice = (flavorHalfKgPrice + designPremium) * 2;
      return customWeightValue * baseKgPrice;
    }

    let discountFactor = 1;
    const halfKgBasePrice = cake.prices && cake.prices['0.5 KG'] ? cake.prices['0.5 KG'] : cake.price;
    if (cake.prices && cake.prices[weight]) {
      discountFactor = cake.prices[weight] / halfKgBasePrice;
    } else {
      const currentMultiplier = WEIGHT_MULTIPLIERS[weight] || 1;
      const halfKgMultiplier = WEIGHT_MULTIPLIERS['0.5 KG'] || 1;
      discountFactor = currentMultiplier / halfKgMultiplier;
    }
    const flavorHalfKgPrice = flavorPrices[selectedFlavor] || 600;
    const calculatedPrice = (flavorHalfKgPrice + designPremium) * discountFactor;
    return Math.round(calculatedPrice / 10) * 10;
  })();

  const handleAddToCart = () => {
    addToCart({
      id: cake.id,
      name: cake.name,
      basePrice: cake.price,
      price: currentPrice,
      image: cake.image,
      flavor: ['c111', 'c116'].includes(cake.id) ? '' : selectedFlavor,
      weight: isCustomWeight ? `${customWeightValue} KG` : weight,
      eggless: isEggless,
      quantity: 1,
      nameOnCake,
      message,
      instructions: isPhotoCake && uploadedPhoto
        ? `[Custom Photo: ${uploadedPhoto.name}] ${instructions}`
        : instructions
    });
  };

  const handleOrderWhatsApp = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left Column - Image & Preview */}
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-bakery-cream border-2 border-bakery-peach/30 shadow-lg">
              <img
                src={galleryImages[selectedImage]}
                alt={cake.name}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${galleryViews[selectedImage].classes}`}
              />

              {/* Live Preview Text overlay */}
              {nameOnCake && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                >
                  <span className="font-cursive text-5xl md:text-6xl text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] bg-black/20 px-6 py-2 rounded-xl backdrop-blur-sm">
                    {nameOnCake}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${selectedImage === i ? 'border-bakery-gold' : 'border-transparent hover:border-bakery-gold/50'}`}
                >
                  <img src={img} className={`w-full h-full object-cover ${galleryViews[i].classes}`} alt={`Thumbnail ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details & Form */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-serif font-bold text-bakery-darkBrown mb-2">{cake.name}</h1>

              {(cake.id === 'c101' || cake.id === 'c102' || cake.id === 'c103' || cake.id === 'c104' || cake.id === 'c105' || cake.id === 'c106' || cake.id === 'c107' || cake.id === 'c108' || cake.id === 'c112' || cake.id === 'c117') && (
                <div className="flex flex-col gap-2 mb-3.5">
                  <div className="text-bakery-pink-vibrant font-bold flex items-center gap-1.5 bg-bakery-pink/5 px-3.5 py-1.5 rounded-full border border-bakery-pink/15 w-fit shadow-sm">
                    <span className="text-xs uppercase tracking-wider text-bakery-brown/70 font-semibold">Flavour:</span>
                    <span className="text-sm font-extrabold text-bakery-darkBrown">{selectedFlavor}</span>
                  </div>
                  {cake.id !== 'c103' && cake.id !== 'c105' && cake.id !== 'c106' && cake.id !== 'c107' && cake.id !== 'c108' && cake.id !== 'c112' && cake.id !== 'c117' && (
                    <div className="text-bakery-gold font-bold flex items-center gap-1.5 bg-bakery-peach/10 px-3.5 py-1.5 rounded-full border border-bakery-peach/30 w-fit shadow-sm">
                      <span className="text-xs uppercase tracking-wider text-bakery-brown/70 font-semibold">Type:</span>
                      <span className="text-sm font-extrabold text-bakery-darkBrown">
                        {cake.id === 'c104' ? 'Semi Fondant 2 - tier' : 'Semi Fondant Cake'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {((!priceDependsOnFlavor && cake.id !== 'c90' && cake.id !== 'c95' && cake.id !== 'c96' && cake.id !== 'c111' && cake.id !== 'c116') || cake.id === 'c92' || cake.id === 'c93' || cake.id === 'c97' || cake.id === 'c98' || cake.id === 'c100') && (
                <div className="flex flex-col gap-2 mb-3.5">
                  <div className="text-bakery-pink-vibrant font-bold flex items-center gap-1.5 bg-bakery-pink/5 px-3.5 py-1.5 rounded-full border border-bakery-pink/15 w-fit shadow-sm">
                    {cake.id !== 'c91' && (
                      <span className="text-xs uppercase tracking-wider text-bakery-brown/70 font-semibold">
                        {['c113', 'c114'].includes(cake.id) ? 'Flavour:' : 'Flavor:'}
                      </span>
                    )}
                    <span className="text-sm font-extrabold capitalize text-bakery-darkBrown">
                      {cake.id === 'c91'
                        ? 'Ferrero Rocher'
                        : (cake.id === 'c92' || cake.id === 'c93' || cake.id === 'c97' || cake.id === 'c98' || cake.id === 'c100' ? 'Chocolate Truffle' : (cake.flavor || selectedFlavor))}
                    </span>
                  </div>
                  {cake.id === 'c97' && (
                    <div className="text-bakery-gold font-bold flex items-center gap-1.5 bg-bakery-peach/10 px-3.5 py-1.5 rounded-full border border-bakery-peach/30 w-fit shadow-sm">
                      <span className="text-xs uppercase tracking-wider text-bakery-brown/70 font-semibold">Type:</span>
                      <span className="text-sm font-extrabold text-bakery-darkBrown">Semi Fondant Cake</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-baseline gap-4 mb-4 bg-bakery-cream/35 p-3 rounded-xl border border-bakery-peach/20 w-fit">
                {['c92', 'c93', 'c97', 'c98', 'c100', 'c101', 'c102', 'c103', 'c104', 'c105', 'c106', 'c107', 'c108', 'c112'].includes(cake.id) && selectedFlavor !== 'Chocolate Truffle' ? (
                  <span className="text-xl font-bold text-bakery-pink-dark">Custom Pricing (Ask on WhatsApp)</span>
                ) : (
                  <>
                    <span className="text-3xl font-sans font-bold text-bakery-pink-dark">₹{currentPrice}</span>
                    {!isCustomWeight && (
                      <span className="text-sm text-bakery-brown/60">for {weight}</span>
                    )}
                  </>
                )}
              </div>

              {cake.id === 'c101' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Gear up for a thrilling celebration with our 2 Tier Racing Cars Birthday Cake! Handcrafted with precision, this stunning semi-fondant creation features vibrant racing cars and victory flags. Perfect for birthday parties, it's bound to make your little racer's special day unforgettable. Customize the flavor to your liking and add a name for a personalized touch!
                </p>
              ) : cake.id === 'c102' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Celebrate love and milestones with our beautiful Red Rose Heart Anniversary Cake! This gorgeous, heart-shaped masterpiece is decorated with elegant, handcrafted red roses and a signature golden accent. Perfect for anniversaries or romantic celebrations, it is as delicious as it is stunning. Personalize it with your favorite flavors and a custom name to make your event truly memorable!
                </p>
              ) : cake.id === 'c103' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Celebrate milestone birthdays and special moments with our stunning Sweet 18 Heart Cake! Crafted in a beautiful heart shape with elegant pink piping, ribbon details, and topped with golden accents, this cake is the perfect centerpiece for a royalty-themed celebration. Customize with your preferred flavor and add a name for a personalized touch!
                </p>
              ) : cake.id === 'c104' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Mark your sacred milestones with our breathtaking Elegant Holy Cross Cake! This majestic 2-tier masterpiece is beautifully adorned with delicate pastel flowers, satin-like bows, and topped with a glorious golden holy cross. Perfect for first communions, christenings, or confirmations, it is as meaningful as it is delicious. Customize the flavor and add a name to bless your special celebration!
                </p>
              ) : cake.id === 'c108' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Show your dad how much you appreciate him with our stunning My Superhero Dad Cake! Adorned with a custom superhero dad ladder topper, elegant white sprinkles, and rich chocolate frosting, this cake is the perfect center stage for his birthday or Father's Day celebration. Customize the flavor to his favorite and add his name to make it a memorable tribute to your hero!
                </p>
              ) : cake.id === 'c112' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Welcome your little bundle of joy with our adorable Baby Boy or Girl Shower Cake! Beautifully crafted with charming gender-reveal details, cute pastel toppings, and elegant design accents, this cake is the perfect centerpiece for your baby shower or gender reveal party. Customize the flavor to delight your guests and add a personalized touch to celebrate this beautiful new beginning!
                </p>
              ) : (
                <p className="text-bakery-brown/80 leading-relaxed">
                  Indulge in our exquisite {cake.name}. Handcrafted with premium ingredients,
                  this beautiful creation is perfect for making your special moments even sweeter.
                </p>
              )}
            </div>

            <div className="space-y-6">
              {/* Pure Veg Badge */}
              <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200 text-green-800">
                <span className="w-5 h-5 rounded-md border-2 border-green-600 flex items-center justify-center shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
                </span>
                <span className="font-bold text-sm">100% Pure Vegetarian / Eggless Cake</span>
              </div>

              {/* Weight Selection */}
              <div>
                <label className="block font-bold text-bakery-darkBrown mb-3">Select Weight</label>
                <div className="flex flex-wrap gap-3">
                  {!isCustomWeight && availableWeights.map(w => (
                    <button
                      key={w}
                      onClick={() => setWeight(w)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${weight === w
                        ? 'border-bakery-brown bg-bakery-brown text-white'
                        : 'border-bakery-peach text-bakery-brown hover:border-bakery-brown'
                        }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavor Selection (if depends on flavor) */}
              {priceDependsOnFlavor && (
                <div className="pt-6 border-t border-bakery-peach">
                  <label className="block font-bold text-bakery-darkBrown mb-3">Select Flavor</label>
                  <select
                    value={selectedFlavor}
                    onChange={(e) => setSelectedFlavor(e.target.value)}
                    className="w-full p-3.5 rounded-lg border-2 border-bakery-peach focus:border-bakery-brown outline-none bg-bakery-cream font-bold text-bakery-darkBrown cursor-pointer shadow-sm"
                  >
                    {(() => {
                      let list = Object.keys(flavorPrices);
                      if (['c92', 'c93', 'c97', 'c98', 'c100', 'c101', 'c102', 'c103', 'c104', 'c105', 'c106', 'c107', 'c108', 'c112'].includes(cake.id)) {
                        list = ['Chocolate Truffle', 'Plain Vanilla', 'Pineapple', 'Strawberry', 'Black Forest', 'Blueberry', 'Butterscotch', 'Red Velvet'];
                      }
                      return list.map(f => {
                        let flavorPrice;
                        if (isCustomWeight) {
                          flavorPrice = (flavorPrices[f] + designPremium) * 2 * customWeightValue;
                        } else {
                          let factor = 1;
                          const halfKgBase = cake.prices && cake.prices['0.5 KG'] ? cake.prices['0.5 KG'] : cake.price;
                          if (cake.prices && cake.prices[weight]) {
                            factor = cake.prices[weight] / halfKgBase;
                          } else {
                            factor = (WEIGHT_MULTIPLIERS[weight] || 1) / (WEIGHT_MULTIPLIERS['0.5 KG'] || 1);
                          }
                          flavorPrice = Math.round((flavorPrices[f] + designPremium) * factor / 10) * 10;
                        }

                        // Special rendering rules for c101, c102, c103, c104, c105, c106, c107, c108 & c112
                        if (['c101', 'c102', 'c103', 'c104', 'c105', 'c106', 'c107', 'c108', 'c112'].includes(cake.id)) {
                          if (f === 'Chocolate Truffle') {
                            return (
                              <option key={f} value={f}>
                                {f} ({flavorPrice}/-)
                              </option>
                            );
                          } else {
                            return (
                              <option key={f} value={f}>
                                {f}
                              </option>
                            );
                          }
                        }

                        // Special rendering rules for c92, c93, c97, c98 & c100
                        if (cake.id === 'c92' || cake.id === 'c93' || cake.id === 'c97' || cake.id === 'c98' || cake.id === 'c100') {
                          if (f === 'Chocolate Truffle') {
                            let displayPrice;
                            if (cake.id === 'c92') displayPrice = 800;
                            else if (cake.id === 'c93') displayPrice = 850;
                            else displayPrice = flavorPrice; // Dynamically uses correct prices depending on weight

                            return (
                              <option key={f} value={f}>
                                {f} (₹{displayPrice})
                              </option>
                            );
                          } else {
                            return (
                              <option key={f} value={f}>
                                {f}
                              </option>
                            );
                          }
                        }

                        return (
                          <option key={f} value={f}>
                            {f} (₹{flavorPrice})
                          </option>
                        );
                      });
                    })()}
                  </select>
                </div>
              )}

              {/* Personalization */}
              <div className="space-y-4 pt-6 border-t border-bakery-peach">
                <h3 className="font-serif font-bold text-xl text-bakery-darkBrown">Personalize Your Cake</h3>

                <div>
                  <label className="block text-sm text-bakery-brown mb-1">Name on Cake (Live Preview)</label>
                  <input
                    type="text"
                    maxLength={15}
                    value={nameOnCake}
                    onChange={(e) => setNameOnCake(e.target.value.toUpperCase())}
                    placeholder="e.g. YASH"
                    className="w-full p-3 border border-bakery-peach rounded-lg focus:ring-2 focus:ring-bakery-brown outline-none uppercase font-bold"
                  />
                </div>
              </div>

              {/* Customizations & Advisories */}
              {(isPhotoCake || isSemiFondant) && (
                <div className="space-y-4 pt-6 border-t border-bakery-peach">
                  {isPhotoCake && (
                    <div className="p-4 rounded-xl border-2 border-dashed border-bakery-peach bg-bakery-cream/25">
                      <label className="block text-sm font-bold text-bakery-darkBrown mb-2">Upload Photo for Printing</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="block w-full text-sm text-bakery-brown file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-bakery-pink-vibrant file:text-white hover:file:bg-bakery-pink-dark cursor-pointer"
                      />
                      {photoPreview && (
                        <div className="mt-3 relative w-24 h-24 rounded-lg overflow-hidden border border-bakery-peach shadow-sm">
                          <img src={photoPreview} alt="Custom Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => { setUploadedPhoto(null); setPhotoPreview(null); }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {isSemiFondant && (
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 flex gap-2">
                      <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <span className="font-bold block mb-1">Cake Care & Storage</span>
                        This is a semi-fondant cake. Please store in an air-conditioned room (not a refrigerator) prior to celebration to protect fondant decorations.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="pt-6 space-y-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-bakery-pink-vibrant text-white rounded-full font-bold text-lg hover:bg-bakery-pink-dark transition-colors shadow-lg shadow-bakery-pink-vibrant/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>

                <button
                  onClick={handleOrderWhatsApp}
                  className="w-full py-4 bg-[#25D366] text-white rounded-full font-bold text-lg hover:bg-[#128C7E] transition-colors shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle size={20} />
                  Order on WhatsApp
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
