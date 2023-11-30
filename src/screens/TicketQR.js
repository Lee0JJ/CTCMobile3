import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput,
    Button,
    Platform,
    PermissionsAndroid,
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
import PopUpAnimation from '../components/PopUpAnimation';
import ImageSlider from '../components/ImageSlider';
import Loader from '../components/Loader';
import { daysLeft, calTotalAvailableTickets, calLowestTicketPrice } from '../utils';
import HeaderBar from '../components/HeaderBar';

import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';

import DeviceInfo from 'react-native-device-info';

import GradientBGIcon from '../components/GradientBGIcon';

const TicketQR = ({ navigation, route }) => {
    // Retrieve the ticket from the route
    const ticket = JSON.parse(route.params.item);
    //console.log('ticket', ticket[0]);

    const BackHandler = () => {
        navigation.pop();
    };


    const [showAnimation, setShowAnimation] = useState(false);
    const [QRcode, setQRcode] = useState('default');
    const qrCodeRef = useRef(null);
    const viewShotRef = useRef(null);

    const uniqueId = DeviceInfo.getUniqueId();

    return (
        <View style={styles.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.primaryWhiteHex} />

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

                <View style={{backgroundColor:styles.primaryBlackHex, alignItems: 'flex-start', paddingHorizontal: SPACING.space_30,}}>
                    <TouchableOpacity
                        onPress={() => {
                            BackHandler();
                        }}>
                        <GradientBGIcon
                            name="arrow-back"
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_16}
                        />
                    </TouchableOpacity>
                </View>

                <Text
                    style={[
                        styles.SizeText,
                        {
                            fontSize: FONTSIZE.size_18,
                            color: COLORS.primaryWhiteHex,
                            paddingBottom: SPACING.space_30,
                            paddingHorizontal: SPACING.space_30,
                            paddingTop: SPACING.space_30,
                        }
                    ]}
                >
                    Scan this QR code to redeem your ticket
                </Text>

                <ViewShot
                    ref={viewShotRef}
                    options={{ format: 'jpg', quality: 0.9 }}
                    style={styles.QRCodeContainer}
                >
                    <QRCode
                        value={JSON.stringify(ticket)}
                        //value={"老板是肥婆"}
                        size={250}
                        color="black"
                        backgroundColor="white"
                    />
                </ViewShot>

                <View style={styles.SizeOuterContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            console.log('Unique ID', uniqueId._j);
                        }}
                        style={[
                            styles.SizeBox,
                            {
                                borderColor: COLORS.primaryOrangeHex
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.SizeText,
                                {
                                    fontSize: FONTSIZE.size_14,
                                    color: COLORS.primaryWhiteHex,
                                }
                            ]}
                        >
                            OWNER: {uniqueId._j}
                        </Text>
                    </TouchableOpacity>

                    {ticket.map((data, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                console.log('data', data.ticketId);
                            }}
                            style={[
                                styles.SizeBox,
                                {
                                    borderColor: COLORS.primaryOrangeHex
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.SizeText,
                                    {
                                        fontSize: FONTSIZE.size_14,
                                        color: COLORS.primaryWhiteHex,
                                    }
                                ]}
                            >
                                Receipt: {data.ticketId + "\n"}
                                Used Status: {JSON.stringify(data.used)}
                            </Text>
                        </TouchableOpacity>
                    ))}
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
    SizeText: {
        fontFamily: FONTFAMILY.poppins_medium,
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
    QRCodeContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: COLORS.primaryWhiteHex,
        width: Dimensions.get('window').width - SPACING.space_30 * 2,
        height: Dimensions.get('window').width - SPACING.space_30 * 2,
        borderRadius: BORDERRADIUS.radius_20,
    },
    SizeOuterContainer: {
        paddingHorizontal: SPACING.space_30,
        paddingVertical: SPACING.space_30,
        flexDirection: 'column',
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
    SizeText: {
        fontFamily: FONTFAMILY.poppins_medium,
    },
});

export default TicketQR;
