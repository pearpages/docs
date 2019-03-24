jest.mock('../utils', () => {
  return {
    getWinner: jest.fn((p1, p2) => p1)
  }
});

// cleanup
utils.getWinner.mockReset()

/**
We can keep our mocks in a directory
__mocks__/utils.js
jest.mock('../utils');
*/
