import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './types';
export type { Product };

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, quantity = 1, size, color) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => 
              item.product.id === product.id && 
              item.selectedSize === size && 
              item.selectedColor === color
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems, isOpen: true };
          }

          return { 
            items: [...state.items, { product, quantity, selectedSize: size, selectedColor: color }],
            isOpen: true
          };
        });
      },
      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) => 
              !(item.product.id === productId && 
                item.selectedSize === size && 
                item.selectedColor === color)
          )
        }));
      },
      updateQuantity: (productId, quantity, size, color) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (
              item.product.id === productId && 
              item.selectedSize === size && 
              item.selectedColor === color
            ) {
              return { ...item, quantity: Math.max(1, quantity) };
            }
            return item;
          })
        }));
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setIsOpen: (isOpen) => set({ isOpen }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      }
    }),
    {
      name: 'bsr-cart-storage',
      partialize: (state) => ({ items: state.items }), // Only persist items, not isOpen state
    }
  )
);

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (!get().isInWishlist(product.id)) {
          set((state) => ({ items: [...state.items, product] }));
        }
      },
      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== productId) }));
      },
      toggleItem: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
      isInWishlist: (productId) => {
        return get().items.some((i) => i.id === productId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'bsr-wishlist-storage',
    }
  )
);
