
import { useToast } from "@/hooks/use-toast";

export const useDiagramDetails = () => {
  const { toast } = useToast();
  
  const handleDiagramClick = (type: 'donut' | 'line' | 'bar' | 'progress' | 'map', title: string, data: any, description?: string) => {
    const params = new URLSearchParams();
    params.set('type', type);
    params.set('title', title);
    params.set('data', JSON.stringify(data));
    if (description) {
      params.set('description', description);
    }
    
    let url;
    if (type === 'map') {
      // Pour les cartes, naviguez vers la vue complète de la carte (correction de l'URL)
      url = `/map-detail-view?${params.toString()}`;
    } else {
      // Pour les graphiques, utilisez la page de détails du diagramme
      url = `/diagram-details?${params.toString()}`;
    }
    
    // Ouvrir dans un nouvel onglet
    window.open(url, '_blank');
    
    toast({
      title: type === 'map' ? "Ouverture des détails de la carte" : "Ouverture des détails du diagramme",
      description: `Affichage des informations détaillées pour ${title} dans un nouvel onglet`,
      duration: 3000,
    });
  };

  return { handleDiagramClick };
};
