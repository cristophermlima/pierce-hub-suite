-- Create storage bucket for product images if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for identity documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('identity-documents', 'identity-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for product-images bucket
CREATE POLICY "Public access to product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- RLS policies for identity-documents bucket (private)
CREATE POLICY "Users can view their identity documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'identity-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can upload identity documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'identity-documents');

CREATE POLICY "Users can update identity documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'identity-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete identity documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'identity-documents' AND auth.role() = 'authenticated');

-- Add identity_document_url to anamnesis table
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS identity_document_url TEXT;