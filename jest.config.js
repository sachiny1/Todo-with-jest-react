module.exports = {
    testEnvironment: "jsdom",
    // transform: {
    //     "^.+\\.jsx?$": "babel-jest"
    //   }
    // preset: 'ts-jest',
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    // globals: {
    //     "ts-jest": {
    //       isolatedModules: true,
    //     },
    //   },
  };