import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import { useStore } from '../store/store';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import { FlatList } from 'react-native';
import CoffeeCard from '../components/CoffeeCard';
import { Dimensions } from 'react-native';
import { useStateContext } from '../context/index';
import { Loader } from '../components/Loader';
import { loader } from '../assets';



import { useAddress, useContract, useContractWrite, useContractRead, useStorageUpload } from '@thirdweb-dev/react-native';
import { ethers } from 'ethers';
//import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';
//import { calTotalTickets } from '../utils';
//import { parse } from 'react-native-svg';


const HomeScreen = ({ navigation }) => {
  const { address, contract, getCampaigns } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [concertList, setConcertList] = useState([getCampaigns().catch(() => console.log("getCampaigns error"))]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns().catch(() => console.log("fetchCampaigns error"));
    setConcertList(data);
    //console.log("Concert List", JSON.stringify(concertList, null, 2));
    setIsLoading(false);
  }

  useEffect(() => {
    console.log("address", address);
    if (contract) { fetchCampaigns().catch(() => console.log("fetchCampaigns error")) };
  }, [address, contract]);

  const ListRef = useRef();

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        {/* App Header */}
        <HeaderBar />

        <Text style={styles.ScreenTitle}>
          Find the best{'\n'}coffee for you
        </Text>

        {/* Concert Flatlist */}

        {!isLoading ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 50
            }}
          >

            <FlatList
              ref={ListRef}
              horizontal
              ListEmptyComponent={
                <View key={" "} style={styles.EmptyListContainer}>
                  <Text style={styles.CategoryText}>No Coffee Available</Text>
                </View>
              }
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.FlatListContainer}
              data={concertList}
              keyExtractor={(item) => String(item.cId)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item.cId}
                  onPress={() => {
                    navigation.push('Details', {
                      id: item.cId,
                      item: item,
                    });
                    console.log("concert Id", item.cId);
                  }}>
                  <CoffeeCard
                    key={item.cId}
                    item={item}
                  />
                </TouchableOpacity>
              )}
            />

          </ScrollView>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_30,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    margin: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  CategoryScrollViewStyle: {
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },
  CategoryScrollViewContainer: {
    paddingHorizontal: SPACING.space_15,
  },
  CategoryScrollViewItem: {
    alignItems: 'center',
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  ActiveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  FlatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  CoffeeBeansTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
});

export default HomeScreen;
