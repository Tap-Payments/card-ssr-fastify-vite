# Types & Interfaces

## Overview

All types defined in `src/types/` provide TypeScript type safety for configuration, events, and data structures.

## Type Conventions

- **Interfaces**: Define object shapes
- **Enums**: Fixed value sets
- **Type Aliases**: Union types and utilities
- **Exports**: Centralized via `index.ts`

## Core Enums

### Scope

```typescript
enum Scope {
  TOKEN = 'Token',
  AUTHENTICATED_TOKEN = 'AuthenticatedToken'
}
```

**Purpose**: Defines token generation intent

### Theme

```typescript
enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  DYNAMIC = 'dynamic'
}
```

**Purpose**: UI theme mode

### Locale

```typescript
enum Locale {
  AR = 'ar',
  EN = 'en',
  DYNAMIC = 'dynamic'
}
```

**Purpose**: Language/localization

### Direction

```typescript
enum Direction {
  LTR = 'ltr',
  RTL = 'rtl',
  DYNAMIC = 'dynamic'
}
```

**Purpose**: Card form direction

### Edges

```typescript
enum Edges {
  STRAIGHT = 'straight',
  CURVED = 'curved',
  CIRCULAR = 'circular'
}
```

**Purpose**: Border style

### Currencies

```typescript
enum Currencies {
  AED = 'AED',
  BHD = 'BHD',
  EGP = 'EGP',
  EUR = 'EUR',
  GBP = 'GBP',
  KWD = 'KWD',
  OMR = 'OMR',
  QAR = 'QAR',
  SAR = 'SAR',
  USD = 'USD'
}
```

**Purpose**: Supported currencies

### Schemes

```typescript
enum Schemes {
  BENEFIT = 'BENEFIT',
  VISA = 'VISA',
  AMEX = 'AMEX',
  MASTERCARD = 'MASTERCARD',
  MADA = 'MADA',
  MEEZA = 'MEEZA',
  OMANNET = 'OMANNET'
}
```

**Purpose**: Card brand schemes

## Configuration Types

### CardElementProps

**Location**: `src/types/config.ts`

```typescript
interface CardElementProps {
  config: CardBaseConfig
  onReady?: () => void
  onFocus?: (flag: boolean) => void
  onBinIdentification?: (data: any) => void
  onValidInput?: (data: any) => void
  onInvalidInput?: (data: any) => void
  onError?: (data: any) => void
  onSuccess?: (data: any) => void
  // ... more event handlers
}
```

**Purpose**: Main props interface for TapCard component

### CardBaseConfig

```typescript
interface CardBaseConfig {
  scope?: Scope
  operator: {
    publicKey: string
  }
  order: {
    amount: number
    currency: Currencies
    id?: string
    description?: string
    reference?: string
    metadata?: Record<string, string>
  }
  customer?: Customer
  merchant?: { id?: string }
  invoice?: { id: string }
  interface?: UiInterface
  features?: Features
  acceptance?: Acceptance
  fieldVisibility?: FieldVisibility
  post?: { url: string }
  // ... more config options
}
```

**Purpose**: Core configuration object

### Customer

```typescript
interface Customer {
  id?: string
  name?: {
    lang: Locale
    first: string
    last: string
    middle?: string
  }[]
  nameOnCard?: string
  editable?: boolean
  contact?: {
    email?: string
    phone?: {
      countryCode: string
      number: string
    }
  }
}
```

**Purpose**: Customer information

### UiInterface

```typescript
interface UiInterface {
  locale?: Locale
  theme?: Theme
  edges?: Edges
  cardDirection?: Direction
  powered?: boolean
  colorStyle?: ColorStyle
  loader?: boolean
}
```

**Purpose**: UI customization options

### Features

```typescript
interface Features {
  acceptanceBadge?: boolean
  alternativeCardInputs?: {
    cardScanner?: boolean
    cardNFC?: boolean
  }
  customerCards?: {
    saveCard?: boolean
    autoSaveCard?: boolean
  }
}
```

**Purpose**: Feature flags

### Acceptance

```typescript
interface Acceptance {
  supportedSchemes?: SupportedScheme[]
  supportedFundSource?: string[]
  supportedPaymentAuthentications?: string[]
  supportedRegions?: SupportedRegion[]
  supportedCountries?: SupportedCountry[]
  supportedPaymentTypes?: SupportedPaymentType[]
}
```

**Purpose**: Payment acceptance settings

## Event Types

### EventType

```typescript
type EventType =
  | 'loadingIframe'
  | '3dsRedirect'
  | 'tokenize'
  | 'token'
  | 'error'
  | 'bin'
  | 'onCardReady'
  | 'focused'
  // ... more event types
```
**Purpose**: PostMessage event types

### EventData

```typescript
interface EventData<T = any> {
  event: EventType
  data: T
}
```

**Purpose**: PostMessage payload structure

### CardElementEvents

```typescript
interface CardElementEvents {
  onReady?: () => void
  onFocus?: (flag: boolean) => void
  onBinIdentification?: (data: any) => void
  onValidInput?: (data: any) => void
  onInvalidInput?: (data: any) => void
  onError?: (data: any) => void
  onSuccess?: (data: any) => void
  on3dsRedirect?: (data: any) => void
  on3dsFinish?: () => void
  // ... more handlers
}
```

**Purpose**: Event handler callbacks

## Utility Types

### CardInputs

```typescript
interface CardInputs {
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cardHolderName?: string
}
```

**Purpose**: Programmatic card input filling

### PaymentOptionsUpdateI

```typescript
interface PaymentOptionsUpdateI {
  locale?: string
  showBrands?: boolean
  showLoadingState?: boolean
  collectHolderName?: boolean
  preLoadCardName?: string
  amount?: number
  currencyCode?: string[] | string
  sortedCurrencyCode?: string
  clickToPay?: {
    enabled: boolean
  }
}
```

**Purpose**: Dynamic configuration updates

## Type Utilities

### ExtendableString

```typescript
type ExtendableString<T extends string> = T | (string & {})
```

**Purpose**: Allow string extension while maintaining type safety

### Supported Types

```typescript
type SupportedRegion = ExtendableString<`${Regions}`>
type SupportedCountry = string
type SupportedPaymentType = ExtendableString<`${PaymentTypes}`>
type SupportedScheme = ExtendableString<`${Schemes}`>
```

**Purpose**: Flexible but type-safe option types

## Usage Examples

### Component Props

```typescript
import type { CardElementProps } from '@tap-payments/card-web'

const props: CardElementProps = {
  config: {
    operator: { publicKey: 'pk_test_...' },
    scope: Scope.TOKEN,
    order: { amount: 100, currency: Currencies.SAR }
  },
  onSuccess: (data) => console.log(data)
}
```

### Event Handler

```typescript
import type { CardElementEvents } from '@tap-payments/card-web'

const handlers: CardElementEvents = {
  onReady: () => console.log('Ready'),
  onError: (error) => console.error(error)
}
```

### Configuration Update

```typescript
import type { PaymentOptionsUpdateI } from '@tap-payments/card-web'

const update: PaymentOptionsUpdateI = {
  amount: 200,
  currencyCode: Currencies.AED
}
```

## Best Practices

1. **Use Enums**: Prefer enums over string literals
2. **Type Imports**: Use `import type` for type-only imports
3. **Interface Extensions**: Extend interfaces when needed
4. **Optional Properties**: Mark optional fields with `?`
5. **Type Guards**: Use type guards for runtime validation

## Next Steps

- [Components](./05-components.md) - Component details
- [Configuration](./07-config.md) - Configuration options
- [Development Guide](./09-development-guide.md) - Adding features
