import React, { useEffect, useState } from 'react'
import { Dimensions, Pressable, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import Modal from "react-native-modal";
import { NormalText } from './NormalText';
import { COLORS } from '../constants';
import { FontAwesome6, Ionicons, AntDesign } from '@expo/vector-icons';
import { MangaContentRating, MangaPublicationDemographic, MangaPublicationStatus, Order } from '../api/static';
import { SelectDropdown } from './Dropdown'
import { BoldText } from './BoldText';
import { SemiBoldText } from './SemiBoldText';
import { getMangaTag } from '../api/manga';
import CustomDropdown from './CustomDropdown';

const sortByData = [
    { title: 'Mới cập nhật', value: { updatedAt: Order.DESC } },
    { title: 'Cập nhật cũ nhất', value: { updatedAt: Order.ASC } },
    { title: 'Đánh giá giảm dần', value: { rating: Order.DESC } },
    { title: 'Đánh giá tăng dần', value: { rating: Order.ASC } },
    { title: 'Lượt theo dõi giảm dần', value: { followedCount: Order.DESC } },
    { title: 'Lượt theo dõi tăng dần', value: { followedCount: Order.ASC } },
    { title: 'Mới thêm gần đây', value: { createdAt: Order.DESC } },
    { title: 'Thêm cũ nhất', value: { createdAt: Order.ASC } },
    { title: 'Năm tăng dần', value: { year: Order.ASC } },
    { title: 'Năm giảm dần', value: { year: Order.DESC } }]
const contentRatingData = [
    { title: 'Safe', value: MangaContentRating.SAFE },
    { title: 'Erotica', value: MangaContentRating.EROTICA },
    { title: 'Pornographic', value: MangaContentRating.PORNOGRAPHIC },
    { title: 'Suggestive', value: MangaContentRating.SUGGESTIVE }]
const demographicData = [
    { title: 'Josei', value: MangaPublicationDemographic.JOSEI },
    { title: 'Seinen', value: MangaPublicationDemographic.SEINEN },
    { title: 'Shoujo', value: MangaPublicationDemographic.SHOUJO },
    { title: 'Shounen', value: MangaPublicationDemographic.SHOUNEN }]
const publicationStatusData = [
    { title: 'Ongoing', value: MangaPublicationStatus.ONGOING },
    { title: 'Completed', value: MangaPublicationStatus.COMPLETED },
    { title: 'Cancelled', value: MangaPublicationStatus.CANCELLED },
    { title: 'Hiatus', value: MangaPublicationStatus.HIATUS }]

export default function SearchFilter({ isVisible, setIsVisible, options, setOptions }) {
    const win = Dimensions.get('window')
    const [tags, setTags] = useState([])
    // const [selectedTags, setSelectedTags] = useState(options.includedTags || [])

    useEffect(() => {
        getMangaTag()
            .then((data) => {
                data.data.data.sort(function (a, b) {
                    if (a.attributes.name.en < b.attributes.name.en) {
                        return -1;
                    }
                    if (a.attributes.name.en > b.attributes.name.en) {
                        return 1;
                    }
                    return 0;
                });
                setTags(data.data.data)
            })
            .catch((err) => {
                console.log(err);
            });
    }, [])

    const removeKey = (key) => {
        setValue(prev => {
            const { [key]: _, ...rest } = prev;
            return rest;
        });
    }

    useEffect(() => {
        if (tags) console.log(tags)
    }, [tags])

    const TagItem = ({ obj }) => {
        return (
            <Pressable onPress={() => {
                if (options.includedTags && options.includedTags.includes(obj.id)) {
                    if (options.includedTags.length === 1) {
                        setOptions(prev => {
                            const { includedTags, ...rest } = prev;
                            return rest;
                        });
                    } else {
                        setOptions(prev => ({ ...prev, includedTags: prev.includedTags.filter(o => o !== obj.id) }))
                    }
                } else if (options.includedTags) {
                    setOptions(prev => ({ ...prev, includedTags: [...prev.includedTags, obj.id] }))
                } else {
                    setOptions(prev => ({ ...prev, includedTags: [obj.id] }))
                }
            }} style={{ ...styles.tag, backgroundColor: options.includedTags?.includes(obj.id) ? COLORS.primary : COLORS.gray }}>
                <NormalText>{obj.attributes.name.en}</NormalText>
            </Pressable>
        )
    }

    return (
        <Modal
            isVisible={isVisible}
            style={{ width: win.width, height: win.height, backgroundColor: COLORS.gray, margin: 0 }}
            animationIn={'slideInLeft'}
            animationOut={'slideOutLeft'}
        >
            <View style={{ flex: 1, padding: 15, gap: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <BoldText style={{ fontSize: 20, }}>ADVANCED SEARCH</BoldText>
                    <TouchableOpacity style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => setIsVisible(false)}>
                        <Ionicons name="close" size={30} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 10 }}>
                    <View>
                        <NormalText>Sort by</NormalText>
                        <CustomDropdown data={sortByData} setValue={setOptions} value={options} queryKey={'order'} />
                    </View>
                    <View>
                        <NormalText>Tags</NormalText>
                        <SelectDropdown
                            multipleSelect={true}
                            renderButton={(isOpened) => {
                                let tagList = options.includedTags ? tags.filter(t => options.includedTags.includes(t.id)).map(t => t.attributes.name.en) : []
                                return (
                                    <View style={[styles.dropdownButtonStyle]}>
                                        <NormalText numberOfLines={1}>{tagList.length !== 0 ? tagList.join(", ") : 'None'}</NormalText>
                                        <AntDesign name={isOpened ? "caretup" : "caretdown"} size={18} color={COLORS.white} />
                                    </View>
                                );
                            }}
                            showsVerticalScrollIndicator={false}
                            dropdownStyle={{ ...styles.dropdownMenuStyle, height: 600, maxHeight: 600 }}
                            customContent={
                                <View style={{ width: '100%', paddingHorizontal: 12, paddingVertical: 8, gap: 20 }}>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                            <SemiBoldText style={{ fontSize: 16, marginRight: 10 }}>Format</SemiBoldText>
                                            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.white }} />
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                            {tags?.filter((obj) => obj.attributes.group === 'format').map((obj, index) => (<TagItem key={index} obj={obj} />))}
                                        </View>
                                    </View>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                            <SemiBoldText style={{ fontSize: 16, marginRight: 10 }}>Genre</SemiBoldText>
                                            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.white }} />
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                            {tags?.filter((obj) => obj.attributes.group === 'genre').map((obj, index) => (<TagItem key={index} obj={obj} />))}
                                        </View>
                                    </View>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                            <SemiBoldText style={{ fontSize: 16, marginRight: 10 }}>Theme</SemiBoldText>
                                            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.white }} />
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                            {tags?.filter((obj) => obj.attributes.group === 'theme').map((obj, index) => (<TagItem key={index} obj={obj} />))}
                                        </View>
                                    </View>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                            <SemiBoldText style={{ fontSize: 16, marginRight: 10 }}>Content</SemiBoldText>
                                            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.white }} />
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                            {tags?.filter((obj) => obj.attributes.group === 'content').map((obj, index) => (<TagItem key={index} obj={obj} />))}
                                        </View>
                                    </View>
                                </View>}
                        />
                    </View>
                    <View>
                        <NormalText>Content rating</NormalText>
                        <CustomDropdown data={contentRatingData} multiSelect={true} setValue={setOptions} value={options} queryKey='contentRating' />
                    </View>
                    <View>
                        <NormalText>Magazine Demographic</NormalText>
                        <CustomDropdown data={demographicData} multiSelect={true} setValue={setOptions} value={options} queryKey='publicationDemographic' />
                    </View>
                    <View>
                        <NormalText>Publication Status</NormalText>
                        <CustomDropdown data={publicationStatusData} multiSelect={true} setValue={setOptions} value={options} queryKey='status' />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: '100%',
        height: 40,
        backgroundColor: COLORS.gray2,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        overflow: 'hidden',
        justifyContent: 'space-between'
    },
    dropdownMenuStyle: {
        backgroundColor: COLORS.gray2,
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    tag: {
        backgroundColor: COLORS.gray,
        paddingHorizontal: 12,
        paddingVertical: 2,
        borderRadius: 5
    }
});
