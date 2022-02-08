import { Temperature } from 'src/recipe/entities/recipe.entity';

export const BOX_DETAILS = {
  M: {
    weight: 14,
    height: 21,
    width: 62,
    length: 42,
    description: 'Lunch Boxes',
    size: 'M',
  },
  L: {
    weight: 14,
    height: 32,
    width: 62,
    length: 42,
    description: 'Lunch Boxes',
    size: 'L',
  },
};

export const getBoxSize = (size: number): string => {
  if (size === 24) {
    return 'L';
  }
  return 'M';
};

export const BOX_SIZE_CONFIG = (type: Temperature) => {
  const sizes =
    type === Temperature.Hot
      ? {
          big: 24,
          medium: 6,
          small: 4,
        }
      : {
          big: 24,
          medium: 12,
          small: 4,
        };
  return sizes;
};
