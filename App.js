import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Provider} from 'react-redux';
import {Store} from './src/redux/store';

import Loader from './src/screens/Loader';
import phnoScreen from './src/screens/phnoScreen';
import OTPScreen from './src/screens/OTPScreen';
import InformationScreen from './src/screens/InformationScreen';
import Container from './src/screens/Container';
import DiscussionScreen from './src/screens/DiscussionScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator headerMode={false}>
          {/* <Stack.Screen name="Loader" component={Loader} /> */}
          <Stack.Screen name="phnoScreen" component={phnoScreen} />
          <Stack.Screen name="OTPScreen" component={OTPScreen} />
          <Stack.Screen
            name="InformationScreen"
            component={InformationScreen}
          />
          <Stack.Screen name="Container" component={Container} />
          <Stack.Screen name="DiscussionScreen" component={DiscussionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
