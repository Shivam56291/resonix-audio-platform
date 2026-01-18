// module.exports = {
//   preset: 'react-native',
// };


// -----------------------------------------------


module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@views/(.*)$': '<rootDir>/src/views/$1',
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1'
  }
};