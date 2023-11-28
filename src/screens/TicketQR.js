
import QRCode from 'react-native-qrcode-svg';

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
import { Dimensions } from 'react-native';
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
import HeaderBar from '../components/HeaderBar';

const TicketQR = ({ route }) => {
    // Retrieve the ticket from the route
    const ticket = route.params.item;
    console.log('ticket', ticket);

    const [showAnimation, setShowAnimation] = useState(false);

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

                <HeaderBar title="Ticket QR" />

                <View style={styles.FlatListContainer}>
                    <View style={styles.InputContainerComponent}>
                        <Text>{ticket}</Text>
                    </View>
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
});

export default TicketQR;
