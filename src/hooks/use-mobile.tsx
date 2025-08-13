import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const update = () => {
      setIsMobile(mql.matches)
    }

    // Set initial state
    update()

    // Add cross-browser listeners
    if ('addEventListener' in mql) {
      mql.addEventListener('change', update)
      return () => mql.removeEventListener('change', update)
    } else {
      // @ts-ignore - Safari <14 support
      mql.addListener(update)
      // @ts-ignore
      return () => mql.removeListener(update)
    }
  }, [])

  return !!isMobile
}
