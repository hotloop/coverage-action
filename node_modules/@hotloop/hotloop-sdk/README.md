# HotLoop SDK

A package for interacting with HotLoop

## Setup

```javascript
const opts = { 
  userAgent: 'some-system',
  timeout: 5000,
  retries: 3, 
  retryDelay: 1000
}

const client = HotLoopSdkFactory.getInstance(token, opts)
```