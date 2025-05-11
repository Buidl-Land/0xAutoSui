# UI Styling Guidelines

This document outlines the general UI styling guidelines for the 0xAuto OS project.

## 1. Color Schemes

Two primary color schemes are to be considered:

### 1.1. Blue/White Scheme (Primary)
*   **Primary Color:** A modern, clean blue (e.g., `#007AFF` - Apple Blue, or a slightly more vibrant variant like `#0A84FF`).
*   **Secondary/Accent Color:** A lighter shade of blue or a complementary color like a subtle orange or teal for calls to action if needed (e.g., `#5AC8FA` for lighter blue, `#FF9500` for orange accent).
*   **Background Colors:**
    *   Main Background: White (`#FFFFFF`) or a very light off-white/gray (e.g., `#F2F2F7` - Apple Light Gray).
    *   Card/Section Backgrounds: White (`#FFFFFF`) or slightly darker off-white if main background is pure white.
*   **Text Colors:**
    *   Primary Text: Dark Gray / Near Black (e.g., `#1D1D1F` - Apple Dark Gray).
    *   Secondary Text: Medium Gray (e.g., `#8A8A8E` - Apple Medium Gray).
    *   Link Text: Primary Blue.
*   **Gradients:** Subtle gradients using shades of the primary blue, or blue-to-light-blue/white.

### 1.2. Black/Purple Scheme (Alternative/Dark Mode)
*   **Primary Color:** A deep, rich purple (e.g., `#5856D6` - Apple Indigo, or `#7D5FFF`).
*   **Secondary/Accent Color:** A vibrant pink, magenta, or a contrasting light blue/cyan (e.g., `#AF52DE` for pink/magenta, `#00C7BE` for cyan).
*   **Background Colors:**
    *   Main Background: Very Dark Gray / Near Black (e.g., `#000000` or `#1C1C1E` - Apple Dark Mode Background).
    *   Card/Section Backgrounds: Slightly lighter dark gray (e.g., `#2C2C2E` or `#3A3A3C`).
*   **Text Colors:**
    *   Primary Text: Light Gray / Off-White (e.g., `#E5E5EA`).
    *   Secondary Text: Medium Gray (e.g., `#8E8E93`).
    *   Link Text: Primary Purple or Accent Color.
*   **Gradients:** Subtle gradients using shades of purple, or purple-to-darker-purple/black, or purple-to-accent.

## 2. Visual Styles

Incorporate a blend of the following styles for a modern, clean, and engaging "Web3 feel":

### 2.1. Glassmorphism
*   **Usage:** Apply to card backgrounds, sidebars, modal dialogs, or header elements.
*   **Characteristics:**
    *   Frosted glass effect (background blur).
    *   Subtle transparency.
    *   Thin, light-colored borders to define edges.
    *   Shadows to create depth and lift elements off the background.
    *   // TEST: Glassmorphic elements have noticeable blur and transparency.
    *   // TEST: Borders on glassmorphic elements are subtle.

### 2.2. Flat Design
*   **Usage:** For icons, buttons, and general layout structure.
*   **Characteristics:**
    *   Minimalist approach, avoiding skeuomorphism.
    *   Clean lines and sharp edges (can be softened with rounded corners).
    *   Use of solid colors, potentially with subtle gradients.
    *   Focus on typography and clear visual hierarchy.
    *   // TEST: UI elements primarily use flat design principles.

### 2.3. Apple-style Elements
*   **Usage:** Influence for overall aesthetics, typography, iconography, and interaction patterns.
*   **Characteristics:**
    *   Generous white space.
    *   High-quality, legible typography (e.g., San Francisco font family or similar sans-serif).
    *   Subtle shadows and rounded corners on elements like cards and buttons.
    *   Clean and intuitive iconography (e.g., SF Symbols style).
    *   Smooth transitions and animations.
    *   // TEST: UI exhibits Apple-like design language in spacing, typography, and element styling.

### 2.4. Smooth Lines and Rounded Corners
*   **Usage:** Apply to buttons, input fields, cards, and container elements.
*   **Characteristics:**
    *   Avoid sharp, 90-degree corners where possible; prefer a subtle corner radius (e.g., 4px, 8px, 12px depending on element size).
    *   Lines should be clean and well-defined, but not overly heavy.
    *   // TEST: Key UI elements have rounded corners.

### 2.5. Gradients
*   **Usage:** For backgrounds (subtly), buttons (for emphasis), or decorative elements.
*   **Characteristics:**
    *   Smooth transitions between colors.
    *   Can be linear or radial.
    *   Often used with primary/accent colors from the chosen scheme.
    *   Avoid overly complex or harsh gradients.
    *   // TEST: Gradients are smooth and use scheme-appropriate colors.

## 3. Animations and SVGs ("Web3 Feel")

*   **Animations:**
    *   **Purpose:** Enhance user experience, provide feedback, and guide attention without being distracting.
    *   **Types:**
        *   Subtle hover effects on interactive elements (buttons, links, cards).
        *   Smooth page transitions.
        *   Loading animations (e.g., spinners, progress bars with a modern feel).
        *   Micro-interactions on form submissions or state changes.
        *   Data visualization animations if applicable (e.g., charts updating smoothly).
    *   **Feel:** Fluid, responsive, and modern. Avoid jarring or slow animations.
    *   // TEST: Interactive elements have hover effects.
    *   // TEST: Page transitions are smooth.
*   **SVGs:**
    *   **Usage:** For icons, illustrations, and potentially for animated decorative elements.
    *   **Style:** Clean, modern, and scalable. Can incorporate flat design or subtle gradient fills.
    *   **"Web3 Feel" SVGs:** Consider abstract geometric patterns, network/node visuals, futuristic or tech-inspired illustrations. These should be used judiciously to enhance the theme without cluttering the UI.
    *   Examples:
        *   Icons for "Agent", "MCP", "Wallet" could have a slightly futuristic or abstract touch.
        *   Background patterns or subtle animated SVGs in hero sections or empty states.
    *   // TEST: Icons are SVG-based and stylistically consistent.
    *   // TEST: "Web3 feel" SVGs are incorporated appropriately.

## 4. Typography

*   **Font Family:** Prioritize a clean, modern, and highly legible sans-serif font.
    *   Primary Suggestion: System fonts (e.g., San Francisco for Apple devices, Roboto for Android/Material, Segoe UI for Windows). This ensures good performance and native feel.
    *   Alternative: A well-chosen web font like Inter, Poppins, or Manrope.
*   **Hierarchy:** Establish a clear typographic scale for headings (H1, H2, H3, etc.), body text, captions, and labels.
*   **Line Spacing & Kerning:** Ensure comfortable readability with appropriate line height and letter spacing.
*   // TEST: Consistent and legible font is used throughout the application.
*   // TEST: Clear typographic hierarchy is established.

## 5. Accessibility (General Note)

*   Ensure sufficient color contrast between text and backgrounds to meet WCAG AA guidelines.
*   Interactive elements should have clear focus states.
*   // TEST: Color contrast ratios meet accessibility standards.

These guidelines should be applied consistently across all pages and components of the application.