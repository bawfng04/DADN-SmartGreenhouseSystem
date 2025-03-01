Add fallbacks in `\node_modules\react-scripts\config\webpack.config.js` to use .env file:

```
{
  resolve: {
    // ...existing resolve config...
    fallback: {
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify")
    },
    // ...rest of resolve config...
  }
}
```