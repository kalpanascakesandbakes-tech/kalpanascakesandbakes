import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, Info, X } from 'lucide-react';
import { mockCakes } from '../utils/mockData';
import useCartStore, { WEIGHT_MULTIPLIERS } from '../store/useCartStore';
import useDocumentMetadata from '../hooks/useDocumentMetadata';
import {
  priceDependsOnFlavor,
  getDefaultFlavor,
  getMinWeightLimit,
  getAvailableWeights,
  getDefaultWeight,
  getResolvedFlavor,
  calculateCakePrice
} from '../utils/cakeHelpers';

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

  const dependsOnFlavor = priceDependsOnFlavor(cake);

  const get8CommonFlavors = () => {
    const defaultF = getDefaultFlavor(cake);
    const standard8 = [
      'Chocolate Truffle',
      'Plain Vanilla',
      'Pineapple',
      'Strawberry',
      'Black Forest',
      'Blueberry',
      'Butterscotch',
      'Red Velvet'
    ];
    if (standard8.includes(defaultF)) {
      return [defaultF, ...standard8.filter(f => f !== defaultF)];
    }
    return [defaultF, ...standard8.slice(0, 7)];
  };

  const [selectedFlavor, setSelectedFlavor] = useState(() => getDefaultFlavor(cake));

  const availableWeights = getAvailableWeights(cake);
  const [weight, setWeight] = useState('1 KG');

  // Check if cake is a Photo Cake or Semi-Fondant
  const isSemiFondant = (() => {
    if (!cake || !cake.description) return false;
    const desc = cake.description.toLowerCase();
    return desc.includes('semi fondant') || desc.includes('semi-fondant');
  })();

  const isPhotoCake = (() => {
    if (!cake) return false;
    if (cake.id === 'c162') return false;
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
      setSelectedFlavor(getDefaultFlavor(cake));

      const minLimit = getMinWeightLimit(cake);
      let defaultWeight = '1 KG';

      if (cake.id === 'c135') {
        defaultWeight = '1.5 KG';
      } else if (cake.prices) {
        const valid = ['0.5 KG', '1 KG', '1.5 KG', '2 KG', '3 KG', '4 KG', '5 KG'].filter(w => {
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
  const currentPrice = calculateCakePrice(cake, selectedFlavor, weight, isCustomWeight, customWeightValue);

  const isCustomPricing = (() => {
    if (!cake || !dependsOnFlavor) return false;
    const primaryFlavor = getDefaultFlavor(cake);
    return selectedFlavor !== primaryFlavor;
  })();

  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: cake.id,
      name: cake.name,
      cakeNumber: cake.cakeNumber,
      basePrice: cake.price,
      price: isCustomPricing ? null : currentPrice,
      image: cake.image,
      flavor: getResolvedFlavor(cake, selectedFlavor),
      weight: isCustomWeight ? `${customWeightValue} KG` : weight,
      eggless: isEggless,
      quantity: 1,
      nameOnCake,
      message,
      instructions: isPhotoCake && uploadedPhoto
        ? `[Custom Photo: ${uploadedPhoto.name}] ${instructions}`
        : instructions,
      isCustomPricing: isCustomPricing
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
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
              {(() => {
                const displayFlavor = getResolvedFlavor(cake, selectedFlavor);
                if (!displayFlavor) return null;

                const showTypeBadge = (cake.id === 'c104' || cake.id === 'c97' || isSemiFondant) &&
                  !['c103', 'c105', 'c106', 'c107', 'c108', 'c112', 'c117', 'c118', 'c119', 'c120', 'c126', 'c127', 'c128', 'c132', 'c133', 'c134', 'c135', 'c136', 'c137', 'c138', 'c144', 'c145', 'c146', 'c147', 'c148', 'c149', 'c151', 'c152', 'c154', 'c155', 'c157', 'c158', 'c160', 'c161', 'c166', 'c170', 'c171', 'c173', 'c182', 'c183', 'c184', 'c187', 'c188', 'c192', 'c194', 'c196'].includes(cake.id);

                return (
                  <div className="flex flex-col gap-2 mb-3.5">
                    <div className="text-bakery-pink-vibrant font-bold flex items-center gap-1.5 bg-bakery-pink/5 px-3.5 py-1.5 rounded-full border border-bakery-pink/15 w-fit shadow-sm">
                      <span className="text-xs uppercase tracking-wider text-bakery-brown/70 font-semibold font-sans">
                        {cake.id === 'c138' || cake.id === 'c187' || cake.id === 'c188' || cake.id === 'c196' ? 'Flavour -' : (['c113', 'c114', 'c166', 'c170', 'c171'].includes(cake.id) ? 'Flavour:' : 'FLAVOR:')}
                      </span>
                      <span className="text-sm font-extrabold capitalize text-bakery-darkBrown">{displayFlavor}</span>
                    </div>
                    {showTypeBadge && (
                      <div className="text-bakery-gold font-bold flex items-center gap-1.5 bg-bakery-peach/10 px-3.5 py-1.5 rounded-full border border-bakery-peach/30 w-fit shadow-sm">
                        <span className="text-xs uppercase tracking-wider text-bakery-brown/70 font-semibold">Type:</span>
                        <span className="text-sm font-extrabold text-bakery-darkBrown">
                          {cake.id === 'c104' ? 'Semi Fondant 2 - tier' : 'Semi Fondant Cake'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex items-baseline gap-4 mb-4 bg-bakery-cream/35 p-3 rounded-xl border border-bakery-peach/20 w-fit">
                {isCustomPricing ? (
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



              {cake.id === 'c173' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Make your little princess feel like royalty with our enchanting Princess Cake! Featuring an intricate 3D princess gown hand-piped with luscious purple buttercream feathers, elegant blue butterfly accents, delicate pearl sprinkles, and a green floral arch top. Handcrafted fresh with premium ingredients for magical celebrations!
                </p>
              ) : cake.id === 'c184' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Delight your little stars with our adorable Mickey Mouse Theme Cake! Expertly hand-sculpted with cute pink and black buttercream piping, detailed Disney character features, and elegant pearl accents. Handcrafted fresh with premium ingredients for magical birthday memories!
                </p>
              ) : cake.id === 'c183' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Swing into celebration mode with our Red & Blue Web Cake! Eye-catchingly styled with a vibrant sky-blue frosting base, a striking red web glaze pattern, delicate cream rosettes, and juicy cherries on top. Handcrafted fresh with premium ingredients for superhero-themed parties!
                </p>
              ) : cake.id === 'c182' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Bring endless joy to your little one's celebration with our delightful Doraemon Theme Cake! Featuring vibrant blue and red buttercream rosettes, an intricately piped Doraemon face, and a cute golden bell accent. Handcrafted fresh with rich ingredients for a magical birthday surprise!
                </p>
              ) : cake.id === 'c166' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Celebrate love and togetherness with our Rose Anniversary Cake! Gracefully decorated with vibrant red buttercream rosettes, glamorous golden chocolate spheres, and a shiny 'Happy Anniversary' topper. Handcrafted with rich ingredients to make your romantic milestone truly memorable!
                </p>
              ) : cake.id === 'c171' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Make your special day extra chic with our Blush Pink Celebration Cake! Adorned with delicate pink-and-white horizontal buttercream stripes, shimmering edible pearl sprinkles, and a magnificent golden birthday topper. Handcrafted with fresh premium ingredients for a memorable celebration!
                </p>
              ) : cake.id === 'c170' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Celebrate your irreplaceable friendship with our BFF Photo Cake! Beautifully crafted with rich Dutch Truffle frosting, delicate piped borders, colorful sprinkles, and customized with your favorite memory photo. Perfect for birthdays and celebrating your best friend forever!
                </p>
              ) : cake.id === 'c187' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Celebrate your landmark 16th birthday in royal elegance with our Golden Sweet 16 Cake! Beautifully crafted with regal gold drip frosting, delicate blush piping, French macarons, and golden crown toppers, this exquisite centerpiece is designed for unforgettable memories. Handcrafted fresh with premium ingredients.
                </p>
              ) : cake.id === 'c101' ? (
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
              ) : cake.id === 'c118' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Welcome to a world of sparkle with our dazzling Shimmer Cake! Featuring a beautiful glittery black finish, gorgeous pink butterfly toppings, and glowing golden birthday candles, this cake is a stunning choice for birthdays or chic celebrations. Customize it in your favorite flavor to amaze your guests both visually and deliciously!
                </p>
              ) : cake.id === 'c117' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Make your little princess's dream come true with our breathtaking Elegant Barbie Doll Blue Gown Cake! Beautifully decorated with hand-piped blue and pink cream stars to form a gorgeous ballgown, this doll cake is the perfect centerpiece for birthdays. Customize with her favorite flavor and add her name for a magical celebration!
                </p>
              ) : cake.id === 'c119' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Swing into action with our spectacular Spiderman Theme Cake! Adorned with amazing Spiderman toppers, realistic chocolate spiderwebs, and custom name formatting, this cake is guaranteed to be a super-hit at your little hero's birthday. Choose their favorite flavor to create a heroic and mouthwatering experience!
                </p>
              ) : cake.id === 'c120' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Indulge in the elegance of our Purple Swirl Cream Cake! Featuring a beautiful gradient design with gorgeous piped purple and pink swirls, delicate pearl sprinkles, and a custom celebratory topper, this cake is perfect for birthdays and elegant get-togethers. Customize it with your favorite flavor to make it a memorable treat!
                </p>
              ) : cake.id === 'c126' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Elevate your celebrations with our spectacular Top Forward Cake! This modern vertical arch design features elegant textured details and is decorated with stunning white and gold chocolate spheres, finished with a golden birthday plaque. Handcrafted to perfection, it is the ultimate centerpiece for sophisticated gatherings. Select your favorite flavor to make it uniquely yours!
                </p>
              ) : cake.id === 'c127' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Make your milestone celebrations grand with our exquisite 2 Tier Birthday Cake! Featuring a beautiful textured white finish, handcrafted gold sphere details, baby's breath flowers, and a stunning golden birthday topper, this multi-tier cake is designed to impress. Perfect for golden jubilees, landmark birthdays, or formal events. Select your favorite flavor to customize this magnificent centerpiece!
                </p>
              ) : cake.id === 'c128' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Welcome your precious little one with our adorable Welcome Baby Cake! This beautifully textured light blue cake is decorated with a sweet sleeping baby on a cloud, a crescent moon, and smiling stars. Perfect for baby showers, naming ceremonies, or welcoming newborn celebrations. Customize with your favorite flavor to delight all your guests!
                </p>
              ) : cake.id === 'c132' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Celebrate a lifetime of achievements and new horizons with our elegant Happy Retirement Golden Spheres Cake! Featuring a textured white frosting finish and a custom "Happy Retirement" banner, it is beautifully adorned with handcrafted shimmering golden chocolate spheres. Select your favorite flavor to personalize this spectacular centerpiece!
                </p>
              ) : cake.id === 'c133' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Celebrate and show gratitude to our amazing educators with our beautiful School Teacher Theme Cake! This stunning custom cake features handcrafted toppers including books, a pencil, blackboard, and a lovely teacher caricature, personalized with a custom name. A perfect and thoughtful surprise for Teacher's Day, retirement, or birthdays. Select your favorite flavor to customize this delightful tribute!
                </p>
              ) : cake.id === 'c134' ? (
                <p className="text-bakery-brown/80 leading-relaxed font-medium">
                  Step back in time with our charming Blue Vintage Heart Piping Birthday Cake! This retro-inspired heart-shaped cake is beautifully iced in pastel blue, complete with intricate vintage star-piping details, delicate pearls, and topped with a golden "Happy Birthday" plaque. The perfect centerpiece for vintage-themed birthdays and celebrations. Select your favorite flavor to personalize this sweet nostalgic treat!
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
              {dependsOnFlavor && (
                <div className="pt-6 border-t border-bakery-peach">
                  <label className="block font-bold text-bakery-darkBrown mb-3">Select Flavor</label>
                  <select
                    value={selectedFlavor}
                    onChange={(e) => setSelectedFlavor(e.target.value)}
                    className="w-full p-3.5 rounded-lg border-2 border-bakery-peach focus:border-bakery-brown outline-none bg-bakery-cream font-bold text-bakery-darkBrown cursor-pointer shadow-sm"
                  >
                    {get8CommonFlavors().map(f => {
                      const isGivenFlavor = f === getDefaultFlavor(cake);
                      if (isGivenFlavor) {
                        const givenPrice = (cake.prices && cake.prices[weight] !== null && cake.prices[weight] !== undefined)
                          ? cake.prices[weight]
                          : currentPrice;
                        return (
                          <option key={f} value={f}>
                            {f} ({givenPrice}/-)
                          </option>
                        );
                      }
                      return (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      );
                    })}
                  </select>
                  <div className="mt-3 text-xs text-bakery-brown/70 italic leading-relaxed">
                    * Note: Standard price shown is for <span className="font-semibold text-bakery-darkBrown">{getDefaultFlavor(cake)}</span>. For other custom flavors, pricing will be confirmed directly on WhatsApp.
                  </div>
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
                  className={`w-full py-4 text-white rounded-full font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                    isAdded 
                      ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30' 
                      : 'bg-bakery-pink-vibrant hover:bg-bakery-pink-dark shadow-bakery-pink-vibrant/30'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <span>✓</span>
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      <span>Add to Cart</span>
                    </>
                  )}
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
