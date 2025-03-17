
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { format } from 'date-fns';
import { 
  FileText, 
  FileSpreadsheet, 
  Calendar as CalendarIcon, 
  Download, 
  Filter 
} from 'lucide-react';
import { ReportPreview } from './ReportPreview';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type ReportFormat = 'pdf' | 'excel';
type ReportType = 'vehicle-status' | 'driver-performance' | 'maintenance-cost' | 'fleet-utilization';

export const ReportGenerator = () => {
  const [reportType, setReportType] = useState<ReportType>('vehicle-status');
  const [reportFormat, setReportFormat] = useState<ReportFormat>('pdf');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Date range required",
        description: "Please select both start and end dates.",
        variant: "destructive"
      });
      return;
    }

    if (startDate > endDate) {
      toast({
        title: "Invalid date range",
        description: "Start date must be before end date.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      
      // In a real app, we would generate and download the report here
      // For now, we'll just show a success message
      
      toast({
        title: "Report generated",
        description: `${getReportTypeName(reportType)} report has been generated.`,
        variant: "default"
      });
      
      // Trigger download
      const fileName = `${reportType}-${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}`;
      const fileExtension = reportFormat === 'pdf' ? 'pdf' : 'xlsx';
      const fileUrl = `#`;  // In a real app, this would be a URL to the generated report
      
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${fileName}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 2000);
  };

  const getReportTypeName = (type: ReportType): string => {
    switch (type) {
      case 'vehicle-status': return 'Vehicle Status';
      case 'driver-performance': return 'Driver Performance';
      case 'maintenance-cost': return 'Maintenance Cost Analysis';
      case 'fleet-utilization': return 'Fleet Utilization';
      default: return '';
    }
  };

  const getReportIcon = (reportFormat: ReportFormat) => {
    return reportFormat === 'pdf' 
      ? <FileText className="h-6 w-6 text-red-500" /> 
      : <FileSpreadsheet className="h-6 w-6 text-green-500" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 md:col-span-1">
        <h2 className="text-xl font-semibold mb-4">Report Options</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Report Type</label>
            <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fleet Reports</SelectLabel>
                  <SelectItem value="vehicle-status">Vehicle Status</SelectItem>
                  <SelectItem value="fleet-utilization">Fleet Utilization</SelectItem>
                  <SelectItem value="maintenance-cost">Maintenance Cost Analysis</SelectItem>
                  <SelectItem value="driver-performance">Driver Performance</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date Range</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd MMM yyyy") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd MMM yyyy") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">File Format</label>
            <div className="flex space-x-2">
              <Button
                variant={reportFormat === 'pdf' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setReportFormat('pdf')}
              >
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button
                variant={reportFormat === 'excel' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setReportFormat('excel')}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </Button>
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={handleGenerateReport} 
            disabled={isGenerating || !startDate || !endDate}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </Card>

      <ReportPreview 
        reportType={reportType} 
        startDate={startDate}
        endDate={endDate}
        reportFormat={reportFormat}
      />
    </div>
  );
};
