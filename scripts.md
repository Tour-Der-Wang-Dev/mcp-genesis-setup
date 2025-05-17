
# Project Scripts Documentation

This document provides detailed information about the available npm scripts defined in the project's `package.json` file.

## Available Scripts

### `npm run dev`

**Purpose**: Starts the development server with hot module reloading.

**When to use**: During development when you want to see real-time changes as you modify the code.

**Example**:
```bash
npm run dev
```

This will start the Vite development server, typically at `http://localhost:5173`.

### `npm run build`

**Purpose**: Creates an optimized production build of the application.

**When to use**: When preparing to deploy the application to a production environment.

**Example**:
```bash
npm run build
```

This command will generate optimized assets in the `dist` directory.

### `npm run lint`

**Purpose**: Runs ESLint to check for code quality issues and enforce coding standards.

**When to use**: Before committing changes or during CI/CD processes to ensure code quality.

**Example**:
```bash
npm run lint
```

You can also fix automatically fixable issues with:
```bash
npm run lint -- --fix
```

### `npm run preview`

**Purpose**: Serves the production build locally for testing before deployment.

**When to use**: After running `npm run build` to verify the production build works as expected.

**Example**:
```bash
npm run build
npm run preview
```

This will serve the production build at `http://localhost:4173` by default.

### `npm run test`

**Purpose**: Runs the test suite to verify the application works as expected.

**When to use**: During development to ensure code changes don't break existing functionality.

**Example**:
```bash
npm run test
```

For watching mode during development:
```bash
npm run test -- --watch
```

### `npm run typecheck`

**Purpose**: Runs the TypeScript compiler to check for type errors without emitting output.

**When to use**: To verify that your TypeScript code is type-safe before building or during CI/CD.

**Example**:
```bash
npm run typecheck
```

## CI/CD Integration

These scripts can be integrated into your CI/CD pipeline to ensure code quality and proper builds:

```yaml
# Example GitHub Actions workflow
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build
```
