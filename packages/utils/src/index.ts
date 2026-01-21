/**
 * Shared Utility Functions
 * Common helpers and utilities for all AI portfolio applications
 */

// String utilities
export { formatDate, parseDate, formatTime } from './string'
export { slugify, capitalizeWords, truncateText } from './string'

// Object utilities
export { deepMerge, pick, omit, groupBy } from './object'

// Array utilities
export { chunk, flatten, unique, sortBy } from './array'

// API utilities
export { fetchJSON, handleAPIError, retryFetch } from './api'

// Storage utilities
export { localStorage as storage } from './storage'

// Validation utilities
export { validateEmail, validateURL, validateJSON } from './validation'

// Error handling
export { AppError, APIError } from './errors'

// Logging
export { logger } from './logger'
