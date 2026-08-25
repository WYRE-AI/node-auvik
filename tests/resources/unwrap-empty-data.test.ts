import { describe, it, expect, vi } from 'vitest';
import { HttpClient } from '../../src/http.js';
import { AuvikError } from '../../src/errors.js';
import { AlertsResource } from '../../src/resources/alerts.js';
import { BillingResource } from '../../src/resources/billing.js';
import { InventoryConfigurationResource } from '../../src/resources/inventory-configuration.js';
import { InventoryDeviceResource } from '../../src/resources/inventory-device.js';
import { InventoryEntityResource } from '../../src/resources/inventory-entity.js';
import { InventoryInterfaceResource } from '../../src/resources/inventory-interface.js';
import { InventoryNetworkResource } from '../../src/resources/inventory-network.js';
import { TenantsResource } from '../../src/resources/tenants.js';

// Guards the JSON:API single-resource unwrap: when the API responds with
// `{ data: [] }` or a body with no `data` at all, every get* method must throw
// a descriptive AuvikError ("Auvik returned no <entity> for <id>") instead of
// crashing with "TypeError: Cannot read properties of undefined (reading 'id')".
// Fleet sweep origin: WYRE-AI/halopsa-mcp#76 / node-halopsa#59.

function makeHttp(body: unknown): HttpClient {
  const fetchImpl = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    headers: new Headers({ 'content-type': 'application/vnd.api+json' }),
    json: async () => body,
  });
  return new HttpClient({
    baseUrl: 'https://api.example.com/v1',
    username: 'u@example.com', apiKey: 'k', timeout: 5000, maxRetries: 1,
    fetchImpl: fetchImpl as unknown as typeof fetch,
  });
}

const ID = 'x1';

interface SingleGetCase {
  name: string;
  entity: string;
  call: (http: HttpClient) => Promise<{ id: string }>;
}

const cases: SingleGetCase[] = [
  {
    name: 'AlertsResource.getHistory',
    entity: 'alert history',
    call: h => new AlertsResource(async () => h).getHistory(ID),
  },
  {
    name: 'BillingResource.getUsageDevice',
    entity: 'device usage',
    call: h => new BillingResource(async () => h).getUsageDevice(ID),
  },
  {
    name: 'InventoryConfigurationResource.get',
    entity: 'configuration',
    call: h => new InventoryConfigurationResource(async () => h).get(ID),
  },
  {
    name: 'InventoryDeviceResource.getInfo',
    entity: 'device info',
    call: h => new InventoryDeviceResource(async () => h).getInfo(ID),
  },
  {
    name: 'InventoryDeviceResource.getDetails',
    entity: 'device details',
    call: h => new InventoryDeviceResource(async () => h).getDetails(ID),
  },
  {
    name: 'InventoryDeviceResource.getWarranty',
    entity: 'device warranty',
    call: h => new InventoryDeviceResource(async () => h).getWarranty(ID),
  },
  {
    name: 'InventoryDeviceResource.getLifecycle',
    entity: 'device lifecycle',
    call: h => new InventoryDeviceResource(async () => h).getLifecycle(ID),
  },
  {
    name: 'InventoryEntityResource.getNote',
    entity: 'entity note',
    call: h => new InventoryEntityResource(async () => h).getNote(ID),
  },
  {
    name: 'InventoryEntityResource.getAudit',
    entity: 'entity audit',
    call: h => new InventoryEntityResource(async () => h).getAudit(ID),
  },
  {
    name: 'InventoryInterfaceResource.getInfo',
    entity: 'interface info',
    call: h => new InventoryInterfaceResource(async () => h).getInfo(ID),
  },
  {
    name: 'InventoryNetworkResource.getInfo',
    entity: 'network info',
    call: h => new InventoryNetworkResource(async () => h).getInfo(ID),
  },
  {
    name: 'InventoryNetworkResource.getDetails',
    entity: 'network details',
    call: h => new InventoryNetworkResource(async () => h).getDetails(ID),
  },
  {
    name: 'TenantsResource.get',
    entity: 'tenant',
    call: h => new TenantsResource(async () => h).get(ID),
  },
];

describe.each(cases)('$name', ({ entity, call }) => {
  it('throws a descriptive AuvikError when data is an empty array', async () => {
    await expect(call(makeHttp({ data: [] }))).rejects.toBeInstanceOf(AuvikError);
    await expect(call(makeHttp({ data: [] }))).rejects.toThrow(`Auvik returned no ${entity} for ${ID}`);
  });

  it('throws a descriptive AuvikError when data is absent', async () => {
    await expect(call(makeHttp({}))).rejects.toBeInstanceOf(AuvikError);
    await expect(call(makeHttp({}))).rejects.toThrow(`Auvik returned no ${entity} for ${ID}`);
  });

  it('returns the entity for a single-object data payload', async () => {
    const result = await call(makeHttp({
      data: { id: ID, type: 't', attributes: { someField: 'value' } },
    }));
    expect(result).toMatchObject({ id: ID, someField: 'value' });
  });

  it('returns the first entity for an array data payload', async () => {
    const result = await call(makeHttp({
      data: [{ id: ID, type: 't', attributes: { someField: 'value' } }],
    }));
    expect(result).toMatchObject({ id: ID, someField: 'value' });
  });
});
