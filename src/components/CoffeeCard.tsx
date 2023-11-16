import React, { useEffect } from 'react';
import {
  Dimensions,
  ImageBackground,
  ImageProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import CustomIcon from './CustomIcon';
import BGIcon from './BGIcon';
import { thirdweb } from '../assets/index';

import { daysLeft, calTotalAvailableTickets, calLowestTicketPrice } from '../utils';

const CARD_WIDTH = Dimensions.get('window').width * 0.32;


// name={item.name}
// image={item.image}
// price={"0"}
// venue={item.venue}
// date={item.date}

const CoffeeCard: React.FC<any> = ({
  item
}) => {


  const [imageURL, setImageURL] = React.useState<any[]>([]);

  //Create function 
  const fetchImage = async (image: any) => {
    fetch(image, { method: 'get' })
      .then(response => response.json())
      .then(data => {
        if (data) {
          setImageURL(Object.values(data));
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

  return (
    <LinearGradient
      key={item.cId}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.CardLinearGradientContainer}
      colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}>
      <ImageBackground
        source={imageURL.length == 0 ? (thirdweb) :({ uri: imageURL[0] })}
        //source={thirdweb}
        style={styles.CardImageBG}
        resizeMode="cover">
        <View style={styles.CardRatingContainer}>
          <CustomIcon
            name={daysLeft(item.date) == null ? "mic-off-sharp" : 'mic'}
            color={COLORS.primaryOrangeHex}
            size={FONTSIZE.size_16}
          />
          <Text style={styles.CardRatingText}>{/*average_rating*/} {item.name}</Text>
        </View>
      </ImageBackground>
      <Text style={styles.CardTitle}>{item.name}</Text>
      <Text style={styles.CardSubtitle}>{/*special_ingredient*/} {item.venue}</Text>
      <View style={styles.CardFooterRow}>
        <Text style={styles.CardPriceCurrency}>
          <Text style={styles.CardPrice}>{calTotalAvailableTickets(item.zoneInfo)} Tickets left</Text>
        </Text>
        {/* <TouchableOpacity
          onPress={() => {
            buttonPressHandler({
              id
            });
          }}>
          <BGIcon
            color={COLORS.primaryWhiteHex}
            name={'add'}
            BGColor={COLORS.primaryOrangeHex}
            size={FONTSIZE.size_10}
          />
        </TouchableOpacity> */}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  CardLinearGradientContainer: {
    marginHorizontal: 5,
    padding: SPACING.space_15,
    borderRadius: BORDERRADIUS.radius_25,
  },
  CardImageBG: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: BORDERRADIUS.radius_20,
    marginBottom: SPACING.space_15,
    overflow: 'hidden',
  },
  CardRatingContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryBlackRGBA,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.space_10,
    paddingHorizontal: SPACING.space_15,
    position: 'absolute',
    borderBottomLeftRadius: BORDERRADIUS.radius_20,
    borderTopRightRadius: BORDERRADIUS.radius_20,
    top: 0,
    right: 0,
  },
  CardRatingText: {
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.primaryWhiteHex,
    lineHeight: 22,
    fontSize: FONTSIZE.size_14,
  },
  CardTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_16,
  },
  CardSubtitle: {
    fontFamily: FONTFAMILY.poppins_light,
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_10,
  },
  CardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.space_15,
  },
  CardPriceCurrency: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryOrangeHex,
    fontSize: FONTSIZE.size_18,
  },
  CardPrice: {
    color: COLORS.primaryWhiteHex,
  },
});

export default CoffeeCard;
