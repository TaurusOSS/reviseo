import { apiClient } from './client';
import type { Persona, CreatePersonaRequest, UpdatePersonaRequest, MarketplacePersona } from '../types/persona';

export const personaApi = {
  getPersonas: async (): Promise<Persona[]> => {
    const response = await apiClient.get<{ personas: Persona[] }>('/api/personas');
    return response.data.personas;
  },
  createPersona: async (persona: CreatePersonaRequest): Promise<string> => {
    const response = await apiClient.post<{ personaIdentifier: string }>('/api/personas', persona);
    return response.data.personaIdentifier;
  },
  updatePersona: async (id: string, persona: UpdatePersonaRequest): Promise<void> => {
    await apiClient.put(`/api/personas/${id}`, persona);
  },
  deletePersona: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/personas/${id}`);
  },
  getMarketplacePersonas: async (): Promise<MarketplacePersona[]> => {
    const response = await apiClient.get<{ personas: MarketplacePersona[] }>('/api/marketplace/personas');
    return response.data.personas;
  },
  reloadMarketplace: async (): Promise<void> => {
    await apiClient.post('/api/marketplace/personas/reload');
  },
  installPersona: async (id: string): Promise<void> => {
    await apiClient.post(`/api/marketplace/personas/${id}/install`);
  },
};
