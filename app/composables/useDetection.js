export function useDetection() {
  const isPhone = () =>
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('phone')

  const isTablet = () =>
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('tablet')

  const isDesktop = () =>
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('desktop')

  return { isPhone, isTablet, isDesktop }
}