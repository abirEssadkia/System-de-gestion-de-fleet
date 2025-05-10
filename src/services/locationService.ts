
export interface Location {
  id: number;
  name: string;
  originalName: string;
  groupId: number;
}

export const getLocations = async (): Promise<Location[]> => {
  // Return mock data directly instead of calling Supabase function
  return getFallbackLocations();
};

// Mock data in case the API is down
export const getFallbackLocations = (): Location[] => {
  return [
    { id: 23391, name: 'Casablanca', originalName: 'Parc_Casa', groupId: 0 },
    { id: 23393, name: 'Marrakech', originalName: 'Parc_Marrakech', groupId: 0 },
    { id: 23392, name: 'Fes', originalName: 'Parc_Fes', groupId: 0 },
    { id: 23394, name: 'Nador', originalName: 'Parc_Nador', groupId: 0 },
    { id: 23390, name: 'Agadir', originalName: 'Parc_Agadir', groupId: 0 },
    { id: 23395, name: 'Ouarzazate', originalName: 'Parc_Ouarzazate', groupId: 0 },
    { id: 23396, name: 'Rabat', originalName: 'Parc_Rabat', groupId: 0 },
    { id: 23397, name: 'Tanger', originalName: 'Parc_Tanger', groupId: 0 }
  ];
};
