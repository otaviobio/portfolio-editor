import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    'https://vxpfosdeqbislorhsocs.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cGZvc2RlcWJpc2xvcmhzb2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMyOTgxOTEsImV4cCI6MTk5ODg3NDE5MX0.uqBU8-MwlGxi3twhPyTfxErkV6qFmDHCzfAsQ5E_GSs'
);
