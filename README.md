# Bullcode React SDK

A set of components, tools, utils and hooks to easy development of applications with Bullcode's patterns.


## How to publish

### Creating new version

- `npx lerna version`

### Publishing new generated versions

- `npx lerna publish from-package`

## React Native

### Use custom font-family

It is necessary to use the `react-native-global-font` library, which injects the font type for all Text components within the application.

**Note: library must be configured on the highest scope of the application, usually App.tsx!**