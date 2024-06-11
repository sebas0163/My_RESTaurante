const { FoodMatcher } = require('./FoodMatcher');
const { DatabaseController } = require('./DatabaseController');

// Mock DatabaseController
jest.mock('./DatabaseController', () => {
  return {
    DatabaseController: jest.fn().mockImplementation(() => {
      return {
        getAllMenu: jest.fn(),
        getDishById: jest.fn()
      };
    })
  };
});

describe('FoodMatcher', () => {
  let foodMatcher;
  let mockGetAllMenu;
  let mockGetDishById;

  beforeEach(() => {
    foodMatcher = new FoodMatcher();
    mockGetAllMenu = foodMatcher.databaseController.getAllMenu;
    mockGetDishById = foodMatcher.databaseController.getDishById;
  });

  it('successfully finds a matching dish', async () => {
    // Setup mock data and responses for the test
    mockGetAllMenu.mockResolvedValue([
      {
        "name": "Filet ",
        "type": "main plate",
        "req1Id": "9Od2dppDXsKt3uDraxkw",
        "req2Id": "LGxbBOo4nSTNuyL1Q4tU"
      },
      {
        "name": "Lemon Pie",
        "type": "Dessert ",
        "req1Id": "4n8Ju9bKY59MLjoVYipA",
        "req2Id": "5BzFQKTfCkcZPesHaxaD"
      },
      {
        "name": "Wine",
        "type": "Drink",
        "req1Id": "0wIOF4SiKY7Eceiq7iDK",
        "req2Id": "4n8Ju9bKY59MLjoVYipA"
      },
      {
        "name": "Hamburguer",
        "type": "Main plate",
        "req1Id": "8UBd2HHTWhIhgQoTXTCg",
        "req2Id": "4n8Ju9bKY59MLjoVYipA"
      },
      {
        "name": "Coca Cola",
        "type": "Drink",
        "req1Id": "0wIOF4SiKY7Eceiq7iDK",
        "req2Id": "LGxbBOo4nSTNuyL1Q4tU"
      },
      {
        "name": "Ice Cream",
        "type": "Dessert",
        "req1Id": "8UBd2HHTWhIhgQoTXTCg",
        "req2Id": "9Od2dppDXsKt3uDraxkw"
      },
      {
        "name": "Lasagna",
        "type": "main plate",
        "req1Id": "5BzFQKTfCkcZPesHaxaD",
        "req2Id": "LGxbBOo4nSTNuyL1Q4tU"
      }
    ]);

    mockGetDishById.mockImplementation(id => {
      const dishes = {
        '4n8Ju9bKY59MLjoVYipA': { id: '4n8Ju9bKY59MLjoVYipA', name: 'Wine', type: 'Drink' },
        '9Od2dppDXsKt3uDraxkw': { id: '9Od2dppDXsKt3uDraxkw', name: 'Ice Cream', type: 'Dessert' },
        '5BzFQKTfCkcZPesHaxaD': { id: '5BzFQKTfCkcZPesHaxaD', name: 'Lasagna', type: 'main plate' },
        'LGxbBOo4nSTNuyL1Q4tU': { id: 'LGxbBOo4nSTNuyL1Q4tU', name: 'Coca Cola', type: 'main plate' },
      };
      return Promise.resolve(dishes[id] || null);
    });

    // Execute the method under test
    const result = await foodMatcher.findMatchForDish('Filet', 'Lemon Pie');

    // Assertions
    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Wine');
  });

  // Add more tests here following the structure above for different scenarios
});
