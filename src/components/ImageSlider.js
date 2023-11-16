
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Image, View, Text, Dimensions } from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const ImageSlider = ({ images }) => {
    const [imageActive, setImageActive] = useState(0);

    const handleScroll = (event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const currentIndex = event.nativeEvent.contentOffset.x / slideSize;
        setImageActive(currentIndex);
    };

    onChange = (nativeEvent) => {
        if (nativeEvent) {
            const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
            if (slide !== imageActive) {
                setImageActive(slide);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.wrap}>
                <ScrollView
                    onScroll={({ nativeEvent }) => onChange(nativeEvent)}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScroll}
                    style={styles.wrap}
                >
                    {images.map((image, index) => (
                        <Image
                            key={image}
                            resizeMode='stretch'
                            source={{ uri: image }}
                            style={styles.wrap} />
                    ))}

                </ScrollView >
                <View style={styles.wrapDot}>
                    {images.map((e, index) => (
                        <Text
                            key={e}
                            style={imageActive == index ? styles.dotActive : styles.dot}
                        >
                            ⬤
                        </Text>

                    ))}
                </View>
            </View>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrap: {
        width: WIDTH * 0.9,
        height: HEIGHT * 0.25,
    },
    wrapDot: {
        position: 'absolute',
        bottom: 0,
        //width: '100%',
        flexDirection: 'row',
        //justifyContent: 'center',
        alignSelf: 'center',
        //alignItems: 'center',
        //paddingBottom: 10,
    },
    dot: {
        // width: 8,
        // height: 8,
        // borderRadius: 4,
        color: 'black',
        margin: 3,
    },
    dotActive: {
        margin: 3,
        color: 'white',
    },
});

export default ImageSlider;
