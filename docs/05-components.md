# Component Architecture

## Overview

The client-side UI is built using React components organized by functionality in `src/client/components/`.

## Component Categories

### 1. Layout Components (`src/client/components/layout/`)
Manage the overall structure and positioning of elements.
- **CardLayout**: The main container for the card form.
- **Section**: Reusable section wrappers.
- **Grid/Flex**: Basic positioning components.

### 2. Input Components (`src/client/components/inputs/`)
The core of the SDK, handling user data collection.
- **CardNumberInput**: Masked input for card numbers with brand detection.
- **ExpiryDateInput**: Month/Year selection or masked input.
- **CVVInput**: Secure CVV entry.
- **CardHolderInput**: Name on card collection.

### 3. Icon Components (`src/client/components/icons/`)
Dynamic SVG icons for card brands and UI feedback.
- **PaymentIcons**: Visa, Mastercard, AMEX, etc.
- **StatusIcons**: Success, Error, Info indicators.

### 4. Animation Components (`src/client/components/Animation/`)
Lottie and Framer Motion based animations.
- **Loaders**: Spinners and skeleton screens.
- **Transitions**: Smooth state changes between form sections.

### 5. Shared Components (`src/client/components/shared/`)
Primitive UI elements used across the application.
- **Buttons**, **Tooltips**, **Modals**.

## State & Data Flow

Components use a combination of:
- **Redux Toolkit**: For global application state (e.g., config, card data).
- **React Hooks**: For local UI state and form validation.
- **Custom Hooks**: (e.g., `useTokenization`) to handle business logic separate from UI.

## Styling

- **Vanilla CSS / CSS Modules**: Used for component-level styling to avoid global conflicts.
- **Dynamic Theming**: Styles are derived from the project's theme configuration (Light/Dark/System).

## Next Steps

- [Folder Structure](./06-folder-structure.md) - Project organization
- [Development Guide](./09-development-guide.md) - Creating new components
- [Architecture](./03-architecture.md) - System-level communication
