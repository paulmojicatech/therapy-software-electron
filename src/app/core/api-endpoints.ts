import { InjectionToken } from '@angular/core';
import * as env from '../../env';

export interface ApiEndpoints {
  readonly getClients: string;
  readonly addClient: string;
  readonly saveClient: string;
  readonly deleteClient: string;
  readonly dischargeClient: string;
  readonly addSession: string;
  readonly deleteSession: string;
  readonly sendMassEmail: string;
  readonly getInsuranceCompanies: string;
}

/** Endpoint used before `DischargeClientUri` was moved into `env.ts`. */
const LEGACY_DISCHARGE_URI = 'https://api.paulmojicatech.com/api/TherapySoftware/DischargeClient';

/**
 * Older `env.ts` files do not export `DischargeClientUri`, so read it defensively
 * to keep those configurations working.
 */
function optionalEnvValue(key: string): string | undefined {
  const value: unknown = (env as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : undefined;
}

export const API_ENDPOINTS = new InjectionToken<ApiEndpoints>('API_ENDPOINTS', {
  providedIn: 'root',
  factory: () => ({
    getClients: env.GetClientsUri,
    addClient: env.AddClientUri,
    saveClient: env.SaveClientUri,
    deleteClient: env.DeleteClientUri,
    dischargeClient: optionalEnvValue('DischargeClientUri') ?? LEGACY_DISCHARGE_URI,
    addSession: env.AddClientSessionUri,
    deleteSession: env.DeleteClientSessionUri,
    sendMassEmail: env.SendMassEmailUri,
    getInsuranceCompanies: env.GetInsuranceUri,
  }),
});
