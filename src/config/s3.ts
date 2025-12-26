// AWS S3 Configuration
// Set these environment variables in your .env file:
// VITE_AWS_REGION=us-east-1
// VITE_AWS_BUCKET_NAME=your-bucket-name
// VITE_AWS_ACCESS_KEY_ID=your-access-key (optional if using public bucket)
// VITE_AWS_SECRET_ACCESS_KEY=your-secret-key (optional if using public bucket)

export const s3Config = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  bucketName: import.meta.env.VITE_AWS_BUCKET_NAME || '',
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
};

// Helper to construct S3 URL for public buckets
export function getPublicS3Url(key: string): string {
  const { region, bucketName } = s3Config;
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}

// Helper to construct S3 URL with custom domain (if using CloudFront)
export function getS3UrlWithCustomDomain(key: string, customDomain?: string): string {
  if (customDomain) {
    return `${customDomain}/${key}`;
  }
  return getPublicS3Url(key);
}
