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
import Loader from '../components/Loader';
import PopUpAnimation from '../components/PopUpAnimation';

import Icon from 'react-native-vector-icons/FontAwesome';

import { daysLeft, calTotalAvailableTickets, calLowestTicketPrice } from '../utils';

import { useAddress, useContract, useContractWrite, useContractRead, useStorageUpload } from '@thirdweb-dev/react-native';
import { ethers } from 'ethers';
//import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';
//import { calTotalTickets } from '../utils';
//import { parse } from 'react-native-svg';


const HomeScreen = ({ navigation }) => {
  const { address, contract, getCampaigns } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [concertList, setConcertList] = useState([]);
  const [showAnimation, setShowAnimation] = useState(true);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      setShowAnimation(true);
      const data = await getCampaigns();
      setConcertList(data);
      setTimeout(() => {
        setShowAnimation(false);
      }, 3000);
      setShowAnimation(false);
      setIsLoading(false);
    } catch (error) {
      console.log("fetchCampaigns error", error);
    } finally {
      setIsLoading(false);
    }
  }

  setTimeout(() => {
    if (contract) {
      fetchCampaigns();
    }
  }, 3000);

  useEffect(() => {
    //console.log("address", address);
    if (contract) {
      fetchCampaigns();
    }
    //console.log("concertList", JSON.stringify(concertList, null, 2));
  }, [address, contract]);

  //console.log("concertList", JSON.stringify(concertList, null, 2));

  const ListRef = useRef();

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

      {showAnimation ? 
      <PopUpAnimation
        source={require('../lottie/ticket.json')}
      /> 
      : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        {/* App Header */}
        <HeaderBar />

        <Text style={styles.ScreenTitle}>
          Find the best{'\n'}Concert for you
        </Text>

        {/* Concert Flatlist */}

        {!isLoading ? (
          <ScrollView
            horizontal={true}
            directionalLockEnabled={true}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 50
            }}
          >
            <FlatList
              ref={ListRef}
              //horizontal
              numColumns={2}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.EmptyListContainer}>
                  {/* {isLoading ? <Loader /> : <Text style={styles.CategoryText}>No Concert Available</Text>} */}
                  {showAnimation ? (
                    <PopUpAnimation
                      source={require('../lottie/ticket.json')}
                    />
                  ) : (
                    <Text style={styles.CategoryText}>No Concert Available</Text>
                  )}
                </View>
              }
              contentContainerStyle={styles.FlatListContainer}
              //data={concertList.filter((item) => daysLeft(item.date) != null && calTotalAvailableTickets(item.zoneInfo) >= 0)}
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
    alignSelf: 'flex-start',
    gap: SPACING.space_30,
    paddingVertical: SPACING.space_30,
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
