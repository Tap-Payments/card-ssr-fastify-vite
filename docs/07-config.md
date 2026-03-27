# Configuration

## Overview

SDK configuration passed via `config` prop to `TapCard` component or `renderTapCard` function. All configuration is optional except `operator.publicKey`, `scope`, and `order`.

## Required Configuration

### operator

```typescript
operator: {
  publicKey: string  // REQUIRED: Tap Payments public key
}
```

**Example**:
```typescript
operator: {
  publicKey: 'pk_test_YhUjg9PNT8oDlKJ1aE2fMRz7'
}
```

### scope

```typescript
scope: Scope  // REQUIRED: Token scope
```

**Values**:
- `Scope.TOKEN` - Generate token for later use
- `Scope.AUTHENTICATED_TOKEN` - Generate authenticated token ready for charge

### order

```typescript
order: {
  amount: number      // REQUIRED: Order amount
  currency: Currencies // REQUIRED: Currency code
  id?: string         // Optional: Existing order ID
  description?: string // Optional: Order description
  reference?: string   // Optional: Merchant reference
  metadata?: Record<string, string> // Optional: Custom metadata
}
```

**Example**:
```typescript
order: {
  amount: 100,
  currency: Currencies.SAR,
  description: 'Test Order',
  reference: 'order_123'
}
```

## Optional Configuration

### customer

```typescript
customer?: {
  id?: string  // Optional: Existing customer ID
  name?: Array<{
    lang: Locale
    first: string
    last: string
    middle?: string
  }>
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

**Example**:
```typescript
customer: {
  name: [{
    lang: Locale.EN,
    first: 'John',
    last: 'Doe',
    middle: 'Middle'
  }],
  nameOnCard: 'JOHN DOE',
  editable: true,
  contact: {
    email: 'john@example.com',
    phone: {
      countryCode: '+966',
      number: '500000000'
    }
  }
}
```

### interface

```typescript
interface?: {
  locale?: Locale           // 'en' | 'ar' | 'dynamic'
  theme?: Theme             // 'light' | 'dark' | 'dynamic'
  edges?: Edges             // 'straight' | 'curved' | 'circular'
  cardDirection?: Direction  // 'ltr' | 'rtl' | 'dynamic'
  powered?: boolean         // Show "Powered by Tap"
  colorStyle?: ColorStyle   // 'colored' | 'monochrome'
  loader?: boolean          // Show loading state
}
```

**Example**:
```typescript
interface: {
  locale: Locale.EN,
  theme: Theme.DYNAMIC,
  edges: Edges.CURVED,
  cardDirection: Direction.LTR,
  powered: true,
  colorStyle: ColorStyle.COLORED,
  loader: true
}
```

### features

```typescript
features?: {
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

**Example**:
```typescript
features: {
  acceptanceBadge: true,
  alternativeCardInputs: {
    cardScanner: true,
    cardNFC: true
  },
  customerCards: {
    saveCard: true,
    autoSaveCard: false
  }
}
```

### acceptance

```typescript
acceptance?: {
  supportedSchemes?: Schemes[]  // Card brands
  supportedFundSource?: string[] // 'CREDIT' | 'DEBIT'
  supportedPaymentAuthentications?: string[] // '3DS'
  supportedRegions?: string[]    // 'LOCAL' | 'REGIONAL' | 'GLOBAL'
  supportedCountries?: string[]  // Country codes
  supportedPaymentTypes?: string[] // Payment type codes
}
```

**Example**:
```typescript
acceptance: {
  supportedSchemes: [Schemes.VISA, Schemes.MASTERCARD, Schemes.MADA],
  supportedFundSource: ['CREDIT', 'DEBIT'],
  supportedPaymentAuthentications: ['3DS']
}
```

### fieldVisibility

```typescript
fieldVisibility?: {
  card: {
    cardHolder?: boolean
    cvv?: boolean
    savedCardCVV?: boolean
  }
}
```

**Example**:
```typescript
fieldVisibility: {
  card: {
    cardHolder: true,
    cvv: true,
    savedCardCVV: true
  }
}
```

### merchant

```typescript
merchant?: {
  id?: string  // Merchant ID
}
```

### invoice

```typescript
invoice?: {
  id: string  // Invoice ID to link
}
```

### post

```typescript
post?: {
  url: string  // Webhook URL for server-to-server updates
}
```

## Complete Configuration Example

```typescript
import {
  Scope,
  Currencies,
  Locale,
  Theme,
  Direction,
  Edges,
  ColorStyle,
  Schemes,
  Integration
} from '@tap-payments/card-web'

const config = {
  purpose: 'AUTHORIZE',
  integration: Integration.MERCHANT,
  scope: Scope.AUTHENTICATED_TOKEN,
  
  operator: {
    publicKey: 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX'
  },
  
  order: {
    amount: 100,
    currency: Currencies.BHD,
    description: 'Test Description',
    reference: 'ref_123'
  },
  
  customer: {
    name: [{
      lang: Locale.EN,
      first: 'Test',
      last: 'User',
      middle: 'Middle'
    }],
    nameOnCard: 'TEST USER',
    editable: true,
    contact: {
      email: 'test@example.com',
      phone: {
        countryCode: '+20',
        number: '1000000000'
      }
    }
  },
  
  merchant: {
    id: '1124340'
  },
  
  interface: {
    locale: Locale.EN,
    cardDirection: Direction.LTR,
    edges: Edges.CIRCULAR,
    theme: Theme.DYNAMIC,
    powered: true,
    colorStyle: ColorStyle.COLORED,
    loader: true
  },
  
  features: {
    acceptanceBadge: true,
    alternativeCardInputs: {
      cardScanner: true,
      cardNFC: true
    },
    customerCards: {
      saveCard: true,
      autoSaveCard: true
    }
  },
  
  fieldVisibility: {
    card: {
      cardHolder: false,
      cvv: true,
      savedCardCVV: true
    }
  },
  
  acceptance: {
    supportedSchemes: [Schemes.AMEX, Schemes.VISA, Schemes.MASTERCARD, Schemes.MADA],
    supportedFundSource: ['CREDIT', 'DEBIT']
  },
  
  post: {
    url: window.location.href
  }
}
```

## Dynamic Configuration Updates

Use `updateCardConfiguration` to update config after initialization:

```typescript
import { updateCardConfiguration } from '@tap-payments/card-web'

// Update order amount
updateCardConfiguration({
  order: {
    amount: 200,
    currency: Currencies.AED
  }
})

// Update theme
updateTheme(Theme.DARK)

// Update payment options
updateCardConfiguration({
  interface: {
    locale: Locale.AR
  },
  fieldVisibility: {
    card: {
      cardHolder: true
    }
  }
})
```

## Configuration Validation

**Runtime Validation**:
- Public key format checked
- Required fields validated
- Enum values validated
- Type checking via TypeScript

**Best Practices**:
1. Always provide `operator.publicKey`
2. Use enums instead of string literals
3. Validate customer data before passing
4. Test configuration in sandbox first

## Environment-Specific Configuration

**Sandbox**:
```typescript
operator: {
  publicKey: 'pk_test_...'  // Sandbox key
}
```

**Production**:
```typescript
operator: {
  publicKey: 'pk_live_...'  // Production key
}
```

## Troubleshooting

| Issue | Solution |
| -------------- | ------------------------------------------------------- |
| Invalid public key | Verify key format, check sandbox vs production |
| Missing required fields | Ensure `scope` and `order` are provided |
| Type errors | Use enums instead of strings, check TypeScript types |
| Config not applied | Verify config structure, check browser console |

## Next Steps

- [Events & Communication](./08-events.md) - Event handling
- [Development Guide](./09-development-guide.md) - Adding features
- [Architecture](./03-architecture.md) - System design
