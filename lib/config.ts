/**
 * Application configuration with environment variables
 */

// Add TypeScript declaration for window.ENV
declare global {
  interface Window {
    ENV?: {
      [key: string]: string;
    };
  }
}

// Helper function to access runtime environment variables
const getRuntimeEnv = (key: string): string | undefined => {
  if (typeof window !== 'undefined' && window.ENV) {
    return window.ENV[key];
  }
  return undefined;
};

// API configuration - prioritize runtime environment variables
export const API_BASE_URL = 
  typeof window !== 'undefined'
    ? getRuntimeEnv('NEXT_PUBLIC_API_URL') || process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL;

// Other environment variables can be added here 