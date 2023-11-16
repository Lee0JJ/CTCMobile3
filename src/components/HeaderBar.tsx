import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useContext } from 'react';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import GradientBGIcon from './GradientBGIcon';
import ProfilePic from './ProfilePic';

import {
  ThirdwebProvider, useContract,
  ConnectWallet,
  localWallet,
  metamaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnect,
} from "@thirdweb-dev/react-native";

import { useStateContext } from '../context';

import Icon from 'react-native-vector-icons/Ionicons';

interface HeaderBarProps {
  title?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title }) => {

  return (
    <View style={styles.HeaderContainer}>
      {/* <GradientBGIcon
        name="menu"
        color={COLORS.primaryLightGreyHex}
        size={FONTSIZE.size_16}
      /> */}
      <Text style={styles.HeaderText}>{title}</Text>
      <ConnectWallet />
      {/* <ProfilePic /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    padding: SPACING.space_30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
});

export default HeaderBar;
