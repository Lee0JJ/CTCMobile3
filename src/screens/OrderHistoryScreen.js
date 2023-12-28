import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
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
import EmptyListAnimation from '../components/EmptyListAnimation';
import PopUpAnimation from '../components/PopUpAnimation';
import OrderHistoryCard from '../components/OrderHistoryCard';
import { useStateContext } from '../context';
import DeviceInfo from 'react-native-device-info';

const OrderHistoryScreen = ({ navigation }) => {

  const { contract, address, getUserTickets, getCampaigns } = useStateContext();
  const [concertList, setConcertList] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const uniqueId = DeviceInfo.getUniqueId();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        if (contract) {
          setIsLoading(true);
          const tickets = await getUserTickets(uniqueId);

          if (tickets) {
            const groupedTickets = tickets.reduce((grouped, ticket) => {
              const concertId = ticket.concertId;
              const zoneId = ticket.zoneId;

              // Create an object for the concertId if it doesn't exist
              grouped[concertId] = grouped[concertId] || {};

              // Create an array for the zoneId if it doesn't exist
              grouped[concertId][zoneId] = grouped[concertId][zoneId] || [];

              // Push the ticket into the array for the concertId and zoneId
              grouped[concertId][zoneId].push(ticket);

              return grouped;
            }, {});
            //console.log("groupedTickets", JSON.stringify(groupedTickets, null, 2));
            setUserTickets(groupedTickets);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.log("fetchTicket error", error);
        setIsLoading(false);
        // Handle the error here
      }
    }
    const intervalId = setInterval(fetchTicket, 10000); //10 seconds
    fetchTicket();
    return () => clearInterval(intervalId);
  }, [contract]);//contract

  useEffect(() => {
    let intervalId;
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        setShowAnimation(true);
        const data = await getCampaigns();
        setConcertList(data);
        setIsLoading(false);
        setShowAnimation(false);
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

  const OrderHistoryList = useStore((state) => state.OrderHistoryList);
  const tabBarHeight = useBottomTabBarHeight();
  const [showAnimation, setShowAnimation] = useState(false);

  const navigationHandler = ({ index, id, type }) => {
    navigation.push('Details', {
      index,
      id,
      type,
    });
  };

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
        <View
          style={[styles.ScrollViewInnerView, { marginBottom: tabBarHeight }]}>
          <View style={styles.ItemContainer}>
            <HeaderBar title="Ticket Wallet" />
            {!userTickets ? (
              <View style={{ flex: 1, paddingHorizontal: 100, }}>
                <EmptyListAnimation title={'No Concert Available'} />
              </View>
            ) : (
              <View style={styles.ListItemContainer}>
                {Object.values(userTickets).map((data, index) => {
                  //try {
                  return (
                    <OrderHistoryCard
                      key={index.toString()}
                      navigationHandler={navigation}
                      CartList={data}
                      Title={concertList && concertList[Object.values(data)[0][0].concertId - 1]?.name}
                      OccurDate={new Date(concertList && concertList[Object.values(data)[0][0].concertId - 1]?.date * 1000).toLocaleString()}
                    //CartListPrice={data} //data["1"].length
                    //OrderDate={new Date(data.time * 1000).toLocaleString()}
                    />
                  );
                  // } catch (error) {
                  //   console.log(data);
                  //   console.log(data.length);
                  //   console.error("Error rendering OrderHistoryCard", error);
                  //   return null;
                  // }
                })}
              </View>
            )}
          </View>
          {/* {userTickets.length > 0 ? (
            <TouchableOpacity
              style={styles.DownloadButton}
              onPress={() => {
                buttonPressHandler();
              }}>
              <Text style={styles.ButtonText}>Download</Text>
            </TouchableOpacity>
          ) : (
            <></>
          )} */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  LottieAnimation: {
    height: 250,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScrollViewInnerView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ItemContainer: {
    flex: 1,
  },
  ListItemContainer: {
    paddingHorizontal: SPACING.space_20,
    gap: SPACING.space_30,
  },
  DownloadButton: {
    margin: SPACING.space_20,
    backgroundColor: COLORS.primaryOrangeHex,
    alignItems: 'center',
    justifyContent: 'center',
    height: SPACING.space_36 * 2,
    borderRadius: BORDERRADIUS.radius_20,
  },
  ButtonText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
});

export default OrderHistoryScreen;
