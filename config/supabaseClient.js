// config/supabaseClient.js

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 🔁 Sustituye por tus datos reales de Supabase
const SUPABASE_URL = 'https://pynqyypeepucyrrmncpi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bnF5eXBlZXB1Y3lycm1uY3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzY4MTUsImV4cCI6MjA1OTg1MjgxNX0.snRvFKlyvlNKRbiduOR2NfXDXeMjqn_2mvJGXSafdIY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
