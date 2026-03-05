import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { BASE_URL } from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const { user } = useAuth();

  // key for localStorage per user (guest fallback)
  const storageKey = user && user.id ? `cart_user_${user.id}` : 'cart_guest';

  // Load saved cart when provider mounts or when user changes
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // If user logged in, try server first
        if (user && user.id) {
          const res = await fetch(`${BASE_URL}/carrito.php`, { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            if (!cancelled) setItems(data || []);
            return;
          }
        }

        // Fallback to localStorage
        const raw = localStorage.getItem(storageKey);
        if (!cancelled) setItems(raw ? JSON.parse(raw) : []);
      } catch (e) {
        if (!cancelled) setItems([]);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [storageKey, user]);

  // Persist cart whenever items or storageKey changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      // ignore
    }

    // If user logged in, save to server as well
    const saveServer = async () => {
      if (user && user.id) {
        try {
          await fetch(`${BASE_URL}/carrito.php`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(items),
          });
        } catch (e) {
          // ignore
        }
      }
    };
    saveServer();
  }, [items, storageKey, user]);

  // Merge guest cart into user cart when logging in (server-backed)
  useEffect(() => {
    if (!user || !user.id) return;

    (async () => {
      try {
        const guestRaw = localStorage.getItem('cart_guest');
        if (!guestRaw) return;
        const guestItems = JSON.parse(guestRaw) || [];
        if (!guestItems.length) return;

        // Fetch current server cart
        const res = await fetch(`${BASE_URL}/carrito.php`, { credentials: 'include' });
        let serverItems = [];
        if (res.ok) serverItems = await res.json();

        // Merge guestItems into serverItems
        const map = new Map();
        serverItems.forEach(i => map.set(i.id, { ...i }));
        guestItems.forEach(i => {
          if (map.has(i.id)) {
            map.set(i.id, { ...map.get(i.id), qty: (map.get(i.id).qty || 0) + (i.qty || 0) });
          } else {
            map.set(i.id, { ...i });
          }
        });

        const merged = Array.from(map.values());

        // Save merged to server and localStorage
        await fetch(`${BASE_URL}/carrito.php`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(merged),
        });
        localStorage.removeItem('cart_guest');
        setItems(merged);
      } catch (e) {
        // ignore
      }
    })();
  }, [user]);

  const addItem = (product) => {
    // Do not allow adding items unless a user is logged in
    if (!user || !user.id) return;

    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.precio * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      total, count, cartOpen, setCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
