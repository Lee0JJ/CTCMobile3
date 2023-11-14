import React, { useState, useEffect } from 'react';
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
import { useStore } from '../store/store';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import ImageBackgroundInfo from '../components/ImageBackgroundInfo';
import PaymentFooter from '../components/PaymentFooter';
import { act } from 'react-test-renderer';
import { useStateContext } from '../context';
// import {StatusBar} from 'expo-status-bar';
// import {COLORS} from '../../constants';
// import {ImageBackgroundInfo, ZoneInfoList} from '../../components';
// import {styles} from './styles';

const ZoneInfo = ({ data, onTicketAmountChange }) => {
  const { purchaseTickets } = useStateContext();
  const [ticketAmount, setTicketAmount] = useState(0);

  const handleTicketAmountChange = (newAmount, action) => {
    if (action === 'add') {
      const updatedAmount = ticketAmount + newAmount;
      if (updatedAmount <= data.seatAmount) {
        setTicketAmount(updatedAmount);
        onTicketAmountChange(data.price, newAmount, 'add');
      }
    } else {
      const updatedAmount = ticketAmount - newAmount;
      if (updatedAmount >= 0) {
        setTicketAmount(updatedAmount);
        onTicketAmountChange(data.price, newAmount, 'subtract');
      }
    }
  };

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
        Price : {data.price} {"\n"}
        Available Seat : {data.seatAmount}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => handleTicketAmountChange(1, 'subtract')}
          disabled={ticketAmount === 0}
          style={{
            backgroundColor: COLORS.primaryOrangeHex,
            padding: 5,
            borderRadius: 5,
            marginRight: 5,
          }}>
          <Text style={{ color: COLORS.white }}> - </Text>
        </TouchableOpacity>
        <TextInput
          value={ticketAmount.toString()}
          onChangeText={(text) => handleTicketAmountChange(parseInt(text) - ticketAmount, 'add')}
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
          onPress={() => handleTicketAmountChange(1, 'add')}
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

const ZoneInfoList = ({ zoneInfo, onTicketAmountChange }) => {
  return (
    <>
      {zoneInfo.map((data) => (
        <ZoneInfo
          key={data.price}
          data={data}
          onTicketAmountChange={onTicketAmountChange}
        />
      ))}
    </>
  );
};

const DetailsScreen = ({ navigation, route }) => {

  //console.log("DetailsScreen route.params", route.params.item);
  const item = route.params.item;

  const [imageURL, setImageURL] = useState([]);

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
      .catch(error => console.error(error));
  }

  //fetch image from campaign.imageUrl which is a directory link a of set of images then convert it to array string
  useEffect(() => {
    if (item) {
      fetchImage(item.image);
    }
  }, [item]);

  const [fullDesc, setFullDesc] = useState(false);

  const BackHandler = () => {
    navigation.pop();
  };

  const [totalPrice, setTotalPrice] = useState(0);

  const handleTicketAmountChange = (price, newAmount, action) => {
    if (action === 'add') {
      setTotalPrice(totalPrice + price * newAmount);
    } else {
      setTotalPrice(totalPrice - price * newAmount);
    }
    console.log('totalPrice', totalPrice);
  }

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <ImageBackgroundInfo
          EnableBackHandler={true}
          imagelink_portrait={imageURL[0]}
          type={'type'}
          id={route.params.item.cId}
          favourite={'favourite'}
          name={route.params.item.name}
          special_ingredient={route.params.item.venue}
          ingredients={route.params.item.venue}
          average_rating={'4.5'}
          ratings_count={'100'}
          roasted={'roasted'}
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
          <Text style={styles.InfoTitle}>Ticket Selection</Text>
          <View style={styles.SizeOuterContainer}>
            <ZoneInfoList
              zoneInfo={route.params.item.zoneInfo}
              onTicketAmountChange={handleTicketAmountChange}
            />
          </View>
          <View style={styles.FooterButtonContainer}>
            <TouchableWithoutFeedback onPress={() => alert(totalPrice)}>
              <View style={styles.FooterButton}>
                <Text style={styles.FooterButtonText}>Purchase</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>

      <PaymentFooter
        price={totalPrice}
        buttonTitle="Purchase"
        buttonPressHandler={() => {
          //purchase ticket by calling each zone separately by calling purchaseTickets
          route.params.item.zoneInfo.forEach(zone => {
            if (zone.seatAmount > 0) {
              purchaseTickets(uniqueId, concertId, zoneId, numTickets, amount);
            }
          })
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
