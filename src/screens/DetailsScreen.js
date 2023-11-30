import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import ImageBackgroundInfo from '../components/ImageBackgroundInfo';
import PaymentFooter from '../components/PaymentFooter';
import { useStateContext } from '../context';
import DeviceInfo from 'react-native-device-info';
import PopUpAnimation from '../components/PopUpAnimation';
import ImageSlider from '../components/ImageSlider';
import Loader from '../components/Loader';
import { daysLeft, calTotalAvailableTickets, calLowestTicketPrice } from '../utils';

const rates = 0.001;

const ZoneInfo = ({ data, index, onTicketAmountChange, zoneTicket }) => {

  return (
    <TouchableOpacity
      key={data.price}
      onPress={() => {
        console.log('data', data);
      }}
      style={[
        styles.SizeBox,
        {
          borderColor:
            data.seatAmount > 0
              ? COLORS.primaryOrangeHex
              : COLORS.primaryDarkGreyHex,
        },
      ]}>
      <Text
        style={[
          styles.SizeText,
          {
            fontSize:
              data.seatAmount > 0 ? FONTSIZE.size_14 : FONTSIZE.size_16,
            color:
              data.seatAmount > 0
                ? COLORS.primaryOrangeHex
                : COLORS.secondaryLightGreyHex,
            textAlign: 'left', // Add this line to left align the text
            paddingLeft: 10,
          },
        ]}>
        Price : {data.price * rates} {"\n"}
        Available Seat : {data.seatAmount}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => onTicketAmountChange(1, index, 'subtract')}
          style={{
            backgroundColor: COLORS.primaryOrangeHex,
            padding: 5,
            borderRadius: 5,
            marginRight: 5,
          }}>
          <Text style={{ color: COLORS.white, zIndex: 1 }}> - </Text>
        </TouchableOpacity>
        <TextInput
          value={zoneTicket[index].toString()}
          onChangeText={(text) =>
            onTicketAmountChange(text, index, 'input')
          }
          keyboardType="numeric"
          style={{
            color: COLORS.primaryOrangeHex,
            borderWidth: 1,
            borderColor: COLORS.primaryOrangeHex,
            borderRadius: 5,
            padding: 5,
            width: 50,
            textAlign: 'center',
          }}
        />
        <TouchableOpacity
          onPress={() => onTicketAmountChange(1, index, 'add')}
          style={{
            backgroundColor: COLORS.primaryOrangeHex,
            padding: 5,
            borderRadius: 5,
            marginLeft: 5,
          }}>
          <Text style={{ color: COLORS.white }}> + </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const DetailsScreen = ({ navigation, route }) => {

  const { purchaseTickets, getUserTickets, getConcertById } = useStateContext();
  const [imageURL, setImageURL] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showPaySuccess, setShowPaySuccess] = useState(false);
  const [showPayFail, setShowPayFail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [item, setItem] = useState(route.params.item);

  useEffect(() => {
    let intervalId;
    const fetchConcert = async () => {
      try {
        setIsLoading(true);
        let concert = await getConcertById(route.params.item.cId.toString());
        setItem(prevItem => ({ ...prevItem, zoneInfo: concert.zoneInfo }));
        setIsLoading(false);
      } catch (error) {
        console.log("fetchConcert error", error);
        setIsLoading(false);
        // Handle the error here
      }
    }
    fetchConcert();
    intervalId = setInterval(fetchConcert, 10000); //10 seconds
    return () => clearInterval(intervalId);
  }, [route.params.item]);


  //Create function 
  const fetchImage = async (image) => {
    fetch(image, { method: 'get' })
      .then(response => response.json())
      .then(data => {
        if (data) {
          //console.log('data', data);
          setImageURL(Object.values(data));
          //console.log('imageURL', imageURL);
        }
      })
      .catch(error => console.log("fetch image", error));
  }

  //fetch image from campaign.imageUrl which is a directory link a of set of images then convert it to array string
  useEffect(() => {
    const fetchImageAsync = async () => {
      if (item) {
        setIsLoading(true);
        await fetchImage(item.image);
        setIsLoading(false);
      }
    };
    fetchImageAsync();
  }, [item]);

  const [fullDesc, setFullDesc] = useState(false);

  const BackHandler = () => {
    navigation.pop();
  };

  const [totalPrice, setTotalPrice] = useState(0);
  //Declare length 3 array variable to store ticket amount for each zone

  const [zoneTicket, setZoneTicket] = useState(Array.from({ length: item.zoneInfo.length }, () => 0));
  const [selectedZone, setSelectedZone] = useState(null);

  const handleTicketAmountChange = (input, zoneId, action) => {
    setSelectedZone(zoneId);

    if (action === 'input') {
      setZoneTicket(prevState => {
        const newState = [...prevState];
        newState[zoneId] = parseInt(input);
        for (let i = 0; i < newState.length; i++) {
          if (i !== zoneId) {
            newState[i] = 0;
          }
        }
        return newState;
      });
    } else if (action === 'add') {
      setZoneTicket(prevState => {
        const newState = [...prevState];
        newState[zoneId] += 1;
        for (let i = 0; i < newState.length; i++) {
          if (i !== zoneId) {
            newState[i] = 0;
          }
        }
        return newState;
      });
    } else if (action === 'subtract') {
      setZoneTicket(prevState => {
        const newState = [...prevState];
        newState[zoneId] -= 1;
        for (let i = 0; i < newState.length; i++) {
          if (i !== zoneId) {
            newState[i] = 0;
          }
        }
        return newState;
      });
    }

    // Fix negative and overflow values
    setZoneTicket(prevState => {
      const newState = [...prevState];
      for (let i = 0; i < newState.length; i++) {
        if (newState[i] < 0) {
          newState[i] = 0;
        }
        if (newState[i] > item.zoneInfo[i].seatAmount) {
          newState[i] = item.zoneInfo[i].seatAmount;
        }
      }
      return newState;
    });
  };

  useEffect(() => {
    //set totalprice as sum of selected zone ticket price
    if (selectedZone !== null) {
      setTotalPrice(item.zoneInfo[selectedZone].price * zoneTicket[selectedZone]);
    }
  }, [selectedZone, zoneTicket]);


  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

      {showAnimation ? (
        <PopUpAnimation
          style={styles.LottieAnimation}
          source={require('../lottie/ticket.json')}
        />
      ) : (
        <></>
      )}

      {showPaySuccess ? (
        <PopUpAnimation
          style={styles.LottieAnimation}
          source={require('../lottie/successful.json')}
        />
      ) : (
        <></>
      )}

      {showPayFail ? (
        <PopUpAnimation
          style={styles.LottieAnimation}
          source={require('../lottie/fail.json')}
        />
      ) : (
        <></>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <ImageBackgroundInfo
          EnableBackHandler={true}
          imagelink_portrait={imageURL[0]}
          type={daysLeft(item.date)}
          id={item.cId}
          favourite={'favourite'}
          name={item.name}
          special_ingredient={item.venue}
          ingredients={calLowestTicketPrice(item.zoneInfo)}
          average_rating={calTotalAvailableTickets(item.zoneInfo)}
          ratings_count={''}
          roasted={''}
          BackHandler={BackHandler}
        />

        <View style={styles.FooterInfoArea}>
          <Text style={styles.InfoTitle}>Description</Text>
          {fullDesc ? (
            <TouchableWithoutFeedback
              onPress={() => {
                setFullDesc(prev => !prev);
              }}>
              <Text style={styles.DescriptionText}>
                {/* {ItemOfIndex.description} */}
              </Text>
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback
              onPress={() => {
                setFullDesc(prev => !prev);
              }}>
              <Text numberOfLines={3} style={styles.DescriptionText}>
                {/* {ItemOfIndex.description} */}
              </Text>
            </TouchableWithoutFeedback>
          )}

          <ImageSlider images={imageURL} />
          <Text>
            {'\n'}
          </Text>
          <Text style={styles.InfoTitle}>Ticket Selection</Text>
          <View style={styles.SizeOuterContainer}>
            {item.zoneInfo.map((data, index) => (
              <ZoneInfo
                key={index}
                index={index}
                data={data}
                onTicketAmountChange={handleTicketAmountChange}
                zoneTicket={zoneTicket}
              />
            ))}
          </View>
          {/* <View style={styles.FooterButtonContainer}>
            <TouchableWithoutFeedback onPress={() => alert(totalPrice)}>
              <View style={styles.FooterButton}>
                <Text style={styles.FooterButtonText}>Purchase</Text>
              </View>
            </TouchableWithoutFeedback>
          </View> */}
        </View>
      </ScrollView>

      <PaymentFooter
        price={totalPrice * rates}
        buttonTitle="Purchase"
        buttonPressHandler={async () => {
          //purchase ticket by calling each zone separately by calling purchaseTickets
          const uniqueId = DeviceInfo.getUniqueId();
          if (selectedZone !== null &&  zoneTicket[selectedZone] > 0 && zoneTicket[selectedZone] <= item.zoneInfo[selectedZone].seatAmount) {
            setShowAnimation(true);
            try {
              await purchaseTickets(uniqueId._j, item.cId, selectedZone + 1, zoneTicket[selectedZone], totalPrice * rates);
              setShowPaySuccess(true);
              getUserTickets(uniqueId._j);
              setTimeout(() => {
                setShowPaySuccess(false);
                navigation.navigate('History');
              }, 1500);
            } catch (error) {
              console.error(error);
              setShowPayFail(true);
              setTimeout(() => {
                setShowPayFail(false);
                navigation.navigate('Home');
              }, 1500);
              // handle error here
            }
            setShowAnimation(false);
          }

          // addToCarthandler({
          //   id: ItemOfIndex.id,
          //   index: ItemOfIndex.index,
          //   name: ItemOfIndex.name,
          //   roasted: ItemOfIndex.roasted,
          //   imagelink_square: ItemOfIndex.imagelink_square,
          //   special_ingredient: ItemOfIndex.special_ingredient,
          //   type: ItemOfIndex.type,
          //   price: price,
          // });
        }}

      />
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
    justifyContent: 'space-between',
  },
  FooterInfoArea: {
    padding: SPACING.space_20,
  },
  InfoTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
    marginBottom: SPACING.space_10,
  },
  DescriptionText: {
    letterSpacing: 0.5,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    marginBottom: SPACING.space_30,
  },
  SizeOuterContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.space_20,
  },
  SizeBox: {
    flex: 1,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: SPACING.space_24 * 4,
    borderRadius: BORDERRADIUS.radius_10,
    borderWidth: 2,
    flexDirection: 'row',
    paddingHorizontal: SPACING.space_10,
  },
  SizeOuterContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: SPACING.space_20,
  },
  SizeText: {
    fontFamily: FONTFAMILY.poppins_medium,
  },
});

export default DetailsScreen;
