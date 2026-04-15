process.env.TMDB_API_KEY = 'test-key';
delete process.env.API_KEY;

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('@react-native-community/blur', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BlurView: (props) => React.createElement(View, props),
  };
});

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  const LinearGradient = (props) => React.createElement(View, props);
  return { __esModule: true, default: LinearGradient };
});
