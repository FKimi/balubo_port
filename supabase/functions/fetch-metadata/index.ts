import { serve } from 'https://deno.fresh.dev/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface MetadataResponse {
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  error?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      throw new Error('URLが必要です');
    }

    // Fetch the webpage
    const response = await fetch(url);
    const html = await response.text();

    // Extract metadata using regex
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] || 
                 html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/)?.[1] || 
                 '';

    const description = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/)?.[1] || 
                       html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/)?.[1] || 
                       null;

    const thumbnail_url = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/)?.[1] || 
                         null;

    const metadata: MetadataResponse = {
      title: title.trim(),
      description: description?.trim() || null,
      thumbnail_url
    };

    return new Response(
      JSON.stringify(metadata),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    const errorResponse: MetadataResponse = {
      title: '',
      description: null,
      thumbnail_url: null,
      error: error.message
    };

    return new Response(
      JSON.stringify(errorResponse),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    );
  }
});