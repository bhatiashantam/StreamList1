export const colors = {
    // Surfaces — layered from deepest to brightest
    surface:                   '#131313',  // Main app background
    surface_container_lowest:  '#0E0E0E',  // Deepest recessed elements
    surface_container_low:     '#1C1B1B',  // Section groupings
    surface_container:         '#232323',  // Mid-level containers
    surface_container_high:    '#2A2A2A',  // Elevated sections
    surface_container_highest: '#353534',  // Cards, interactive elements
    surface_bright:            '#3A3939',  // Hover/pressed states
  
    // Primary accent (Coral-Red)
    primary:                   '#FFB3AE',  // Gradient start / light tint
    primary_container:         '#FF5351',  // Gradient end / strong accent
    secondary_container:       '#822625',  // Rating chip (dark reddish-brown)
    /** Full-width detail header blur tint (over BlurView) */
    detail_header_scrim:       'rgba(10, 10, 10, 0.52)',
    /** Android @react-native-community/blur overlay — keep translucent so blur stays visible */
    header_blur_android_overlay: 'rgba(22, 22, 22, 0.33)',
    /** Circular back/share glass — tint above BlurView */
    header_glass_icon_overlay:   'rgba(38, 38, 38, 0.40)',
    /** Full-width detail header bar — tint above BlurView */
    header_bar_glass_overlay:    'rgba(14, 14, 14, 0.34)',
    /** Text + icons on coral “Add to Watchlist” gradient (dark, per design) */
    on_primary_gradient:       '#1C1B1B',
    /**
     * Outlined / ghost controls (e.g. “In Watchlist”) — border + label + icons.
     * Light coral (#FFB3AE), not primary_container, so it matches the mock’s thin coral stroke.
     */
    watchlist_ghost_accent:    '#FFB3AE',
    /** Small uppercase captions on dark (neutral grey, not pink-tinted variant text) */
    on_surface_caption:        '#9A9694',
  
    // Text
    on_surface:                '#E5E2E1',  // Primary text — never use pure white
    on_surface_variant:        '#E4BDBA',  // Secondary metadata text
    /** Icons / labels on dark hero imagery and primary gradient CTAs */
    on_hero:                   '#FFFFFF',
  
    // Utility
    outline_variant:           'rgba(255,255,255,0.15)', // Ghost borders (accessibility only)

    /** Tab bar glass overlay — BlurView + tint (matches #232323 @ 70% opacity) */
    tab_bar_overlay:           'rgba(35,35,35,0.70)',
  };
