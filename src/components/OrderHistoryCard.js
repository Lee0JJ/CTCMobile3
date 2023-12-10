import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import OrderItemCard from './OrderItemCard';
import CustomIcon from './CustomIcon';
import { useStateContext } from '../context';

const OrderHistoryCard = ({
  navigationHandler,
  CartList,
  Title,
  OccurDate,
}) => {
  //console.log('CartList', CartList);
  const concertTicket = Object.values(CartList);
  //console.log('concertTicket', concertTicket);
  //console.log('concertTicket[0][0].cId', JSON.stringify(concertTicket[0][0].concertId, null, 2));
  return (
    <View style={styles.CardContainer}>
      <View style={styles.CardHeader}>
        <View>
          <Text style={styles.HeaderTitle}>{Title}</Text>
          {/* <Text style={styles.HeaderSubtitle}>{new Date(concertTicket[0][0].time * 1000).toLocaleString()}</Text> */}
          {/* <Text style={styles.HeaderSubtitle}>{concertTicket[0][0].concertId}</Text> */}
        </View>
        <View style={styles.PriceContainer}>
          <Text style={styles.HeaderTitle}>{OccurDate}</Text>
          {/* <Text style={styles.HeaderPrice}>
            <CustomIcon
              name="ticket"
              size={18}
              color={COLORS.primaryOrangeHex}
            /> {"10"}
          </Text> */}
        </View>
      </View>
      <View style={styles.ListContainer}>
        {concertTicket.map((data, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => {
              console.log('date',  concertTicket.every(ticket => ticket[0].used));
              if (OccurDate < new Date().toLocaleString()) {
                return 0;
              } else {
                //console.log('data', JSON.stringify(data, null, 2));
                navigationHandler.push('Ticket', {
                  //id: data[0].concertId,
                  item: JSON.stringify(data),
                });
              }
            }}>
            <OrderItemCard
              type={data[0].concertId}
              name={"Zone " + data[0].zoneId}
              imagelink_square={data[0].image}
              special_ingredient={new Date(data[0].time * 1000).toLocaleString()}
              prices={"data.prices"}
              ItemPrice={data.length}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  CardContainer: {
    gap: SPACING.space_10,
  },
  CardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.space_20,
    alignItems: 'center',
  },
  HeaderTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
  },
  HeaderSubtitle: {
    fontFamily: FONTFAMILY.poppins_light,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
  },
  PriceContainer: {
    alignItems: 'flex-end',
  },
  HeaderPrice: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryOrangeHex,
  },
  ListContainer: {
    gap: SPACING.space_20,
  },
});

export default OrderHistoryCard;
