import { devLog } from './development';

// Debug page data types
export interface DebugData {
  auth: {
    user: any;
    session: any;
  };
  database: {
    tables: string[];
    connectionStatus: boolean;
  };
  environment: {
    mode: string;
    version: string;
    envVars: Record<string, string>;
  };
}

// Debug data collection
export async function collectDebugData(): Promise<DebugData> {
  const data: DebugData = {
    auth: {
      user: null,
      session: null
    },
    database: {
      tables: [],
      connectionStatus: false
    },
    environment: {
      mode: process.env.NODE_ENV || 'unknown',
      version: '0.1.0',
      envVars: {
        VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || '',
        // Add other non-sensitive env vars
      }
    }
  };

  devLog('Debug data collected:', data);
  return data;
}