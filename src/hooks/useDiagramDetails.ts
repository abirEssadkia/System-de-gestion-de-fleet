
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
      // For maps, navigate to the full map view page - fixed URL path
      url = `/map-detail?${params.toString()}`;
    } else {
      // For charts, use the diagram details page
      url = `/diagram-details?${params.toString()}`;
    }
    
    // Open in a new tab
    window.open(url, '_blank');
    
    toast({
      title: type === 'map' ? "Ouverture des détails de la carte" : "Ouverture des détails du diagramme",
      description: `Affichage des informations détaillées pour ${title} dans un nouvel onglet`,
      duration: 3000,
    });
  };

  return { handleDiagramClick };
};
