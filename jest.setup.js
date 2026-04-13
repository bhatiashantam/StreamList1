jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('@react-native-community/blur', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BlurView: (props) => React.createElement(View, props),
  };
});
