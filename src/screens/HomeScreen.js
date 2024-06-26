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
import EmptyListAnimation from '../components/EmptyListAnimation';
import Icon from 'react-native-vector-icons/FontAwesome';

import { daysLeft, calTotalAvailableTickets, calLowestTicketPrice } from '../utils';

import { useAddress, useContract, useContractWrite, useContractRead, useStorageUpload } from '@thirdweb-dev/react-native';
import { ethers } from 'ethers';
//import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';
//import { calTotalTickets } from '../utils';
//import { parse } from 'react-native-svg';

import ScrollToButton from '../components/ScrollToButton';
import GradientBGIcon from '../components/GradientBGIcon';


const HomeScreen = ({ navigation }) => {
  const { address, contract, getCampaigns, checkServer, getCategory } = useStateContext();
  const [server, setServer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [concertList, setConcertList] = useState([]);
  const [filteredConcert, setFilteredConcert] = useState([]);
  const [sortedConcertList, setSortedConcertList] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState(getCategory());

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const category = await getCategory();
        setCategories(category);
      } catch (error) {
        console.log("fetchCategory error", error);
      }
    };
    fetchCategory();
  }, []);

  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0],
  });

  const sortConcertsByTime = () => {
    const sortedList = [...filteredConcert].sort((a, b) => a.time - b.time);
    setSortedConcertList(sortedList);
  };

  const searchConcert = (search) => {
    if (search !== '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCategoryIndex({ index: 0, category: categories[0] });
      setFilteredConcert([
        ...concertList.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        ),
      ]);
    }
  };

  const resetSearchConcert = () => {
    ListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    setCategoryIndex({ index: 0, category: categories[0] });
    setFilteredConcert([...concertList]);
    setSearchText('');
  };

  useEffect(() => {
    let intervalId;
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        setShowAnimation(true);
        const server = await checkServer();
        setServer(server);
        const data = await getCampaigns();
        setConcertList(data);
        setFilteredConcert(data);
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
    };
    if (contract) {
      fetchCampaigns();
      intervalId = setInterval(fetchCampaigns, 30000); // 30 seconds
    }
    return () => clearInterval(intervalId);
  }, [address, contract]);


  const getConcertList = (category, data) => {
    console.log("category", category);
    if (category === 'All') {
      return data;
    } else {
      try {
        //display all concerts that have the category
        console.log("data", data);
        data.map((item) => {
          console.log("item", item.category);
        });
        let concert = data.filter((item) => item.category.includes(category));
        return concert;
      } catch (error) {
        console.log("Database Unsychronise error", error);
        return [];
      }
    }
  };

  useEffect(() => {
    sortConcertsByTime();
  }, [filteredConcert]);

  //console.log("filteredConcert", JSON.stringify(filteredConcert));

  const ListRef = useRef();

  let listViewRef = useRef();

  const TopButtonHandler = () => {
    ListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    console.log("TopButtonHandler");
    setCategoryIndex({ index: 0, category: categories[0] });
    setFilteredConcert([...concertList]);
    setSearchText('');
  }

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

        <HeaderBar title="Home" />


        {/* Search Input */}

        <View style={styles.InputContainerComponent}>
          <TouchableOpacity
            onPress={() => {
              searchConcert(searchText);
            }}>
            <CustomIcon
              style={styles.InputIcon}
              name="search"
              size={FONTSIZE.size_18}
              color={
                searchText.length > 0
                  ? COLORS.primaryOrangeHex
                  : COLORS.primaryLightGreyHex
              }
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Find Concert..."
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              searchConcert(text);
            }}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
          {searchText.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                resetSearchConcert();
              }}>
              <CustomIcon
                style={styles.InputIcon}
                name="close"
                size={FONTSIZE.size_16}
                color={COLORS.primaryLightGreyHex}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>

        {/* Category Scroller */}
        {server ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.CategoryScrollViewStyle}>
            {Array.isArray(categories) && categories.map((data, index) => (
              <View
                key={index.toString()}
                style={styles.CategoryScrollViewContainer}>
                <TouchableOpacity
                  style={styles.CategoryScrollViewItem}
                  onPress={() => {
                    ListRef?.current?.scrollToOffset({
                      animated: true,
                      offset: 0,
                    });
                    setCategoryIndex({ index: index, category: categories[index] });
                    setFilteredConcert([
                      ...getConcertList(categories[index], concertList),
                    ]);
                  }}>
                  <Text
                    style={[
                      styles.CategoryText,
                      categoryIndex.index == index
                        ? { color: COLORS.primaryOrangeHex }
                        : {},
                    ]}>
                    {data}
                  </Text>
                  {categoryIndex.index == index ? (
                    <View style={styles.ActiveCategory} />
                  ) : (
                    <></>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : null}

        {/* Concert Flatlist */}

        {!isLoading ? (
          <ScrollView
            horizontal={true}
            directionalLockEnabled={true}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
          >

            <FlatList
              ref={(ref) => ListRef.current = ref}
              //horizontal
              numColumns={2}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={
                <View style={{ flex: 1, paddingHorizontal: 100, }}>
                  <EmptyListAnimation title={'No Concert Available'} />
                </View>
              }
              contentContainerStyle={styles.FlatListContainer}
              //data={filteredConcert.filter((item) => daysLeft(item.date) != null && calTotalAvailableTickets(item.zoneInfo) >= 0)}
              data={filteredConcert}
              keyExtractor={(item) => String(item.cId)}
              renderItem={({ item }) => (
                <>
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
                </>
              )}
            />
          </ScrollView>
        ) : null}

        {/* Sorted Concert Flatlist */}
        {/* {!isLoading ? (
          <ScrollView
            horizontal={true}
            directionalLockEnabled={true}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
          >
            <FlatList
              ref={ListRef}
              //horizontal
              numColumns={2}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={
                <View style={{ flex: 1, paddingHorizontal: 100, }}>
                  <EmptyListAnimation title={'No Concert Available'} />
                </View>
              }
              contentContainerStyle={styles.FlatListContainer}
              //data={filteredConcert.filter((item) => daysLeft(item.date) != null && calTotalAvailableTickets(item.zoneInfo) >= 0)}
              data={sortedConcertList}
              keyExtractor={(item) => String(item.cId)}
              renderItem={({ item }) => (
                <>
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
                </>
              )}
            />

          </ScrollView>
        ) : null} */}

        {/* <TouchableOpacity
          style={[styles.ScrollToButtonContainer, { bottom: 70, right: 30 }]}
          onPress={TopButtonHandler}
        >
          <GradientBGIcon
            //style={[styles.ScrollToButtonContainer, { top: 70, right: 30 }]}
            name="arrow-up"
            color={COLORS.primaryOrangeHex}
            size={FONTSIZE.size_16}
          />
        </TouchableOpacity> */}

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
    paddingHorizontal: SPACING.space_10,
    //marginBottom: SPACING.space_10,
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
  ScrollToButtonContainer: {
    position: 'absolute',
  },
});

export default HomeScreen;
