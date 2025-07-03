
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qgtidoblhycdzajcpxwyo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndGlkb2JoeWNkemFqY3B4d3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MzkyNjksImV4cCI6MjA2MjAxNTI2OX0.-WNvw9pHQ7D-KiPneX9MQCkaDkdDptoHhsnn2lprsy0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
