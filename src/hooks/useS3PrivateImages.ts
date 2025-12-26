import { useEffect, useState } from 'react';
import { fetchImagesFromPrivateFolder } from '@/utils/s3';

interface S3Image {
  key: string;
  url: string;
  alt: string;
}

interface UseS3PrivateImagesResult {
  images: Array<S3Image>;
  loading: boolean;
  error: string | null;
}

export function useS3PrivateImages(
  folder: string = 'images',
  expiresIn: number = 3600
): UseS3PrivateImagesResult {
  const [images, setImages] = useState<Array<S3Image>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadImages() {
      try {
        setLoading(true);
        setError(null);
        const fetchedImages = await fetchImagesFromPrivateFolder(folder, expiresIn);
        
        if (mounted) {
          setImages(fetchedImages);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load images');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      mounted = false;
    };
  }, [folder, expiresIn]);

  return { images, loading, error };
}
