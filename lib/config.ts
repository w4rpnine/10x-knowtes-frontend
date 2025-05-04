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
  if (typeof window !== 'undefined' && window.ENV && !window.ENV[key].startsWith('__')) {
    return window.ENV[key];
  }
  return undefined;
};

// API configuration - use different URLs for client-side and server-side
export const getApiBaseUrl = () => {
  return typeof window !== 'undefined'
    // In the browser, use the public URL (localhost or domain)
    ? getRuntimeEnv('NEXT_PUBLIC_API_URL') || process.env.NEXT_PUBLIC_API_URL
    // On the server, prefer the internal Docker network URL if available
    : process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
}

// Other environment variables can be added here 