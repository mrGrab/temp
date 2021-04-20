import deepmerge from "/vendor/deepmerge";

import { createMuiTheme } from "/vendor/@material-ui/core";
import createPalette from "/vendor/@material-ui/core/styles/createPalette";
import createTypography from "/vendor/@material-ui/core/styles/createTypography";

import makeDefaults from "./defaults";

function getTypography(typography, palette) {
  if (typeof typography === "function") {
    return typography(palette);
  }
  return typography;
}

function createTheme(theme, type = "light") {
  const defaults = makeDefaults(type);

  // Apply palette first so that we can use it else where
  const paletteInputs = deepmerge(defaults.palette, theme.palette);
  const palette = createPalette(paletteInputs);

  // Create typography using defaults and configured palette
  const typographyInputs = deepmerge(
    getTypography(defaults.typography, palette),
    getTypography(theme.typography || {}, palette),
  );
  const typography = createTypography(palette, typographyInputs);

  // Merge remaining attributes
  const rest = deepmerge(defaults, theme);
  return createMuiTheme({
    ...rest,
    palette,
    typography,
  });
}

export default createTheme;
