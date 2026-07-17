import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const WEIGHT_MULTIPLIERS = {
  '0.5 KG': 1,
  '1 KG': 2,
  '1.5 KG': 3,
  '2 KG': 4,
  '3 KG': 6,
  '4 KG': 8,
  '5 KG': 10,
};

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      addToCart: (item) => set((state) => {
        // Check if item exists with same options (id, flavor, weight, eggless, nameOnCake, message)
        const existingItemIndex = state.cart.findIndex(cartItem => 
          cartItem.id === item.id && 
          cartItem.flavor === item.flavor && 
          cartItem.weight === item.weight &&
          cartItem.eggless === item.eggless &&
          cartItem.nameOnCake === item.nameOnCake &&
          cartItem.message === item.message
        );

        if (existingItemIndex > -1) {
          const newCart = [...state.cart];
          newCart[existingItemIndex].quantity += item.quantity;
          return { cart: newCart, isCartOpen: true };
        }

        return { cart: [...state.cart, item], isCartOpen: true };
      }),

      removeFromCart: (index) => set((state) => {
        const newCart = [...state.cart];
        newCart.splice(index, 1);
        return { cart: newCart };
      }),

      updateQuantity: (index, amount) => set((state) => {
        const newCart = [...state.cart];
        const newQuantity = newCart[index].quantity + amount;
        if (newQuantity > 0) {
          newCart[index].quantity = newQuantity;
        }
        return { cart: newCart };
      }),

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          const unitPrice = item.price !== undefined && item.price !== null
            ? item.price
            : item.basePrice * (WEIGHT_MULTIPLIERS[item.weight] || 1);
          return total + (unitPrice * item.quantity);
        }, 0);
      },
      
      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'cake-cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

export default useCartStore;
