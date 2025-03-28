
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onClick,
  className
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn("h-8 w-8", className)}
    >
      <Star
        className={cn(
          "h-4 w-4",
          isFavorite
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-400"
        )}
      />
    </Button>
  );
};

export default FavoriteButton;
