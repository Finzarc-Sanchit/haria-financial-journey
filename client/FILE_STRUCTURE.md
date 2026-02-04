# Haria Financial Journey - File Structure Documentation

## Overview

This document outlines the optimized file structure for the Haria Financial Journey project, ensuring maintainability, scalability, and clean code organization.

## Directory Structure

```
src/
├── assets/                 # Static assets (images, icons, etc.)
├── components/            # React components
│   ├── calculators/       # Calculator-specific components
│   │   ├── shared/        # Shared calculator components
│   │   │   ├── __tests__/ # Component tests
│   │   │   └── index.ts   # Barrel exports
│   │   └── [Calculator]/  # Individual calculator directories
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   └── [Section].tsx     # Main page sections
├── constants/            # Application constants and configuration
│   └── index.ts         # Barrel exports
├── hooks/               # Custom React hooks
│   ├── __tests__/       # Hook tests
│   └── index.ts         # Barrel exports
├── lib/                 # Utility libraries and configurations
├── pages/               # Page components
├── styles/              # Global styles and CSS modules
├── types/               # TypeScript type definitions
│   └── index.ts         # Barrel exports
├── utils/               # Utility functions
│   ├── __tests__/       # Utility tests
│   └── index.ts         # Barrel exports
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Key Optimizations

### 1. Barrel Exports (Index Files)

All major directories now have `index.ts` files that export their contents, enabling cleaner imports:

```typescript
// Before
import { useCalculator } from "@/hooks/useCalculator";
import CalculatorInput from "@/components/calculators/shared/CalculatorInput";

// After
import { useCalculator } from "@/hooks";
import { CalculatorInput } from "@/components/calculators/shared";
```

### 2. Centralized Constants

Configuration is centralized in `src/constants/calculator.ts`:

```typescript
import { CALCULATOR_CONFIG } from "@/constants";

const { SIP } = CALCULATOR_CONFIG;
const defaultInputs = SIP.defaultInputs;
```

### 3. Shared Components

Calculator components are organized in a shared directory with clear exports:

```typescript
// src/components/calculators/shared/index.ts
export { default as CalculatorInput } from "./CalculatorInput";
export { default as ResultsDisplay } from "./ResultsDisplay";
export { PrimaryCTA, SecondaryCTA } from "./CTAButtons";
```

### 4. Type Safety

All types are centralized and exported through index files:

```typescript
import { SIPCalculatorInputs } from "@/types";
```

## Best Practices

### 1. Import Organization

```typescript
// 1. React and external libraries
import { useMemo } from "react";
import { motion } from "framer-motion";

// 2. Internal hooks and utilities
import { useCalculator } from "@/hooks";
import { calculateSIP } from "@/utils";

// 3. Types and constants
import { SIPCalculatorInputs } from "@/types";
import { CALCULATOR_CONFIG } from "@/constants";

// 4. Components
import {
  CalculatorInput,
  ResultsDisplay,
} from "@/components/calculators/shared";
import { Card, CardHeader } from "@/components/ui";
```

### 2. Component Structure

```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Component
// 5. Export
```

### 3. File Naming

- Components: PascalCase (e.g., `CalculatorInput.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useCalculator.tsx`)
- Utilities: camelCase (e.g., `calculatorFunctions.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `CALCULATOR_CONFIG`)

### 4. Testing Structure

Each major directory has a `__tests__` folder:

```
components/calculators/shared/
├── __tests__/
│   ├── CalculatorInput.test.tsx
│   └── CalculatorInput.a11y.test.tsx
├── CalculatorInput.tsx
└── index.ts
```

## Performance Optimizations

### 1. Lazy Loading

Calculator pages are lazy-loaded in `App.tsx`:

```typescript
const SIPCalculator = lazy(() => import("./pages/SIPCalculator"));
```

### 2. Memoization

Use `useMemo` and `useCallback` for expensive calculations:

```typescript
const pieData = useMemo(() => {
  // Expensive calculation
}, [results]);
```

### 3. Bundle Splitting

- UI components are in separate bundle
- Calculator logic is isolated
- Shared utilities are optimized

## Maintenance Guidelines

### 1. Adding New Calculators

1. Create calculator directory in `src/components/calculators/`
2. Add configuration to `src/constants/calculator.ts`
3. Create page in `src/pages/`
4. Add route in `src/App.tsx`
5. Update types in `src/types/`

### 2. Adding New Components

1. Create component file
2. Add to appropriate index.ts
3. Write tests in `__tests__/`
4. Update documentation

### 3. Adding New Hooks

1. Create hook file in `src/hooks/`
2. Add to `src/hooks/index.ts`
3. Write tests
4. Update documentation

## Code Quality

### 1. TypeScript

- Strict mode enabled
- All components properly typed
- No `any` types allowed

### 2. ESLint

- Consistent code style
- Import ordering
- No unused imports

### 3. Testing

- Unit tests for utilities
- Component tests for UI
- Accessibility tests
- Integration tests for calculators

This structure ensures the codebase remains maintainable, scalable, and follows React/TypeScript best practices.
