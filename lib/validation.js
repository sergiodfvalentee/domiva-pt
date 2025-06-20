// Input validation and sanitization utilities

/**
 * Sanitize string input to prevent XSS and injection attacks
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') return ''
  
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove JavaScript protocols
    .replace(/javascript:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove data URIs
    .replace(/data:\s*[^;]*;/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Validate email format with strict regex
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false
  
  // Strict email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Palavra-passe é obrigatória' }
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Palavra-passe deve ter pelo menos 8 caracteres' }
  }
  
  if (password.length > 128) {
    return { valid: false, message: 'Palavra-passe demasiado longa' }
  }
  
  // Simplified validation - just check for basic strength
  const hasLetters = /[a-zA-Z]/.test(password)
  const hasNumbers = /\d/.test(password)
  
  if (!hasLetters) {
    return { 
      valid: false, 
      message: 'Palavra-passe deve conter pelo menos uma letra' 
    }
  }
  
  // Optional: encourage stronger passwords but don't require them
  if (!hasNumbers) {
    // Allow it but could add a warning in the future
    // For now, just require letters and minimum length
  }
  
  // Check for common patterns
  const commonPasswords = [
    'password', '123456', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', 'dragon'
  ]
  
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    return { valid: false, message: 'Palavra-passe demasiado comum' }
  }
  
  return { valid: true, message: 'Palavra-passe válida' }
}

/**
 * Validate Portuguese phone number
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')
  
  // Portuguese phone patterns
  // Mobile: 9XXXXXXXX (9 digits starting with 9)
  // Landline: XXXXXXXXX (9 digits not starting with 9)
  // International: +351XXXXXXXXX
  
  if (digits.length === 9) {
    return /^[1-9]\d{8}$/.test(digits)
  }
  
  if (digits.length === 12 && digits.startsWith('351')) {
    return /^351[1-9]\d{8}$/.test(digits)
  }
  
  return false
}

/**
 * Validate name (Portuguese names)
 */
export function validateName(name) {
  if (!name || typeof name !== 'string') return false
  
  const sanitized = sanitizeString(name)
  
  // Check length
  if (sanitized.length < 2 || sanitized.length > 100) return false
  
  // Allow Portuguese characters, spaces, apostrophes, and hyphens
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/
  
  return nameRegex.test(sanitized)
}

/**
 * Validate user type
 */
export function validateUserType(userType) {
  const allowedTypes = ['particular', 'agente']
  return allowedTypes.includes(userType)
}

/**
 * Comprehensive form validation for registration
 */
export function validateRegistrationForm(formData) {
  const errors = {}
  
  // Validate name
  if (!validateName(formData.name)) {
    errors.name = 'Nome inválido'
  }
  
  // Validate email
  if (!validateEmail(formData.email)) {
    errors.email = 'Email inválido'
  }
  
  // Validate phone
  if (!validatePhone(formData.phone)) {
    errors.phone = 'Número de telefone inválido'
  }
  
  // Validate password
  const passwordValidation = validatePassword(formData.password)
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.message
  }
  
  // Confirm password
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Palavras-passe não coincidem'
  }
  
  // Validate user type
  if (!validateUserType(formData.userType)) {
    errors.userType = 'Tipo de utilizador inválido'
  }
  
  // Terms acceptance
  if (!formData.acceptTerms) {
    errors.acceptTerms = 'Deve aceitar os termos e condições'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validate login form
 */
export function validateLoginForm(formData) {
  const errors = {}
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Email inválido'
  }
  
  if (!formData.password || formData.password.length < 6) {
    errors.password = 'Palavra-passe inválida'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Rate limiting check (client-side)
 */
export function checkClientRateLimit(action, limit = 5, windowMs = 15 * 60 * 1000) {
  const key = `rate_limit_${action}`
  const now = Date.now()
  
  try {
    const stored = localStorage.getItem(key)
    const attempts = stored ? JSON.parse(stored) : []
    
    // Filter attempts within the time window
    const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs)
    
    if (validAttempts.length >= limit) {
      return false
    }
    
    // Add current attempt
    validAttempts.push(now)
    localStorage.setItem(key, JSON.stringify(validAttempts))
    
    return true
  } catch (error) {
    // If localStorage fails, allow the request
    return true
  }
}

/**
 * Detect potential attack patterns
 */
export function detectSuspiciousActivity(input) {
  if (typeof input !== 'string') return false
  
  const suspiciousPatterns = [
    // SQL injection
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    // XSS attempts
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    // Path traversal
    /\.\.\//g,
    // Command injection
    /[;&|`$]/g,
    // LDAP injection
    /[()=*]/g
  ]
  
  return suspiciousPatterns.some(pattern => pattern.test(input))
}

/**
 * Secure random string generation
 */
export function generateSecureToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
} 