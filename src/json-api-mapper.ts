import type { JsonApiResource, JsonApiResponse } from './types/json-api.js';
import { AuvikError } from './errors.js';

// Unwraps the single resource from a JSON:API response, throwing a descriptive
// error when `data` is an empty array or missing entirely. Without this guard,
// single-resource gets crash with "TypeError: Cannot read properties of
// undefined (reading 'id')" on empty/unexpected bodies.
export function unwrapJsonApiData<T>(response: JsonApiResponse<T>, context: string): JsonApiResource<T> {
  const data = Array.isArray(response?.data) ? response.data[0] : response?.data;
  if (!data) {
    throw new AuvikError(`Auvik returned no ${context} (response data was empty or missing)`);
  }
  return data;
}

export function mapJsonApiResource<T>(item: JsonApiResource<T>): T & { id: string } {
  return {
    id: item.id,
    ...item.attributes,
  } as T & { id: string };
}

export function mapJsonApiResourceArray<T>(data: JsonApiResource<T> | JsonApiResource<T>[]): (T & { id: string })[] {
  const items = Array.isArray(data) ? data : [data];
  return items.map(mapJsonApiResource);
}