const utils = require('../utils');

const originalGetWinner = utils.getWinner;
utils.getWinner = jest.fn((p1, p2) => p1);

// call whatever function is expect to trigger the call

expect(utils.getWinner).toHaveBeenCalledTimes(2);
expect(utils.getWinner).toHaveBeenCalledWith('param1', 'param2');

// cleanup
utils.getWinner = originalGetWinner;

