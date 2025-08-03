// Frontend validation utilities to match backend validation

export const ValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255,
    validate: (email: string): { isValid: boolean; message?: string } => {
      if (!email) {
        return { isValid: false, message: 'Email is required' };
      }
      if (!ValidationRules.email.pattern.test(email)) {
        return { isValid: false, message: 'Please provide a valid email address' };
      }
      if (email.length > ValidationRules.email.maxLength) {
        return { isValid: false, message: 'Email is too long' };
      }
      return { isValid: true };
    }
  },

  username: {
    pattern: /^[a-zA-Z0-9_]+$/,
    minLength: 3,
    maxLength: 50,
    validate: (username: string): { isValid: boolean; message?: string } => {
      if (!username) {
        return { isValid: false, message: 'Username is required' };
      }
      if (username.length < ValidationRules.username.minLength) {
        return { isValid: false, message: `Username must be at least ${ValidationRules.username.minLength} characters long` };
      }
      if (username.length > ValidationRules.username.maxLength) {
        return { isValid: false, message: `Username cannot be longer than ${ValidationRules.username.maxLength} characters` };
      }
      if (!ValidationRules.username.pattern.test(username)) {
        return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
      }
      return { isValid: true };
    }
  },

  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    minLength: 8,
    validate: (password: string): { isValid: boolean; message?: string } => {
      if (!password) {
        return { isValid: false, message: 'Password is required' };
      }
      if (password.length < ValidationRules.password.minLength) {
        return { isValid: false, message: `Password must be at least ${ValidationRules.password.minLength} characters long` };
      }
      if (!ValidationRules.password.pattern.test(password)) {
        return { 
          isValid: false, 
          message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)' 
        };
      }
      return { isValid: true };
    }
  },

  token: {
    // JWT tokens are typically 100+ characters long
    pattern: /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
    minLength: 20, // Minimum realistic JWT length
    validate: (token: string): { isValid: boolean; message?: string } => {
      if (!token) {
        return { isValid: false, message: 'Verification token is required' };
      }
      if (token.length < ValidationRules.token.minLength) {
        return { isValid: false, message: 'Invalid verification token format' };
      }
      if (!ValidationRules.token.pattern.test(token)) {
        return { isValid: false, message: 'Invalid verification token format' };
      }
      return { isValid: true };
    }
  }
};

export const validateForm = (data: Record<string, string>, rules: Record<string, keyof typeof ValidationRules>) => {
  const errors: Record<string, string> = {};
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field] || '';
    const validation = ValidationRules[rule].validate(value);
    
    if (!validation.isValid && validation.message) {
      errors[field] = validation.message;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Password strength indicator
export const getPasswordStrength = (password: string): { 
  score: number; 
  feedback: string[];
  color: string;
} => {
  let score = 0;
  const feedback: string[] = [];
  
  if (password.length >= 8) score += 1;
  else feedback.push('At least 8 characters');
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('One lowercase letter');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('One uppercase letter');
  
  if (/\d/.test(password)) score += 1;
  else feedback.push('One number');
  
  if (/[@$!%*?&]/.test(password)) score += 1;
  else feedback.push('One special character (@$!%*?&)');
  
  const colors = ['red', 'red', 'orange', 'yellow', 'green', 'green'];
  
  return {
    score,
    feedback,
    color: colors[score] || 'red'
  };
};
