import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './src/navigators/TabNavigator';
import DetailsScreen from './src/screens/DetailsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import SplashScreen from 'react-native-splash-screen';;
import { StateContextProvider, useStateContext } from './src/context';

import { Sepolia } from "@thirdweb-dev/chains";
import {
  ThirdwebProvider, useContract,
  ConnectWallet,
  localWallet,
  metamaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnect,
} from "@thirdweb-dev/react-native";
import TicketQR from './src/screens/TicketQR';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <ThirdwebProvider
      activeChain={Sepolia}
      clientId="ec69a9b3aac6a5873fec590f968f6396"
      supportedWallets={[
        metamaskWallet(),
        rainbowWallet(),
        walletConnect(),
        trustWallet(),
        localWallet(),
      ]}>
      <StateContextProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Tab"
              component={TabNavigator}
              options={{ animation: 'slide_from_bottom' }}></Stack.Screen>
            <Stack.Screen
              name="Details"
              component={DetailsScreen}
              options={{ animation: 'slide_from_bottom' }}></Stack.Screen>
            <Stack.Screen
              name="Ticket"
              component={TicketQR}
              options={{ animation: 'slide_from_bottom' }}></Stack.Screen>
            {/* <Stack.Screen
              name="Payment"
              component={PaymentScreen}
              options={{ animation: 'slide_from_bottom' }}></Stack.Screen> */}
          </Stack.Navigator>
        </NavigationContainer>
      </StateContextProvider>
    </ThirdwebProvider >
  );
};

export default App;
