/**
 * config/constants.js
 * 
 * Central configuration file for all global constants used throughout the application.
 * This includes color variables, location data, order statuses, and API keys.
 * 
 * Usage: Import specific constants as needed in any component or file.
 * Example: import { ORANGE, ORDER_STATUSES } from '../config/constants';
 */

// ========== COLOR CONSTANTS ==========
// These colors are used consistently across the app for branding and styling

/** Primary brand color (orange) - used for buttons, headers, and highlights */
export const ORANGE = 'var(--shopee-orange)';

/** Dark color for text and borders */
export const NAVY = 'black';

/** Light background color for main pages */
export const LIGHT_BG = 'var(--shopee-light-bg)';

/** Gray text color for secondary text */
export const GRAY_TEXT = 'var(--shopee-gray-text)';

/** Border color for dividers and borders */
export const BORDER = 'var(--shopee-border)';

// ========== LOCATION CONSTANTS ==========
/** Default map center - Iligan City, Philippines coordinates */
export const MOCK_ILIGAN_CENTER = { lat: 8.2280, lng: 124.2452 };

// ========== ORDER STATUS CONSTANTS ==========
/** All possible order statuses used in the order tracking system */
export const ORDER_STATUSES = [
  'Preparing',          // Food is being prepared in the restaurant
  'Out for Delivery',   // Order is with the delivery driver
  'Delivered',          // Order was delivered to customer
  'Completed',          // Order is fully completed
  'Cancelled',          // Order was cancelled
];

// ========== API KEYS ==========
/** Google Maps API key - loaded from environment variables during build time */
export const MOCK_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';