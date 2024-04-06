import { useState, useEffect } from 'react';
import { ActivityIndicator, Dimensions, Image, View } from 'react-native';
import { COLORS } from '../constants';

const ChapterImage = ({ uri }) => {
    const [isLoading, setIsLoading] = useState(true)
    const win = Dimensions.get('window')
    const [height, setHeight] = useState(570)

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
            <ActivityIndicator size="large" color={COLORS.primary} style={{ display: isLoading ? 'flex' : 'none', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }} />
            <Image onLoadEnd={() => setIsLoading(false)} source={{ uri: uri }} style={{ width: win.width, height: height }} />
        </View>

    );
};

export default ChapterImage;