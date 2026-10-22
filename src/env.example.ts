/**
 * API endpoint configuration.
 *
 * Copy this file to `src/env.ts` (which is git-ignored) and replace the values
 * with the real endpoints for your Therapy Software API.
 */
const API_BASE = 'https://api.paulmojicatech.com/api/TherapySoftware';

export const GetClientsUri = `${API_BASE}/GetClients`;
export const AddClientUri = `${API_BASE}/AddClient`;
export const SaveClientUri = `${API_BASE}/SaveClient`;
export const DeleteClientUri = `${API_BASE}/DeleteClient`;
export const DischargeClientUri = `${API_BASE}/DischargeClient`;
export const AddClientSessionUri = `${API_BASE}/AddClientSession`;
export const DeleteClientSessionUri = `${API_BASE}/DeleteClientSession`;
export const SendMassEmailUri = `${API_BASE}/SendMassEmail`;
export const GetInsuranceUri = `${API_BASE}/GetInsuranceCompanies`;
