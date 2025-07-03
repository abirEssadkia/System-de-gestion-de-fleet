
-- Create positions table for storing real-time position data from PinMe.io
CREATE TABLE public.positions (
  id BIGSERIAL PRIMARY KEY,
  device_id INTEGER NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(8, 2) DEFAULT 0,
  distance DECIMAL(10, 2) DEFAULT 0,
  address TEXT,
  server_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create route_reports table for storing route analysis data
CREATE TABLE public.route_reports (
  id BIGSERIAL PRIMARY KEY,
  device_id INTEGER NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  distance DECIMAL(10, 2) DEFAULT 0,
  total_distance DECIMAL(10, 2) DEFAULT 0,
  alarm TEXT,
  stop_time INTEGER DEFAULT 0,
  server_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create overspeed_reports table for storing overspeed analysis
CREATE TABLE public.overspeed_reports (
  id BIGSERIAL PRIMARY KEY,
  device_id INTEGER NOT NULL,
  vehicle_name TEXT,
  driver_name TEXT,
  speed DECIMAL(8, 2) NOT NULL,
  speed_limit DECIMAL(8, 2) DEFAULT 80,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  duration_minutes INTEGER DEFAULT 0,
  report_date DATE NOT NULL,
  server_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_positions_device_id ON public.positions(device_id);
CREATE INDEX idx_positions_server_time ON public.positions(server_time);
CREATE INDEX idx_route_reports_device_id ON public.route_reports(device_id);
CREATE INDEX idx_route_reports_server_time ON public.route_reports(server_time);
CREATE INDEX idx_overspeed_reports_device_id ON public.overspeed_reports(device_id);
CREATE INDEX idx_overspeed_reports_date ON public.overspeed_reports(report_date);

-- Enable Row Level Security
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overspeed_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can restrict this later based on your auth requirements)
CREATE POLICY "Allow public read access to positions" 
  ON public.positions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to positions" 
  ON public.positions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public read access to route_reports" 
  ON public.route_reports 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to route_reports" 
  ON public.route_reports 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public read access to overspeed_reports" 
  ON public.overspeed_reports 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to overspeed_reports" 
  ON public.overspeed_reports 
  FOR INSERT 
  WITH CHECK (true);
