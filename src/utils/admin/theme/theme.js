import _ from "lodash"
import { createTheme } from "@mui/material/styles"
import { useEffect } from "react"
import typography from "./typography"
import { shadows , colorTheme, customizer} from "./constants"
import * as locales from "@mui/material/locale"

export const BuildTheme = (config = {}) => {
  const themeOptions = colorTheme

  const defaultTheme = colorTheme
  const defaultShadow =  shadows
  const themeSelect =
    customizer.activeMode == themeOptions
  const baseMode = {
    palette: {
      mode: customizer.activeMode
    },
    shape: {
      borderRadius: customizer.borderRadius
    },
    shadows: defaultShadow,
    typography: typography
  }
  const theme = createTheme(
    _.merge({}, baseMode, defaultTheme, locales, themeSelect, {
      direction: config.direction
    })
  )
  // theme.components = components(theme)

  return theme
}

const ThemeSettings = () => {
  const activDir = {}
  const activeTheme = {}
  const theme = BuildTheme({
    direction: activDir,
    theme: activeTheme
  })
  useEffect(() => {
    document.dir = activDir
  }, [activDir])

  return theme
}

export { ThemeSettings }
