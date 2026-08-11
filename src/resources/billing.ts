import type { HttpClient } from '../http.js';
import type { JsonApiResponse, Page } from '../types/json-api.js';
import type { BillingUsageClient, BillingUsageDevice, BillingUsageOptions } from '../types/billing.js';
import { paginate } from '../pagination.js';
import { unwrapJsonApiData } from '../json-api-mapper.js';

// Auvik billing usage is filtered by DATE via the JSON:API params
// filter[fromDate]/filter[thruDate] (YYYY-MM-DD); tenants is a plain scope param.
function usageParams(options: BillingUsageOptions): Record<string, unknown> {
  const { fromDate, thruDate, tenants, pageSize, pageAfter } = options;
  return {
    ...(fromDate ? { 'filter[fromDate]': fromDate } : {}),
    ...(thruDate ? { 'filter[thruDate]': thruDate } : {}),
    ...(tenants ? { tenants } : {}),
    ...(pageSize ? { 'page[first]': pageSize } : {}),
    ...(pageAfter ? { 'page[after]': pageAfter } : {}),
  };
}

export class BillingResource {
  constructor(private getClient: () => Promise<HttpClient>) {}

  async listUsageClient(options: BillingUsageOptions = {}): Promise<Page<BillingUsageClient>> {
    const client = await this.getClient();
    const response = await client.request<JsonApiResponse<BillingUsageClient>>(
      '/billing/usage/client',
      { params: usageParams(options) },
    );
    const data = Array.isArray(response.data) ? response.data : [response.data];

    return {
      data: data.map(item => ({ id: item.id, type: item.type, ...item.attributes })),
      links: response.links || {},
      meta: response.meta || {},
    };
  }

  async *listUsageClientAll(filters: Record<string, string> = {}): AsyncIterable<BillingUsageClient> {
    const client = await this.getClient();
    for await (const page of paginate<BillingUsageClient>(client, '/billing/usage/client', filters)) {
      for (const usage of page.data) {
        yield usage;
      }
    }
  }

  // Device usage is per-device: /billing/usage/device/{id} (the device id is
  // required in the path; there is no list-all-devices usage endpoint). Returns
  // the single device's usage, flattened like the other single-resource gets.
  async getUsageDevice(id: string, options: BillingUsageOptions = {}): Promise<BillingUsageDevice> {
    const client = await this.getClient();
    const response = await client.request<JsonApiResponse<BillingUsageDevice>>(
      `/billing/usage/device/${id}`,
      { params: usageParams(options) },
    );
    const data = unwrapJsonApiData(response, `device usage for ${id}`);
    return { id: data.id, ...data.attributes } as BillingUsageDevice;
  }
}
