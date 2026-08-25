# @wyre-ai/node-auvik

Node.js client library for the Auvik network monitoring API.

## Installation

```bash
npm install @wyre-ai/node-auvik
```

## Quick Start

```typescript
import { AuvikClient } from '@wyre-ai/node-auvik';

const client = new AuvikClient({
  username: 'your-auvik-email@example.com',
  apiKey: 'your-api-key',
  // Optional: specify region if known, otherwise auto-detected
  region: 'us1', // us1, us2, us3, us4, us5, us6, lnx, eu1, eu2, au1, ca1
});

// List all tenants
const tenants = await client.tenants.list();
console.log(tenants.data);

// Get device information
const devices = await client.inventoryDevice.listInfo();
console.log(devices.data);

// List alerts
const alerts = await client.alerts.listHistory();
console.log(alerts.data);
```

## Raw requests

For endpoints or query parameters the typed resources don't expose, use `client.request()`. It reuses the client's credentials, region resolution, retry/backoff and JSON:API error mapping, and returns the parsed JSON:API response **unmodified** (no resource flattening). The `path` is relative to the region base URL — don't include the host or the `/v1` prefix.

```typescript
// GET with bracketed JSON:API filter/pagination params
const recent = await client.request('/alert/history/info', {
  params: { 'filter[detectedTimeAfter]': '2026-06-01', 'page[first]': 100 },
});
console.log(recent.data);

// POST (defaults to GET when method is omitted)
await client.request('/alert/dismiss/<alertId>', {
  method: 'POST',
  body: { reason: 'acknowledged via automation' },
});
```

## Regions

Auvik operates in multiple regions. If you don't specify a region, the client will automatically probe all regions to find the correct one for your credentials. For better performance, specify your region explicitly:

- `us1`, `us2`, `us3`, `us4`, `us5`, `us6`, `lnx` - United States
- `eu1`, `eu2` - Europe 
- `au1` - Australia
- `ca1` - Canada

You can also set the `AUVIK_REGION` environment variable to override region detection.

## Documentation

For complete API documentation, see the [Auvik API Documentation](https://support.auvik.com/hc/en-us/sections/360002960071-Auvik-APIs).

For detailed implementation specs, see the [design specification](/Users/asachs/work/wyre/engineering/projects/mcp/mcp-servers/docs/superpowers/specs/2026-05-21-auvik-mcp-design.md).

## License

Apache-2.0

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.