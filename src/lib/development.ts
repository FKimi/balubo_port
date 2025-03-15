import { supabase } from './supabase';

// Development environment utilities
export const isDevelopment = process.env.NODE_ENV === 'development';

// Logging utility that only logs in development
export function devLog(message: string, data?: any) {
  if (isDevelopment) {
    console.log(`[Dev] ${message}`, data || '');
  }
}

// Error logging utility with development-specific information
export function devError(error: unknown, context?: string) {
  if (isDevelopment) {
    console.error(`[Dev Error]${context ? ` [${context}]` : ''}:`, error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
  }
}

// Development-only data fetching wrapper
export async function devFetch<T>(
  promise: Promise<T>,
  fallbackData: T,
  context: string
): Promise<T> {
  if (!isDevelopment) return promise;

  try {
    const result = await promise;
    devLog(`${context} - Success:`, result);
    return result;
  } catch (error) {
    devError(error, context);
    devLog(`${context} - Using fallback data:`, fallbackData);
    return fallbackData;
  }
}

// Version tracking for development
export const VERSION = {
  current: '0.1.0',
  stable: '0.1.0',
  lastStable: '0.0.9'
};

// Development-only authentication check
export async function checkAuthStatus() {
  if (!isDevelopment) return;

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    devLog('Auth status:', user ? 'Authenticated' : 'Not authenticated');
    if (user) {
      devLog('User:', { id: user.id, email: user.email });
    }
  } catch (error) {
    devError(error, 'Auth status check');
  }
}

// Development database utilities
export const devDb = {
  async checkConnection() {
    if (!isDevelopment) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .single();

      if (error) throw error;
      devLog('Database connection: OK');
    } catch (error) {
      devError(error, 'Database connection check');
    }
  },

  async validateSchema() {
    if (!isDevelopment) return;

    const requiredTables = ['users', 'works', 'tags', 'work_tags', 'ai_analyses', 'user_analyses'];
    
    try {
      for (const table of requiredTables) {
        const { error } = await supabase
          .from(table)
          .select('count')
          .limit(1);

        if (error) {
          devError(error, `Schema validation - ${table}`);
        }
      }
      devLog('Schema validation: OK');
    } catch (error) {
      devError(error, 'Schema validation');
    }
  }
};

// Development environment checks
export async function runDevChecks() {
  if (!isDevelopment) return;

  devLog('Running development environment checks...');
  
  // Check environment variables
  const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
  
  if (missingEnvVars.length > 0) {
    devError(`Missing environment variables: ${missingEnvVars.join(', ')}`, 'Environment check');
  } else {
    devLog('Environment variables: OK');
  }

  // Run other checks
  await checkAuthStatus();
  await devDb.checkConnection();
  await devDb.validateSchema();
}