import {
  ConnectWallet,
  localWallet,
  metamaskWallet,
  rainbowWallet,
  ThirdwebProvider,
} from '@thirdweb-dev/react-native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

//Bind Device Unique Id
import DeviceInfo from 'react-native-device-info';

//ThirdWeb
import { useContract, useContractMetadata, useContractRead } from "@thirdweb-dev/react-native";
import { Sepolia } from "@thirdweb-dev/chains";
import { BigNumber } from 'ethers';

const App = () => {

  return (
    <ThirdwebProvider
      activeChain={ Sepolia }
      clientId="45aa25dc334ef22899d5c7dda98abd40"
      supportedWallets={[metamaskWallet(), rainbowWallet(), localWallet()]}>
      <AppInner />
      
    </ThirdwebProvider>
  );
};

const AppInner = () => {
  //UNIQUE ID FROM DEVICE
  const [deviceId, setdeviceId] = useState('Get Device ID');
  const getDeviceId = async () => {
    var uniqueId = DeviceInfo.getUniqueId();
    setdeviceId(await uniqueId);
  }
  useEffect(() => {
    getDeviceId();
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const textStyles = {
    color: isDarkMode ? Colors.white : Colors.black,
    ...styles.heading,
  };

  return (
    <View style={styles.view}>
      <Text style={textStyles}>React Native thirdweb starter</Text>
      <ConnectWallet />
      <Text>{deviceId}</Text>
      <Component />
    </View>
  );
};

function Component() {
  const concertId = 1;
  const { contract } = useContract("0x57a16bA9144b76FD2a87cad6C8B17BC8393e6F0F");
  const { data, isLoading } = useContractRead(contract, "numConcerts")
  console.log(data);


  
  return (
    <View>
      {data && (
        <Text>
          Hello {data[0]} !
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default App;
