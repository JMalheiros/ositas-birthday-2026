import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Config } from '@/config/s3';

// Initialize S3 Client
let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    const config: any = {
      region: s3Config.region,
    };

    // Only add credentials if they are provided (for private buckets)
    if (s3Config.accessKeyId && s3Config.secretAccessKey) {
      config.credentials = {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      };
    }

    s3Client = new S3Client(config);
  }
  return s3Client;
}

// List all objects in a specific folder/prefix
export async function listS3Objects(prefix: string = ''): Promise<Array<string>> {
  try {
    const client = getS3Client();
    const command = new ListObjectsV2Command({
      Bucket: s3Config.bucketName,
      Prefix: prefix,
    });

    const response = await client.send(command);
    
    if (!response.Contents) {
      return [];
    }

    return response.Contents
      .filter(item => item.Key && !item.Key.endsWith('/')) // Filter out folders
      .map(item => item.Key!)
      .filter(key => /\.(jpg|jpeg|png|gif|webp)$/i.test(key)); // Only image files
  } catch (error) {
    console.error('Error listing S3 objects:', error);
    return [];
  }
}

// Get a signed URL for a private object (expires in 1 hour by default)
export async function getSignedS3Url(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const client = getS3Client();
    const command = new GetObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
    });

    return await getSignedUrl(client, command, { expiresIn });
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
}

// Get public URL for an object (for public buckets)
export function getPublicS3ObjectUrl(key: string): string {
  return `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com/${key}`;
}

// Fetch all images from a specific folder
export async function fetchImagesFromFolder(folder: string = 'images'): Promise<Array<{ key: string; url: string; alt: string }>> {
  const keys = await listS3Objects(folder);
  
  return keys.map(key => ({
    key,
    url: getPublicS3ObjectUrl(key),
    alt: key.split('/').pop()?.split('.')[0] || 'Image',
  }));
}

// Fetch all images from a private bucket (using signed URLs)
export async function fetchImagesFromPrivateFolder(
  folder: string = 'images',
  expiresIn: number = 3600
): Promise<Array<{ key: string; url: string; alt: string }>> {
  const keys = await listS3Objects(folder);
  
  // Generate signed URLs for each image
  const imagePromises = keys.map(async (key) => {
    try {
      const url = await getSignedS3Url(key, expiresIn);
      return {
        key,
        url,
        alt: key.split('/').pop()?.split('.')[0] || 'Image',
      };
    } catch (error) {
      console.error(`Error generating signed URL for ${key}:`, error);
      return null;
    }
  });

  const images = await Promise.all(imagePromises);
  
  // Filter out any failed URL generations
  return images.filter((img): img is { key: string; url: string; alt: string } => img !== null);
}
