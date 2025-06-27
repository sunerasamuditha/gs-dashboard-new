// Responsive utilities and constants
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1200,
  xxl: 1440,
};

export const getBreakpoint = (width) => {
  if (width >= BREAKPOINTS.xxl) return 'xxl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

export const isBreakpoint = (width, breakpoint) => {
  return width >= BREAKPOINTS[breakpoint];
};

export const getResponsiveValue = (values, width) => {
  const breakpoint = getBreakpoint(width);
  return values[breakpoint] || values.xs || values.default;
};

// 3D Map responsive configurations
export const MAP_CONFIGS = {
  xs: {
    camera: { distance: 50, fov: 65 },
    labelScale: 0.7,
    modelScale: 28,
    controls: { enabled: false },
    zoomButtons: { position: 'bottom-right', size: 'small' }
  },
  sm: {
    camera: { distance: 45, fov: 62 },
    labelScale: 0.8,
    modelScale: 30,
    controls: { enabled: false },
    zoomButtons: { position: 'bottom-right', size: 'small' }
  },
  md: {
    camera: { distance: 40, fov: 60 },
    labelScale: 0.9,
    modelScale: 32,
    controls: { enabled: true },
    zoomButtons: { position: 'bottom-right', size: 'medium' }
  },
  lg: {
    camera: { distance: 35, fov: 60 },
    labelScale: 1,
    modelScale: 34,
    controls: { enabled: true },
    zoomButtons: { position: 'bottom-right', size: 'medium' }
  },
  xl: {
    camera: { distance: 30, fov: 60 },
    labelScale: 1,
    modelScale: 36,
    controls: { enabled: true },
    zoomButtons: { position: 'bottom-right', size: 'large' }
  },
  xxl: {
    camera: { distance: 30, fov: 60 },
    labelScale: 1.1,
    modelScale: 36,
    controls: { enabled: true },
    zoomButtons: { position: 'bottom-right', size: 'large' }
  }
};

export const getMapConfig = (width) => {
  const breakpoint = getBreakpoint(width);
  return MAP_CONFIGS[breakpoint];
};
