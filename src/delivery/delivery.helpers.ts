import { ADDONS_CAT, BOX_SIZE_CONFIG } from 'src/common/common.constants';
import { Order } from 'src/kitchen/entities/order.entity';
import { Temperature } from 'src/recipe/entities/recipe.entity';

const findBoxSize = (
  totalSize = 0,
  boxesAvailable = null,
  dishTypes = Temperature.Hot,
) => {
  const boxes = {
    big: 0,
    medium: 0,
    // small: 0
  };
  if (boxesAvailable !== null && boxesAvailable.length > 0) {
    boxesAvailable.map((b) => {
      totalSize -= b.remainingSize;
      return b;
    });
  }
  if (
    totalSize % BOX_SIZE_CONFIG(dishTypes).big >
    BOX_SIZE_CONFIG(dishTypes).medium
  ) {
    boxes.big = Math.floor(totalSize / BOX_SIZE_CONFIG(dishTypes).big) + 1;
    totalSize = 0;
  } else if (totalSize >= BOX_SIZE_CONFIG(dishTypes).big) {
    boxes.big = Math.floor(totalSize / BOX_SIZE_CONFIG(dishTypes).big);
    totalSize =
      totalSize -
      Math.floor(totalSize / BOX_SIZE_CONFIG(dishTypes).big) *
        BOX_SIZE_CONFIG(dishTypes).big;
  }
  if (totalSize === BOX_SIZE_CONFIG(dishTypes).medium) {
    boxes.medium = 1;
    totalSize = 0;
  }
  if (totalSize > 0) {
    boxes.medium =
      totalSize % BOX_SIZE_CONFIG(dishTypes).medium > 0
        ? Math.floor(totalSize / BOX_SIZE_CONFIG(dishTypes).medium) + 1
        : Math.floor(totalSize / BOX_SIZE_CONFIG(dishTypes).medium);
  }
  return boxes;
};

const getDefaultBestFitBoxes = (orders: Order[]) => {
  const boxBreakup = {
    hot: {
      dishes: [],
      boxData: undefined,
    },
    cold: {
      dishes: [],
      boxData: undefined,
    },
    addons: {
      dishes: [],
      boxData: undefined,
    },
  };

  for (const { recipe } of orders) {
    if (recipe.category.name === ADDONS_CAT) {
      boxBreakup.hot.dishes.push(recipe);
    } else if (recipe.type === Temperature.Cold) {
      boxBreakup.cold.dishes.push(recipe);
    } else if (recipe.type === Temperature.Hot) {
      boxBreakup.addons.dishes.push(recipe);
    }
  }

  boxBreakup.hot.boxData = findBoxSize(
    boxBreakup.hot.dishes.length,
    null,
    Temperature.Hot,
  );
  boxBreakup.cold.boxData = findBoxSize(
    boxBreakup.cold.dishes.length,
    null,
    Temperature.Cold,
  );
  boxBreakup.addons.boxData = findBoxSize(
    boxBreakup.addons.dishes.length,
    null,
    Temperature.Cold,
  );

  return boxBreakup;
};

const orders = [
  {
    id: '61ecddca6822b1da2adf4f1f',
    recipe: {
      category: {
        name: 'hotbowl',
      },
      type: 'Cold',
    },
  },
  {
    id: '61ecddca58466b26b1909bc2',
    recipe: {
      category: {
        name: 'addons',
      },
      type: 'Hot',
    },
  },
  {
    id: '61ecddcaa7623cdddd1d74fc',
    recipe: {
      category: {
        name: 'hotbowl',
      },
      type: 'Cold',
    },
  },
  {
    id: '61ecddcaceb000416a6ec15d',
    recipe: {
      category: {
        name: 'coldbowl',
      },
      type: 'Cold',
    },
  },
  {
    id: '61ecddca3bc356af8c5d7fed',
    recipe: {
      category: {
        name: 'hotbowl',
      },
      type: 'Cold',
    },
  },
];
