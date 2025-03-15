/*
  # Create storage bucket for works

  1. New Storage Bucket
    - Creates a new public bucket named 'works' for storing work files
    - Enables public access for viewing uploaded files
    - Sets size limit to 10MB per file

  2. Security
    - Enables RLS policies for secure access
    - Only authenticated users can upload files
    - Files are publicly readable
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
  'works',
  'works',
  true,
  10485760 -- 10MB in bytes
);

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'works' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow public access to files
CREATE POLICY "Public access to files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'works');