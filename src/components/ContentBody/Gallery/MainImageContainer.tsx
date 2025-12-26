import { useEffect, useState } from 'react';
import { useS3PrivateImages } from '@/hooks/useS3PrivateImages';

interface MainImageContainerProps {
  interval?: number;
  s3Folder?: string;
  expiresIn?: number;
}

export const MainImageContainer = ({
  interval = 3000,
  s3Folder = 'carousel',
  expiresIn = 3600
}: MainImageContainerProps) => {
  const { images: s3Images, loading, error } = useS3PrivateImages(s3Folder, expiresIn);

  const [currentIndex, setCurrentIndex] = useState(0);

  const images = s3Images.map(img => ({ src: img.url, alt: img.alt }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (loading) {
    return (
      <div className="mx-auto">
        <div className="rounded-lg overflow-hidden shadow-lg border border-primary p-8 text-center">
          <p className="text-gray-600">Carregando imagens...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto">
        <div className="rounded-lg overflow-hidden shadow-lg border border-primary p-8 text-center">
          <p className="text-red-600">Erro ao carregar imagens: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="rounded-lg overflow-hidden shadow-lg border border-primary relative">
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                className="aspect-2/3 max-h-[400px] lg:h-[350px] w-full object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>
        
        {/* Indicator dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-ternary w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
