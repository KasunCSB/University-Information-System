import React from 'react'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function ResponsiveContainer({ 
  children, 
  className = '', 
  as: Component = 'div' 
}: ResponsiveContainerProps) {
  return (
    <Component className={`container-responsive ${className}`}>
      {children}
    </Component>
  )
}

interface ResponsiveGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function ResponsiveGrid({ 
  children, 
  columns = 3, 
  className = '' 
}: ResponsiveGridProps) {
  const gridClasses = {
    2: 'grid-responsive-2',
    3: 'grid-responsive-3',
    4: 'grid-responsive-4'
  }

  return (
    <div className={`${gridClasses[columns]} ${className}`}>
      {children}
    </div>
  )
}

interface ResponsiveCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function ResponsiveCard({ 
  children, 
  className = '', 
  hover = true 
}: ResponsiveCardProps) {
  const hoverClasses = hover ? 'hover:transform hover:-translate-y-1' : ''
  
  return (
    <div className={`card-responsive ${hoverClasses} ${className}`}>
      {children}
    </div>
  )
}

interface ResponsiveTextProps {
  children: React.ReactNode
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  className?: string
  as?: React.ElementType
}

export function ResponsiveText({ 
  children, 
  size = 'base', 
  className = '',
  as: Component = 'p'
}: ResponsiveTextProps) {
  const sizeClasses = {
    xs: 'text-responsive-xs',
    sm: 'text-responsive-sm',
    base: 'text-responsive-base',
    lg: 'text-responsive-lg',
    xl: 'text-responsive-xl',
    '2xl': 'text-responsive-2xl',
    '3xl': 'text-responsive-3xl',
    '4xl': 'text-responsive-4xl'
  }

  return (
    <Component className={`${sizeClasses[size]} ${className}`}>
      {children}
    </Component>
  )
}

interface ResponsiveButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export function ResponsiveButton({ 
  children, 
  variant = 'primary', 
  className = '',
  onClick,
  type = 'button',
  disabled = false
}: ResponsiveButtonProps) {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary'
  }

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}

interface SectionProps {
  children: React.ReactNode
  className?: string
  background?: 'light' | 'dark' | 'primary' | 'secondary'
}

export function Section({ 
  children, 
  className = '',
  background = 'light'
}: SectionProps) {
  const backgroundClasses = {
    light: 'bg-white dark:bg-gray-900',
    dark: 'bg-gray-50 dark:bg-gray-800',
    primary: 'bg-blue-600',
    secondary: 'bg-gray-100 dark:bg-gray-800'
  }

  return (
    <section className={`section-padding ${backgroundClasses[background]} ${className}`}>
      {children}
    </section>
  )
}
