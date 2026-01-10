# Image Upload Setup Guide

## Supabase Storage Configuration

### 1. Storage Bucket Setup

Your Supabase storage bucket `images` should be configured with the following settings:

**Bucket Name:** `images`
**Public Access:** Private (not public)
**File Size Limit:** 5MB (configurable in code)

### 2. Storage Policies (RLS)

Add the following Row Level Security (RLS) policies to your `images` bucket:

#### Policy 1: Allow authenticated users to upload
```sql
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 2: Allow authenticated users to read their own images
```sql
CREATE POLICY "Users can read their own images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 3: Allow authenticated users to delete their own images
```sql
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 3. Bucket Structure

Images are organized by user ID:
```
images/
  ├── {user_id_1}/
  │   ├── 1234567890-abc123.jpg
  │   └── 1234567891-def456.png
  └── {user_id_2}/
      └── 1234567892-ghi789.jpg
```

## Implementation Details

### Functions Available

#### `handleImageUpload(file, onProgress?, abortSignal?)`
Uploads an image to Supabase storage with progress tracking.

**Parameters:**
- `file`: File object to upload
- `onProgress`: Optional callback for progress updates (0-100)
- `abortSignal`: Optional AbortSignal for cancellation

**Returns:** Promise<string> - Signed URL of uploaded image (valid for 1 year)

**Example:**
```typescript
const url = await handleImageUpload(file, ({ progress }) => {
  console.log(`Upload progress: ${progress}%`)
})
```

#### `getImageSignedUrl(path, expiresIn?)`
Retrieves a signed URL for an existing image.

**Parameters:**
- `path`: Path to the image in storage (e.g., "user_id/timestamp-random.jpg")
- `expiresIn`: Optional expiration time in seconds (default: 31536000 = 1 year)

**Returns:** Promise<string> - Signed URL

**Example:**
```typescript
const url = await getImageSignedUrl('user_id/1234567890-abc123.jpg')
```

#### `deleteImage(path)`
Deletes an image from storage.

**Parameters:**
- `path`: Path to the image in storage

**Returns:** Promise<boolean> - Success status

**Example:**
```typescript
const success = await deleteImage('user_id/1234567890-abc123.jpg')
```

## Security Features

1. **User Isolation**: Images are stored in user-specific folders
2. **Authentication Required**: All operations require authenticated users
3. **Private Bucket**: Images are not publicly accessible
4. **Signed URLs**: Temporary URLs with expiration for secure access
5. **File Size Limits**: Maximum 5MB per file (configurable)

## File Naming Convention

Files are automatically renamed on upload:
```
{user_id}/{timestamp}-{random_string}.{extension}
```

Example: `abc123-def456-ghi789/1704067200000-x7k9m2p.jpg`

## Error Handling

The upload function handles:
- Missing or invalid files
- File size exceeds limit
- User not authenticated
- Upload failures
- Cancelled uploads (via AbortSignal)

## Usage in TipTap Editor

The `handleImageUpload` function is already integrated with the TipTap editor's ImageUploadNode extension. Images uploaded through the editor will automatically:

1. Upload to Supabase storage
2. Show progress indicator
3. Insert the signed URL into the document
4. Handle errors gracefully

## Notes

- Signed URLs are valid for 1 year by default
- You may need to refresh URLs periodically for long-lived documents
- Consider implementing a cleanup job for unused images
- Monitor storage usage in Supabase dashboard
