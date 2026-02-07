/**
 * Age-Adaptive Language System for Onboarding
 *
 * Tailors onboarding text based on user's age bracket to create a more
 * personally relevant experience. Uses 5 age brackets with distinct language
 * patterns:
 *
 * - Teen (13-17): Direct, simple language, avoiding abstract concepts
 * - Young Adult (18-25): Inspirational, universe/manifestation language
 * - Adult (26-40): Inspirational, universe/manifestation language
 * - Midlife (41-60): Reflective, acknowledges experience and growth
 * - Mature (61+): Wisdom-focused, honors life journey and continued growth
 */

/**
 * Age brackets for language adaptation
 */
export type AgeBracket = '13-17' | '18-25' | '26-40' | '41-60' | '61+'

/**
 * Contexts where adaptive language is used in onboarding flow
 */
export type LanguageContext =
  | 'welcome-tagline'
  | 'name-description'
  | 'quality-loved-description'
  | 'quality-desired-description'
  | 'idol-description'
  | 'selfie-description'
  | 'generating-description'
  | 'ideal-self-greeting'

/**
 * Language variants for each age bracket
 */
export interface LanguageVariant {
  teen: string        // 13-17
  youngAdult: string  // 18-25
  adult: string       // 26-40
  midlife: string     // 41-60
  mature: string      // 61+
}

/**
 * Language content map - 8 contexts × 5 age variants = 40 strings
 */
export const languageContent: Record<LanguageContext, LanguageVariant> = {
  'welcome-tagline': {
    teen: 'Start building the life you want',
    youngAdult: 'Meet the person you\'re becoming',
    adult: 'Meet the person you\'re becoming',
    midlife: 'Continue crafting your evolving self',
    mature: 'Honor your journey and continue growing'
  },
  'name-description': {
    teen: 'We\'re here to help you figure out what you\'re creating',
    youngAdult: 'We\'re here to help you understand the universe you\'re creating',
    adult: 'We\'re here to help you understand the universe you\'re creating',
    midlife: 'We\'re here to support you in crafting the reality you\'re building',
    mature: 'We\'re here to honor the wisdom you bring to the journey you\'re on'
  },
  'quality-loved-description': {
    teen: 'What you love about yourself is your foundation. Recognizing your strengths helps you grow into who you want to be.',
    youngAdult: 'Your present strengths are the foundation of your transformation. Recognizing what you cherish about yourself anchors the reality you\'re shifting toward.',
    adult: 'Your present strengths are the foundation of your transformation. Recognizing what you cherish about yourself anchors the reality you\'re shifting toward.',
    midlife: 'Your current strengths reflect years of growth. Recognizing what you value in yourself grounds the evolution you\'re guiding.',
    mature: 'The qualities you\'ve cultivated over a lifetime are your foundation. Honoring what you love about yourself anchors the continued journey.'
  },
  'quality-desired-description': {
    teen: 'What you want to develop shows where you\'re headed. Naming the qualities you\'re aiming for helps make them real.',
    youngAdult: 'Your aspirations define the shape of your becoming. Naming the qualities you seek begins to collapse the possibility into reality.',
    adult: 'Your aspirations define the shape of your becoming. Naming the qualities you seek begins to collapse the possibility into reality.',
    midlife: 'The qualities you aspire to cultivate define your next chapter. Naming what you seek clarifies the path forward.',
    mature: 'The wisdom you continue to seek enriches your lifelong journey. Naming these aspirations honors your commitment to growth.'
  },
  'idol-description': {
    teen: 'Think of someone who has qualities you admire. They can be anyone—real or fictional—who shows you what\'s possible.',
    youngAdult: 'Consider someone—real or fictional—who embodies the qualities you aspire to. Their existence proves the reality you seek is attainable.',
    adult: 'Consider someone—real or fictional—who embodies the qualities you aspire to. Their existence proves the reality you seek is attainable.',
    midlife: 'Reflect on someone whose qualities resonate with your aspirations. Their example illuminates the path you\'re crafting.',
    mature: 'Think of someone whose life or character reflects the wisdom you value. Their journey can inspire your continued evolution.'
  },
  'selfie-description': {
    teen: 'This helps us show you what your future self could look like',
    youngAdult: 'This helps us create a visual representation of your ideal self',
    adult: 'This helps us create a visual representation of your ideal self',
    midlife: 'This helps us craft a visual reflection of your evolved self',
    mature: 'This helps us honor your journey by visualizing your continued growth'
  },
  'generating-description': {
    teen: 'We\'re creating an image of the person you\'re working to become. This usually takes about 30 seconds.',
    youngAdult: 'We\'re manifesting a visual representation of your ideal self. This quantum leap typically takes about 30 seconds.',
    adult: 'We\'re manifesting a visual representation of your ideal self. This quantum leap typically takes about 30 seconds.',
    midlife: 'We\'re crafting a visual reflection of your evolved self. This thoughtful process typically takes about 30 seconds.',
    mature: 'We\'re creating an image that honors your continued growth. This meaningful process typically takes about 30 seconds.'
  },
  'ideal-self-greeting': {
    teen: 'Meet the person you\'re becoming',
    youngAdult: 'Meet your ideal self',
    adult: 'Meet your ideal self',
    midlife: 'Witness your evolved self',
    mature: 'Honor your continuing journey'
  }
}

/**
 * Classifies age into appropriate bracket
 *
 * @param age - User's age
 * @returns Age bracket classification
 *
 * @example
 * getAgeBracket(15) // '13-17'
 * getAgeBracket(22) // '18-25'
 * getAgeBracket(70) // '61+'
 */
export function getAgeBracket(age: number): AgeBracket {
  if (age >= 13 && age <= 17) return '13-17'
  if (age >= 18 && age <= 25) return '18-25'
  if (age >= 26 && age <= 40) return '26-40'
  if (age >= 41 && age <= 60) return '41-60'
  return '61+'
}

/**
 * Gets age-appropriate language for a given context
 *
 * @param context - The onboarding context (e.g., 'name-description')
 * @param userAge - User's age
 * @returns Age-appropriate text for the context
 *
 * @example
 * getAdaptiveLanguage('name-description', 15)
 * // Returns: "We're here to help you figure out what you're creating"
 *
 * getAdaptiveLanguage('name-description', 50)
 * // Returns: "We're here to support you in crafting the reality you're building"
 */
export function getAdaptiveLanguage(context: LanguageContext, userAge: number): string {
  const bracket = getAgeBracket(userAge)
  const variants = languageContent[context]

  switch (bracket) {
    case '13-17':
      return variants.teen
    case '18-25':
      return variants.youngAdult
    case '26-40':
      return variants.adult
    case '41-60':
      return variants.midlife
    case '61+':
      return variants.mature
    default:
      return variants.youngAdult // Fallback to young adult
  }
}

/**
 * Gets all language variants for a context
 *
 * @param context - The onboarding context
 * @returns All age variants for the context
 *
 * @example
 * getLanguageVariants('name-description')
 * // Returns: { teen: "...", youngAdult: "...", adult: "...", midlife: "...", mature: "..." }
 */
export function getLanguageVariants(context: LanguageContext): LanguageVariant {
  return languageContent[context]
}

/**
 * Checks if a context has language variants defined
 *
 * @param context - The onboarding context to check
 * @returns True if variants exist for this context
 *
 * @example
 * hasLanguageVariants('name-description') // true
 */
export function hasLanguageVariants(context: LanguageContext): boolean {
  return context in languageContent
}
