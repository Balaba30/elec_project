/**
 * App.jsx - Main Application Router and Layout
 * 
 * This is the main component responsible for:
 * 1. ROUTING: Managing page navigation between different screens
 * 2. STATE MANAGEMENT: Managing shopping cart and user session
 * 3. AUTHENTICATION: Checking user login status and redirecting appropriately
 * 4. LAYOUT: Rendering header, main content, and navigation footer
 * 
 * Page Routes:
 * - 'auth' → AuthPage (login/signup)
 * - 'products' → RestaurantListing (browse restaurants and food)
 * - 'cart' → Cart (view shopping cart)
 * - 'checkout' → Checkout (place order)
 * - 'history' → OrderHistory (view past orders)
 * - 'details' → OrderTracking (track current order)
 * - 'restaurant-dashboard' → RestaurantOwnerDashboard (owner panel)
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from './config/supabase';
import { useSupabase } from './hooks/useSupabase';
import { ORANGE, LIGHT_BG, BORDER } from './config/constants';

// ========== COMPONENT IMPORTS ==========
import { Loading } from './components/common/Loading';
import { AuthPage } from './components/auth/AuthPage';
import { RestaurantListing } from './components/products/RestaurantListing';
import { Cart } from './components/cart/Cart';
import { Checkout } from './components/checkout/Checkout';
import { OrderHistory } from './components/orders/OrderHistory';
import { OrderTracking } from './components/orders/OrderTracking';
import RestaurantOwnerDashboard from './components/orders/RestaurantOwnerDashboard';
import './App.css';

const App = () => {
  // ========== HOOKS & STATE ==========
  const { user, authReady } = useSupabase();
  
  /** Current page being displayed (controls routing) */
  const [page, setPage] = useState('products');
  
  /** Shopping cart array - stores products user has added */
  const [cart, setCart] = useState([]);
  
  /** Selected order for tracking - used in 'details' page */
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ========== HANDLERS ==========
  /**
   * Handles user logout:
   * - Signs out from Supabase
   * - Clears shopping cart
   * - Redirects to auth page
   */
  const handleSignOut = useCallback(() => {
    supabase.auth.signOut().then(() => {
      setCart([]);
      setPage('auth');
    }).catch(console.error);
  }, []);

  // ========== EFFECT: AUTH & ROUTE VALIDATION ==========
  /**
   * Manages authentication logic and page redirects:
   * - If not authenticated: redirect to auth page
   * - If authenticated but on auth page: go to products
   * - If on order details but no order selected: go to history
   * - Clear selected order when navigating away from details page
   */
  useEffect(() => {
    if (!authReady) return; // Wait for auth check to complete

    // Redirect unauthenticated users to auth page (except restaurant dashboard)
    if (!user) {
      if (page !== 'auth' && page !== 'restaurant-dashboard') {
        setPage('auth');
      }
      return;
    }

    // Redirect authenticated users away from auth page
    if (page === 'auth') {
      setPage('products');
    }
    
    // If on details page but no order selected, go back to history
    else if (page === 'details' && !selectedOrder) {
      setPage('history');
    }
    
    // Clear selected order when navigating away from details page
    if (page !== 'details' && selectedOrder) {
      setSelectedOrder(null);
    }
  }, [authReady, user, page, selectedOrder]);

  // ========== ROUTER: RENDER CONTENT BASED ON PAGE ==========
  /**
   * This function acts as the main router, displaying different components
   * based on the current page state. Each case handles a specific route.
   */
  const renderContent = () => {
    // Show loading screen while auth is being checked
    if (!authReady) return <Loading />;
    
    // Restaurant dashboard has its own auth handling
    if (page === 'restaurant-dashboard') {
      return <RestaurantOwnerDashboard />;
    }

    // Show login page if user is not authenticated
    if (!user) {
      return <AuthPage onSuccess={() => setPage('products')} />;
    }

    // Route to appropriate component based on current page
    switch (page) {
      case 'products':
        // Browse restaurants and menu items
        return <RestaurantListing setPage={setPage} cart={cart} setCart={setCart} />;
      
      case 'cart':
        // View and manage shopping cart
        return <Cart setPage={setPage} cart={cart} setCart={setCart} />;
      
      case 'checkout':
        // Place order (redirect to products if cart is empty)
        if (cart.length === 0) {
          setPage('products');
          return null;
        }
        return <Checkout setPage={setPage} cart={cart} setCart={setCart} user={user} />;
      
      case 'history':
        // View all past orders
        return <OrderHistory setPage={setPage} user={user} setSelectedOrder={setSelectedOrder} />;
      
      case 'details':
        // Track selected order (redirect to history if no order selected)
        if (!selectedOrder) {
          setPage('history');
          return null;
        }
        return <OrderTracking order={selectedOrder} setPage={setPage} user={user} />;
      
      default:
        // Default to products page
        return <RestaurantListing setPage={setPage} cart={cart} setCart={setCart} />;
    }
  };

  // ========== COMPUTED VALUES ==========
  /** Count total items in cart (for badge display) */
  const cartItemCount = useMemo(() => 
    cart.reduce((sum, item) => sum + item.quantity, 0), 
    [cart]
  );
  
  /** Navigation items for bottom bar (only shown when authenticated) */
  const navItems = [
    { key: 'products', label: 'Shops', icon: '🍔' },
    { key: 'cart', label: 'Basket', icon: '🧺', count: cartItemCount },
    { key: 'history', label: 'Orders', icon: '🛵' },
  ];
  
  /** Display user's email or ID (for personalization) */
  const displayUserId = useMemo(() => {
    if (user && user.email) return user.email.split('@')[0];
    if (user && user.id) return `User-${user.id.slice(0, 4)}`;
    return 'Guest';
  }, [user]);

  /** Hide header/nav on restaurant dashboard */
  const hideNavigation = page === 'restaurant-dashboard';

  // ========== RENDER ==========
  return (
    <div className="h-screen flex flex-col items-center w-full" style={{ backgroundColor: LIGHT_BG }}>
      
      {/* ===== HEADER ===== */}
      {/* Sticky header with logo, user info, and logout button */}
      {!hideNavigation && (
        <header className="w-full shadow-lg p-3 z-20 sticky top-0" style={{ backgroundColor: ORANGE }}>
          <div className="flex justify-between items-center w-full max-w-3xl mx-auto">
            {/* Logo/Brand */}
            <a href="/" className="text-white font-bold text-lg">
              ILIGAN Food
            </a>
            
            {/* User info and logout button (only shown when logged in) */}
            {user && (
              <div className="flex items-center text-white text-sm">
                <span className="mr-3 font-semibold hidden sm:inline">Hi, {displayUserId}</span>
                <button 
                  onClick={handleSignOut}
                  className="px-3 py-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all font-bold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
      )}

      {/* ===== MAIN CONTENT ===== */}
      {/* Dynamic content area that changes based on current page route */}
      <main className="w-full flex-1 overflow-y-auto">
        {renderContent()}
      </main>

      {/* ===== BOTTOM NAVIGATION ===== */}
      {/* Navigation bar with links to main pages (only shown when logged in) */}
      {user && !hideNavigation && (
        <nav 
          className="flex-shrink-0 w-full shadow-2xl z-10" 
          style={{ backgroundColor: 'white', borderTop: `1px solid ${BORDER}` }}
        >
          <div className="flex justify-around w-full max-w-3xl mx-auto">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`flex flex-col items-center p-2 pt-3 text-xs font-semibold w-full sm:w-3/4 transition-colors relative ${
                  page === item.key ? 'text-opacity-100' : 'text-opacity-60'
                }`}
                style={{ color: ORANGE }}
              >
                {/* Icon */}
                <span className="text-2xl mb-1">{item.icon}</span>
                
                {/* Label */}
                {item.label}
                
                {/* Cart item count badge */}
                {item.count > 0 && item.key === 'cart' && (
                  <span className='absolute top-1 right-1/4 transform translate-x-1/2 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center'>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* ===== RESTAURANT OWNER BUTTON ===== */}
      {/* Fixed floating button for restaurant owner to access dashboard */}
      {!hideNavigation && (
        <button
          onClick={() => setPage('restaurant-dashboard')}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 p-4 rounded-full shadow-2xl font-bold text-white transition-all hover:scale-110 z-30"
          style={{ backgroundColor: ORANGE }}
          title="Restaurant Owner Login"
        >
          <span className="text-2xl">🍽️</span>
        </button>
      )}
    </div>
  );
};

export default App;
