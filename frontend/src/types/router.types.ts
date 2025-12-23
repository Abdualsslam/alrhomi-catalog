/**
 * Router Type Definitions
 *
 * This file contains TypeScript interfaces for React Router
 * URL parameters and navigation state.
 */

/**
 * RouteParams interface for URL parameters
 * Used with useParams hook to type-safely access route parameters
 */
export interface RouteParams {
  id?: string;
  category?: string;
}

/**
 * LocationState interface for navigation state
 * Used with useLocation hook to type-safely access location state
 */
export interface LocationState {
  from?: string;
  message?: string;
}
