/**
 * Utility functions for carousel components
 */

/**
 * Check if a carousel button should be displayed
 * Returns true only if both button text and URL are non-empty strings AND the button is active
 */
export const shouldShowCarouselButton = (buttonText?: string, buttonUrl?: string, buttonActive?: boolean): boolean => {
  return !!(buttonText && buttonText.trim() !== '' && buttonUrl && buttonUrl.trim() !== '' && (buttonActive ?? true))
}

/**
 * Check if any carousel buttons should be displayed for a slide
 */
export const hasVisibleButtons = (
  primaryText?: string, 
  primaryUrl?: string, 
  secondaryText?: string, 
  secondaryUrl?: string,
  primaryActive?: boolean,
  secondaryActive?: boolean
): boolean => {
  return shouldShowCarouselButton(primaryText, primaryUrl, primaryActive) || 
         shouldShowCarouselButton(secondaryText, secondaryUrl, secondaryActive)
}