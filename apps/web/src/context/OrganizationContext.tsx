import React, { createContext, useContext, useState } from 'react';
import { BaseService } from '../services/BaseService';

interface OrganizationContextType {
  organizationName: string | null;
  shortName: string | null;
  urlIdentifier: string | null; // slug or shortName - used for URLs
  setOrganization: (org: { name: string; shortName: string; slug?: string }) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [shortName, setShortName] = useState<string | null>(null);
  const [urlIdentifier, setUrlIdentifier] = useState<string | null>(null);

  const setOrganization = (org: { name: string; shortName: string; slug?: string }) => {
    setOrganizationName(org.name);
    setShortName(org.shortName);
    // Use slug if available (for obscure URLs), otherwise use shortName
    const identifier = org.slug || org.shortName;
    setUrlIdentifier(identifier);
    BaseService.setOrganization(org.shortName);
  };

  return (
    <OrganizationContext.Provider value={{ organizationName, shortName, urlIdentifier, setOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}; 