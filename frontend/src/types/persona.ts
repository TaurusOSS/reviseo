export interface Persona {
  identifier: string;
  name: string;
  description: string;
  customInstructions: string;
  checklist: string[];
  keyAspects: string[];
}

export interface CreatePersonaRequest {
  name: string;
  description: string;
  customInstructions: string;
  checklist: string[];
  keyAspects: string[];
}

export interface UpdatePersonaRequest {
  name: string;
  description: string;
  customInstructions: string;
  checklist: string[];
  keyAspects: string[];
}

export interface MarketplacePersona extends Persona {
  isInstalled: boolean;
}
