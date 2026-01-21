/**
 * SQL Query Validator
 * Validates generated SQL queries for safety and correctness
 */

export function validateSQL(query) {
  if (!query || typeof query !== 'string') {
    return {
      valid: false,
      message: 'Invalid query: Query is empty or not a string'
    }
  }

  const trimmedQuery = query.trim()

  // Check if it's a comment/error
  if (trimmedQuery.startsWith('--')) {
    return {
      valid: false,
      message: 'Query generation failed'
    }
  }

  // Check for dangerous operations
  const dangerousPatterns = [
    /DROP\s+TABLE/i,
    /DROP\s+DATABASE/i,
    /TRUNCATE/i,
    /DELETE\s+FROM.*WHERE.*1\s*=\s*1/i,
    /UPDATE.*SET.*WHERE.*1\s*=\s*1/i,
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmedQuery)) {
      return {
        valid: false,
        message: 'Query contains potentially dangerous operation'
      }
    }
  }

  // Check for SQL injection patterns
  const injectionPatterns = [
    /;\s*DROP/i,
    /;\s*DELETE/i,
    /'\s*OR\s*'1'\s*=\s*'1/i,
    /--\s*$/,
    /\/\*.*\*\//,
  ]

  for (const pattern of injectionPatterns) {
    if (pattern.test(trimmedQuery)) {
      return {
        valid: false,
        message: 'Query contains potential SQL injection pattern'
      }
    }
  }

  // Check for valid SQL statement start
  const validStarts = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'WITH']
  const startsWithValid = validStarts.some(start => 
    trimmedQuery.toUpperCase().startsWith(start)
  )

  if (!startsWithValid) {
    return {
      valid: false,
      message: 'Query must start with SELECT, INSERT, UPDATE, DELETE, or WITH'
    }
  }

  // Basic syntax checks
  const openParens = (trimmedQuery.match(/\(/g) || []).length
  const closeParens = (trimmedQuery.match(/\)/g) || []).length

  if (openParens !== closeParens) {
    return {
      valid: false,
      message: 'Unbalanced parentheses in query'
    }
  }

  // Check for proper string quoting
  const singleQuotes = (trimmedQuery.match(/'/g) || []).length
  if (singleQuotes % 2 !== 0) {
    return {
      valid: false,
      message: 'Unbalanced quotes in query'
    }
  }

  return {
    valid: true,
    message: 'Query validation passed'
  }
}

export function formatSQL(query) {
  if (!query) return ''
  
  // Simple SQL formatting
  return query
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/,\s*/g, ', ')
    .trim()
}

export function explainQuery(query) {
  const upperQuery = query.toUpperCase()
  
  if (upperQuery.includes('SELECT')) {
    const hasJoin = upperQuery.includes('JOIN')
    const hasWhere = upperQuery.includes('WHERE')
    const hasGroupBy = upperQuery.includes('GROUP BY')
    const hasOrderBy = upperQuery.includes('ORDER BY')

    let explanation = 'This query retrieves data'
    
    if (hasJoin) explanation += ' from multiple tables using JOINs'
    if (hasWhere) explanation += ' with filtering conditions'
    if (hasGroupBy) explanation += ' and groups the results'
    if (hasOrderBy) explanation += ' sorted by specified columns'

    return explanation + '.'
  }

  if (upperQuery.includes('INSERT')) {
    return 'This query inserts new data into the database.'
  }

  if (upperQuery.includes('UPDATE')) {
    return 'This query modifies existing data in the database.'
  }

  if (upperQuery.includes('DELETE')) {
    return 'This query removes data from the database.'
  }

  return 'SQL query'
}
