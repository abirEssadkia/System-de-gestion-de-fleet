
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
    
    // Open in a new tab instead of navigating in the same window
    const url = `/diagram-details?${params.toString()}`;
    window.open(url, '_blank');
    
    toast({
      title: "Opening diagram details",
      description: `Viewing detailed information for ${title} in a new tab`,
      duration: 3000,
    });
  };

  return { handleDiagramClick };
};
