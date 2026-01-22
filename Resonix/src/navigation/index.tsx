import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import RootNavigator from './RootNavigator';
import colors from 'utils/colors';

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.PRIMARY,
    primary: colors.CONTRAST,
  },
};

const AppNavigation = () => {
  return (
    <NavigationContainer theme={AppTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default AppNavigation;
