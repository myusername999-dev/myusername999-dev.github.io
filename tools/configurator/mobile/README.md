## Mobile Manageable Modules

This folder contains mobile-focused configurator logic so it is easy to debug and maintain.

### Intended responsibilities
1. Mobile preview layout mapping.
2. Mobile drag position routing.
3. Mobile typography overrides.
4. Mobile-only integration helpers.

### Rule
Desktop-specific logic should not be implemented in this folder unless exposed through shared core interfaces.
