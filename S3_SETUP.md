# AWS S3 Integration Setup

## Prerequisites

1. **Install AWS SDK**:
   ```bash
   npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
   ```

2. **Create an AWS S3 Bucket**:
   - Go to AWS Console → S3
   - Create a new bucket
   - Note the bucket name and region

## Configuration

### Option 1: Public Bucket (Recommended for simplicity)

1. **Make your bucket public**:
   - Go to bucket → Permissions
   - Disable "Block all public access"
   - Add bucket policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

2. **Create `.env` file**:
   ```bash
   cp .env.example .env
   ```

3. **Configure `.env`**:
   ```
   VITE_AWS_REGION=us-east-1
   VITE_AWS_BUCKET_NAME=your-bucket-name
   ```

### Option 2: Private Bucket with Credentials

1. **Create IAM User**:
   - Go to AWS Console → IAM → Users
   - Create user with programmatic access
   - Attach policy: `AmazonS3ReadOnlyAccess`
   - Save Access Key ID and Secret Access Key

2. **Configure `.env`**:
   ```
   VITE_AWS_REGION=us-east-1
   VITE_AWS_BUCKET_NAME=your-bucket-name
   VITE_AWS_ACCESS_KEY_ID=your-access-key-id
   VITE_AWS_SECRET_ACCESS_KEY=your-secret-access-key
   ```

   ⚠️ **Warning**: Never commit credentials to git! Add `.env` to `.gitignore`

## Upload Images

Upload images to your bucket in a folder structure:
```
your-bucket/
  ├── images/
  │   ├── photo1.jpg
  │   ├── photo2.jpg
  │   └── photo3.png
  └── gallery/
      ├── party1.jpg
      └── party2.jpg
```

## Usage

### Use the S3ImageGallery Component

```tsx
import { S3ImageGallery } from '@/components/ContentBody/Gallery/S3ImageGallery';

// Load images from 'images' folder (default)
<S3ImageGallery />

// Load images from specific folder
<S3ImageGallery folder="gallery" />
```

### Use the Hook Directly

```tsx
import { useS3Images } from '@/hooks/useS3Images';

function MyComponent() {
  const { images, loading, error } = useS3Images('images');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {images.map(img => (
        <img key={img.key} src={img.url} alt={img.alt} />
      ))}
    </div>
  );
}
```

### Manual URL Construction

For public buckets, you can construct URLs directly:

```tsx
import { getPublicS3Url } from '@/config/s3';

const imageUrl = getPublicS3Url('images/photo.jpg');
```

## Features

✅ List all images from a specific folder
✅ Support for public and private buckets
✅ Automatic image filtering (jpg, jpeg, png, gif, webp)
✅ React hook for easy integration
✅ Pre-signed URLs for private objects
✅ Error handling and loading states

## Security Best Practices

1. **Use Public Buckets for Public Content**: If images are meant to be public, use a public bucket to avoid exposing credentials
2. **Never Commit Credentials**: Always use environment variables and add `.env` to `.gitignore`
3. **Use IAM Roles in Production**: For server-side rendering, use IAM roles instead of access keys
4. **CORS Configuration**: If needed, configure CORS in your S3 bucket settings

## CORS Configuration

If you're getting CORS errors when fetching images from S3, you need to configure CORS on your bucket.

### How to Configure CORS:

1. **Go to AWS S3 Console**
   - Navigate to your bucket
   - Click on the "Permissions" tab
   - Scroll down to "Cross-origin resource sharing (CORS)"
   - Click "Edit"

2. **Add CORS Configuration**

   For **development** (allows localhost):
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedOrigins": [
         "http://localhost:3000",
         "http://localhost:5173",
         "https://yourdomain.com"
       ],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

   For **production only** (recommended):
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedOrigins": ["https://yourdomain.com"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

   For **any origin** (⚠️ use only for public content):
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

3. **Save changes**

### CORS Configuration Explanation:

- **AllowedHeaders**: Which headers can be sent in requests
- **AllowedMethods**: Which HTTP methods are allowed (GET for reading images)
- **AllowedOrigins**: Which domains can access your bucket
  - Use `"*"` for any origin (public access)
  - List specific domains for better security
  - Include both `http://localhost:*` for development
- **ExposeHeaders**: Headers that can be accessed by the browser
- **MaxAgeSeconds**: How long browsers can cache CORS preflight requests

### Common CORS Issues:

❌ **Error**: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"
✅ **Solution**: Add your domain to `AllowedOrigins` in CORS configuration

❌ **Error**: "No 'Access-Control-Allow-Origin' header is present"
✅ **Solution**: Make sure CORS is configured on your bucket

❌ **Error**: Works locally but not in production
✅ **Solution**: Add your production domain to `AllowedOrigins`

## Troubleshooting

### 403 Forbidden Error - Images Not Loading

If you're getting **403 Forbidden** errors, follow these steps:

#### 1. Check Block Public Access Settings
   - Go to your bucket → **Permissions** tab
   - Under "Block public access (bucket settings)", click **Edit**
   - **Uncheck all 4 options**:
     - ☐ Block all public access
     - ☐ Block public access to buckets and objects granted through new access control lists (ACLs)
     - ☐ Block public access to buckets and objects granted through any access control lists (ACLs)
     - ☐ Block public access to buckets and objects granted through new public bucket or access point policies
     - ☐ Block public and cross-account access to buckets and objects through any public bucket or access point policies
   - Click **Save changes**
   - Type `confirm` when prompted

#### 2. Add Bucket Policy
   - Still in **Permissions** tab
   - Scroll to "Bucket policy", click **Edit**
   - Paste this policy (replace `your-bucket-name` with your actual bucket name):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```
   - Click **Save changes**

#### 3. Configure CORS (Required!)
   - Still in **Permissions** tab
   - Scroll to "Cross-origin resource sharing (CORS)", click **Edit**
   - Paste this configuration:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```
   - Click **Save changes**

#### 4. Verify Your .env Configuration
   Make sure your `.env` file has the correct values:
   ```
   VITE_AWS_REGION=us-east-1  # or your bucket's region
   VITE_AWS_BUCKET_NAME=your-actual-bucket-name
   ```

#### 5. Check the Image URLs
   - The URL should look like: `https://your-bucket-name.s3.us-east-1.amazonaws.com/folder/image.jpg`
   - Try opening the URL directly in your browser
   - If it shows XML with `AccessDenied`, the bucket policy isn't correct
   - If it downloads/shows the image, the problem is CORS

#### 6. Restart Your Dev Server
   After changing `.env`, restart your development server:
   ```bash
   npm run dev
   ```

### Other Common Issues:

- **Images not loading**: Check bucket permissions and CORS settings
- **403 Forbidden**: Follow the steps above
- **CORS errors**: Add CORS configuration to your S3 bucket (see above)
- **Mixed Content**: Make sure you're using HTTPS in production if your site uses HTTPS
- **Wrong region**: Verify the region in your `.env` matches your bucket's region
- **Bucket name typo**: Double-check the bucket name in your `.env` file
