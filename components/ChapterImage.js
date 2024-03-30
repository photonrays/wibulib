import { useState, useEffect } from 'react';
import FitImage from 'react-native-fit-image';
import { COLORS } from '../constants';
import { Dimensions, Image, View } from 'react-native';
import { BoldText } from './BoldText';


const ChapterImage = ({ uri }) => {
    const [isLoading, setIsLoading] = useState(true)
    const win = Dimensions.get('window')
    const [height, setHeight] = useState(win.height * 0.8)

    useEffect(() => {
        if (!isLoading) {
            Image.getSize(uri, (width, height) => {
                const ratio = width / height
                setHeight(win.width / ratio)
            })
        }
    }, [isLoading])

    return (
        <View style={{ position: 'relative', width: win.width, height: height }}>
            <FitImage onLoadEnd={() => setIsLoading(false)} style={{ backgroundColor: COLORS.white }} source={{ uri: uri }} indicatorSize="large" />
        </View>

    );
};

export default ChapterImage;