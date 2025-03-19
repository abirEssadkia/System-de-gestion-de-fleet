
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

type ReportFormat = 'pdf' | 'excel';
type ReportType = 'vehicle-status' | 'driver-performance' | 'maintenance-cost' | 'fleet-utilization';

// Sample data for the reports
const generateReportData = (reportType: ReportType) => {
  switch (reportType) {
    case 'vehicle-status':
      return [
        { id: 'V001', vehicle: 'Truck 101', status: 'Active', location: 'Casablanca', lastMaintenance: '2023-10-15', nextService: '2024-01-15' },
        { id: 'V002', vehicle: 'Van 202', status: 'Maintenance', location: 'Rabat', lastMaintenance: '2023-11-05', nextService: '2024-02-05' },
        { id: 'V003', vehicle: 'Truck 303', status: 'Active', location: 'Marrakech', lastMaintenance: '2023-09-22', nextService: '2023-12-22' },
        { id: 'V004', vehicle: 'Delivery 404', status: 'Inactive', location: 'Fes', lastMaintenance: '2023-08-30', nextService: '2023-11-30' },
        { id: 'V005', vehicle: 'Van 505', status: 'Active', location: 'Tangier', lastMaintenance: '2023-10-10', nextService: '2024-01-10' },
      ];
    case 'driver-performance':
      return [
        { id: 'D001', driver: 'Mohammed Ali', trips: 45, distance: '1,200 km', fuelEfficiency: '8.5 L/100km', safetyScore: '95%' },
        { id: 'D002', driver: 'Ahmed Hassan', trips: 38, distance: '950 km', fuelEfficiency: '9.2 L/100km', safetyScore: '88%' },
        { id: 'D003', driver: 'Yasmine Bakkali', trips: 42, distance: '1,100 km', fuelEfficiency: '7.8 L/100km', safetyScore: '92%' },
        { id: 'D004', driver: 'Omar Tazi', trips: 30, distance: '820 km', fuelEfficiency: '10.1 L/100km', safetyScore: '85%' },
        { id: 'D005', driver: 'Fatima Zahra', trips: 50, distance: '1,350 km', fuelEfficiency: '8.0 L/100km', safetyScore: '97%' },
      ];
    case 'maintenance-cost':
      return [
        { id: 'M001', vehicle: 'Truck 101', month: 'Jan 2023', regularService: '2,500 MAD', repairs: '1,200 MAD', parts: '3,500 MAD', total: '7,200 MAD' },
        { id: 'M002', vehicle: 'Van 202', month: 'Feb 2023', regularService: '1,800 MAD', repairs: '3,500 MAD', parts: '2,000 MAD', total: '7,300 MAD' },
        { id: 'M003', vehicle: 'Truck 303', month: 'Mar 2023', regularService: '2,500 MAD', repairs: '800 MAD', parts: '1,500 MAD', total: '4,800 MAD' },
        { id: 'M004', vehicle: 'Delivery 404', month: 'Apr 2023', regularService: '1,500 MAD', repairs: '5,000 MAD', parts: '4,200 MAD', total: '10,700 MAD' },
        { id: 'M005', vehicle: 'Van 505', month: 'May 2023', regularService: '1,800 MAD', repairs: '0 MAD', parts: '800 MAD', total: '2,600 MAD' },
      ];
    case 'fleet-utilization':
      return [
        { id: 'F001', vehicle: 'Truck 101', utilization: '85%', idleTime: '5%', maintenance: '10%', fuelConsumption: '450L', costPerKm: '2.3 MAD' },
        { id: 'F002', vehicle: 'Van 202', utilization: '72%', idleTime: '13%', maintenance: '15%', fuelConsumption: '320L', costPerKm: '1.9 MAD' },
        { id: 'F003', vehicle: 'Truck 303', utilization: '90%', idleTime: '3%', maintenance: '7%', fuelConsumption: '480L', costPerKm: '2.5 MAD' },
        { id: 'F004', vehicle: 'Delivery 404', utilization: '65%', idleTime: '20%', maintenance: '15%', fuelConsumption: '280L', costPerKm: '1.7 MAD' },
        { id: 'F005', vehicle: 'Van 505', utilization: '78%', idleTime: '12%', maintenance: '10%', fuelConsumption: '350L', costPerKm: '2.0 MAD' },
      ];
    default:
      return [];
  }
};

export const ReportGenerator = () => {
  const [reportType, setReportType] = useState<ReportType>('vehicle-status');
  const [reportFormat, setReportFormat] = useState<ReportFormat>('pdf');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

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

  const generatePdfReport = (data: any[], reportName: string) => {
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(18);
    pdf.text(reportName, 14, 22);
    
    // Add date range
    pdf.setFontSize(11);
    pdf.text(`Period: ${format(startDate!, 'dd MMM yyyy')} - ${format(endDate!, 'dd MMM yyyy')}`, 14, 30);
    
    // Add company info
    pdf.setFontSize(10);
    pdf.text('Fleet Manager Pro', 14, 40);
    pdf.text('Generated on: ' + format(new Date(), 'dd MMM yyyy HH:mm'), 14, 45);
    
    // Create table with data
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      const rows = data.map(item => headers.map(header => item[header]));
      
      autoTable(pdf, {
        head: [headers],
        body: rows,
        startY: 55,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 }
      });
    } else {
      pdf.text('No data available for this report', 14, 60);
    }
    
    return pdf;
  };

  const generateExcelReport = (data: any[], reportName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, reportName);
    
    // Adjust column widths
    const columnsWidths = Object.keys(data[0] || {}).map(() => ({ wch: 15 }));
    worksheet['!cols'] = columnsWidths;
    
    return workbook;
  };

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
    
    // Generate report based on selected options
    const reportData = generateReportData(reportType);
    const reportName = getReportTypeName(reportType);
    const fileName = `${reportType}-${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}`;
    
    setTimeout(() => {
      try {
        if (reportFormat === 'pdf') {
          // Generate PDF
          const pdf = generatePdfReport(reportData, reportName);
          pdf.save(`${fileName}.pdf`);
        } else {
          // Generate Excel
          const workbook = generateExcelReport(reportData, reportName);
          XLSX.writeFile(workbook, `${fileName}.xlsx`);
        }
        
        toast({
          title: "Report generated",
          description: `${reportName} report has been generated and downloaded.`,
          variant: "default"
        });
      } catch (error) {
        console.error('Error generating report:', error);
        toast({
          title: "Error generating report",
          description: "There was a problem generating your report. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
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
