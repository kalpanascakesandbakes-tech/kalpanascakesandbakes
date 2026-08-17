export const FLAVOR_BASE_PRICES = {
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
  'Mango': 500,
  'Strawberry': 500,
  'Pineapple': 500,
  'Blackcurrent': 500,
  'Blueberry': 500,
  'Butterscotch': 500,
  'Red Velvet': 500,
  'Oreo': 500,

  // Fusion Cakes
  'Rajbhog': 700,
  'Rasmalai': 750,
  'Gulab Jamun': 750,

  // Cheesecakes
  'Red Velvet Cheesecake': 700,
  'Blueberry Cheesecake': 700
};

export const BENTO_FLAVOR_BASE_PRICES = {
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

export const isBentoCake = (cake) => {
  return !!(cake && (cake.categoryGroup === 'Bento Cakes' || (cake.tags && cake.tags.includes('Bento Cakes'))));
};

export const priceDependsOnFlavor = (cake) => {
  if (!cake) return true;
  if (cake.id === 'c198' || cake.id === 'c199') return true;

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
    "red velvet theme",
    "red velvet cheesecake",
    "blueberry cheesecake",
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
    "royal chocolate drip",
    "lotus biscoff cheese"
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
};

export const getDefaultFlavor = (cake) => {
  if (!cake) return 'Chocolate Truffle';
  const isBento = isBentoCake(cake);
  const flavorPrices = isBento ? BENTO_FLAVOR_BASE_PRICES : FLAVOR_BASE_PRICES;

  if (cake.id === 'c188') return 'Chocolate Truffle';
  if (cake.id === 'c138') return 'Chocolate Truffle';
  if (cake.id === 'c192') return 'Chocolate Truffle';
  if (cake.id === 'c194') return 'Chocolate Truffle';
  if (cake.id === 'c120' || cake.id === 'c132' || cake.id === 'c137' || cake.id === 'c152' || cake.id === 'c160' || cake.id === 'c196') return 'Strawberry';
  if (cake.id === 'c161') return 'Blueberry Cheesecake';
  if (cake.id === 'c138' || cake.id === 'c162' || cake.id === 'c176' || cake.id === 'c177' || cake.id === 'c180') return 'Butterscotch';
  if (cake.id === 'c173') return 'Blackcurrent Cake';
  if (cake.id === 'c183' || cake.id === 'c171' || cake.id === 'c140' || cake.id === 'c155') return 'Blueberry';
  if (cake.id === 'c144' || cake.id === 'c151' || cake.id === 'c154') return 'Red Velvet';
  if (cake.id === 'c145') return 'Oreo';
  if (cake.id === 'c146') return 'Mango Cake';
  if (cake.id === 'c114' || cake.id === 'c149') return 'Plain Vanilla';
  if (['c92', 'c93', 'c97', 'c98', 'c100', 'c102', 'c103', 'c104', 'c105', 'c106', 'c107', 'c108', 'c112', 'c118', 'c126', 'c127', 'c128', 'c134', 'c136', 'c135', 'c147', 'c148', 'c153', 'c157', 'c158', 'c179', 'c182', 'c184', 'c187', 'c188', 'c192', 'c194', 'c197', 'c198'].includes(cake.id)) return 'Chocolate Truffle';

  const searchTarget = `${cake.name} ${cake.flavor || ''} ${cake.description || ''}`.toLowerCase();

  // Sort keys by length descending to match more specific flavors first
  const sortedFlavors = Object.keys(flavorPrices).sort((a, b) => b.length - a.length);

  for (const f of sortedFlavors) {
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

export const getMinWeightLimit = (cake) => {
  if (!cake || !cake.description) return 0.5;
  const desc = cake.description.toLowerCase();
  const match = desc.match(/minimum\s+(\d+(?:\.\d+)?)\s*kg/i);
  if (match) {
    if (cake.id === 'c135') return parseFloat(match[1]);
    return Math.min(1.5, parseFloat(match[1]));
  }
  return 0.5;
};

export const getAvailableWeights = (cake) => {
  const minLimit = getMinWeightLimit(cake);
  const possibleWeights = ['0.5 KG', '1 KG', '1.5 KG', '2 KG', '3 KG', '4 KG', '5 KG'];
  if (!cake || !cake.prices) return ['0.5 KG', '1 KG', '1.5 KG'].filter(w => parseFloat(w) >= minLimit);

  const list = [];
  possibleWeights.forEach(w => {
    if (cake.prices[w] !== null && cake.prices[w] !== undefined) {
      list.push(w);
    }
  });

  if (list.length === 0) {
    list.push('0.5 KG', '1 KG', '1.5 KG');
  }

  return list.filter(w => parseFloat(w) >= minLimit);
};

export const getDefaultWeight = (cake) => {
  if (!cake) return '1 KG';
  const minLimit = getMinWeightLimit(cake);
  let defaultWeight = '1 KG';

  if (cake.id === 'c135') {
    defaultWeight = '1.5 KG';
  } else if (cake.prices) {
    const valid = getAvailableWeights(cake);
    defaultWeight = valid.length > 0 ? valid[0] : `${minLimit} KG`;
  } else {
    defaultWeight = minLimit >= 1 ? `${minLimit} KG` : '0.5 KG';
  }
  return defaultWeight;
};

export const getDesignPremium = (cake) => {
  if (!cake) return 0;
  const isBento = isBentoCake(cake);
  const flavorPrices = isBento ? BENTO_FLAVOR_BASE_PRICES : FLAVOR_BASE_PRICES;
  const defaultFlavorName = getDefaultFlavor(cake);
  const refBasePrice = flavorPrices[defaultFlavorName] || 600;

  const halfKgPrice = cake.prices && cake.prices['0.5 KG'] ? cake.prices['0.5 KG'] : cake.price;
  return Math.max(0, halfKgPrice - refBasePrice);
};

export const getResolvedFlavor = (cake, selectedFlavor) => {
  if (!cake) return '';
  const NO_FLAVOR_IDS = new Set(['c90', 'c95', 'c96', 'c111', 'c116', 'c122', 'c123', 'c124', 'c125', 'c130', 'c143', 'c156', 'c178', 'c197']);
  if (NO_FLAVOR_IDS.has(cake.id)) return '';

  const dependsOnFlavor = priceDependsOnFlavor(cake);
  if (dependsOnFlavor) {
    return selectedFlavor || getDefaultFlavor(cake);
  }

  return (cake.id === 'c91'
    ? 'Ferrero Rocher'
    : (cake.id === 'c173'
      ? 'Blackcurrent Cake'
      : (cake.id === 'c183' || cake.id === 'c171'
        ? 'Blueberry'
        : (cake.id === 'c166' || cake.id === 'c170'
          ? 'Dutch Truffle'
          : (['c92', 'c93', 'c97', 'c98', 'c100', 'c112', 'c138', 'c182', 'c184', 'c187', 'c188', 'c192', 'c194'].includes(cake.id)
            ? 'Chocolate Truffle'
            : (cake.flavor || getDefaultFlavor(cake)))))));
};

export const calculateCakePrice = (cake, selectedFlavor, weight, isCustomWeight = false, customWeightValue = 4) => {
  if (!cake) return 0;
  const isBento = isBentoCake(cake);
  const flavorPrices = isBento ? BENTO_FLAVOR_BASE_PRICES : FLAVOR_BASE_PRICES;
  const dependsOnFlavor = priceDependsOnFlavor(cake);

  if (!dependsOnFlavor && !isCustomWeight) {
    if (cake.prices && cake.prices[weight] !== null && cake.prices[weight] !== undefined) {
      return cake.prices[weight];
    }
    return cake.price;
  }

  const designPremium = getDesignPremium(cake);

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
    const WEIGHT_MULTIPLIERS = {
      '0.5 KG': 1,
      '1 KG': 2,
      '1.5 KG': 3,
      '2 KG': 4,
      '3 KG': 6,
      '4 KG': 8,
      '5 KG': 10,
    };
    const currentMultiplier = WEIGHT_MULTIPLIERS[weight] || 1;
    const halfKgMultiplier = WEIGHT_MULTIPLIERS['0.5 KG'] || 1;
    discountFactor = currentMultiplier / halfKgMultiplier;
  }
  const flavorHalfKgPrice = flavorPrices[selectedFlavor] || 600;
  const calculatedPrice = (flavorHalfKgPrice + designPremium) * discountFactor;
  return Math.round(calculatedPrice / 10) * 10;
};
