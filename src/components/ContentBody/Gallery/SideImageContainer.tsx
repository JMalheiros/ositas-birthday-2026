import { useS3PrivateImages } from '@/hooks/useS3PrivateImages';

interface SideImageContainerProps {
  src?: string;
  alt?: string;
  caption?: string;
  s3Folder?: string;
  s3Key?: string;
  expiresIn?: number;
}

export const SideImageContainer = ({
  src: providedSrc,
  alt = 'Circle image',
  caption,
  s3Folder = 'profile',
  s3Key = 'circle-osita-image.jpeg',
  expiresIn = 3600
}: SideImageContainerProps) => {
  const { images: s3Images, loading, error } = useS3PrivateImages(s3Folder, expiresIn);

  // Determine which image to use
  let imageSrc = providedSrc;
  let imageAlt = alt;

  if (!loading && !error) {
    const specificImage = s3Images.find(img => img.key.includes(s3Key));
    if (specificImage) {
      imageSrc = specificImage.url;
      imageAlt = specificImage.alt;
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-4">
        <div className="w-26 md:w-32 bg-secondary border-2 border-secondary rounded-lg rounded-tl-full rounded-tr-full py-b-2 shadow-md">
          <div className="size-26 md:size-32 rounded-full overflow-hidden shadow-lg border-2 border-primary bg-gray-100 flex items-center justify-center">
            <p className="text-xs text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="w-26 md:w-32 bg-secondary border-2 border-secondary rounded-lg rounded-tl-full rounded-tr-full py-b-2 shadow-md">
        <div className={`size-26 md:size-32 rounded-full overflow-hidden shadow-lg border-2 border-primary bg-gray-100`}>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
        {caption && (
          <p className="px-2 text-sm md:text-xs font-medium text-white text-center">
            {caption}
          </p>
      )}
      </div>
    </div>
  );
}
