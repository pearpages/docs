jest.mock('../utils', () => {
  return {
    getWinner: jest.fn((p1, p2) => p1)
  }
});

// cleanup
utils.getWinner.mockReset()
