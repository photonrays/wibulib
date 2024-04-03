import React, { useState } from 'react'
import { Dimensions, Pressable, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import Modal from "react-native-modal";
import { NormalText } from './NormalText';
import { COLORS } from '../constants';
import { FontAwesome6, Ionicons, AntDesign } from '@expo/vector-icons';
import { MangaContentRating, MangaPublicationDemographic, MangaPublicationStatus, Order } from '../api/static';
import { CustomDropdown, SelectDropdown } from './Dropdown'
import { BoldText } from './BoldText';
import { SemiBoldText } from './SemiBoldText';

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

export default function SearchFilter({ isVisible, setIsVisible, setOptions }) {
    const win = Dimensions.get('window')


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
                        <SelectDropdown
                            data={sortByData}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem)
                            }}
                            renderButton={(selectedItem, isOpened) => {
                                let titlesString
                                if (Array.isArray(selectedItem)) {
                                    const titles = selectedItem.map((item) => item.item.title)
                                    titlesString = titles.length == 0 ? "None" : titles.join(", ")
                                } else {
                                    titlesString = (selectedItem && selectedItem.title) || 'None'
                                }
                                return (
                                    <View style={[styles.dropdownButtonStyle]}>
                                        <NormalText>{titlesString}</NormalText>
                                        <AntDesign name={isOpened ? "caretup" : "caretdown"} size={18} color={COLORS.white} />
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (
                                    <View key={index} style={{ ...styles.dropdownItemStyle }}>
                                        <NormalText style={{ ...(isSelected && { color: COLORS.primary }) }}>{item.title}</NormalText>
                                    </View>
                                );
                            }}
                            showsVerticalScrollIndicator={false}
                            dropdownStyle={styles.dropdownMenuStyle}
                        />
                    </View>

                    <View>
                        <NormalText>Tags</NormalText>
                        <CustomDropdown
                            multipleSelect={true}
                            renderButton={(selectedItem, isOpened) => {
                                let titlesString
                                if (Array.isArray(selectedItem)) {
                                    const titles = selectedItem.map((item) => item.item.title)
                                    titlesString = titles.length == 0 ? "None" : titles.join(", ")
                                } else {
                                    titlesString = (selectedItem && selectedItem.title) || 'None'
                                }
                                return (
                                    <View style={[styles.dropdownButtonStyle]}>
                                        <NormalText>{titlesString}</NormalText>
                                        <AntDesign name={isOpened ? "caretup" : "caretdown"} size={18} color={COLORS.white} />
                                    </View>
                                );
                            }}
                            showsVerticalScrollIndicator={false}
                            dropdownStyle={{ ...styles.dropdownMenuStyle, height: 400 }}
                            customContent={
                                <View style={{ width: '100%', paddingHorizontal: 12, paddingVertical: 8, gap: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <SemiBoldText style={{ fontSize: 16, marginRight: 10 }}>Format</SemiBoldText>
                                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.white }} />
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                        <View style={styles.tag}>
                                            <NormalText>4-Koma</NormalText>
                                        </View>
                                        <View style={styles.tag}>
                                            <NormalText>4-Koma</NormalText>
                                        </View>
                                        <View style={styles.tag}>
                                            <NormalText>4-Koma</NormalText>
                                        </View>
                                        <View style={styles.tag}>
                                            <NormalText>4-Koma</NormalText>
                                        </View>
                                        <View style={styles.tag}>
                                            <NormalText>4-Koma</NormalText>
                                        </View>
                                        <View style={styles.tag}>
                                            <NormalText>4-Koma</NormalText>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <SemiBoldText style={{ fontSize: 16, marginRight: 10 }}>Format</SemiBoldText>
                                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.white }} />
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                        <View style={styles.tag}>
                                            <NormalText>4-Koma</NormalText>
                                        </View>
                                        <View style={styles.tag}>
                                            <NormalText>4-Koma</NormalText>
                                        </View>
                                        <View style={styles.tag}>
                                            <NormalText>4-Koma</NormalText>
                                        </View>
                                        <View style={styles.tag}>
                                            <NormalText>4-Koma</NormalText>
                                        </View>
                                        <View style={styles.tag}>
                                            <NormalText>4-Koma</NormalText>
                                        </View>
                                        <View style={styles.tag}>
                                            <NormalText>4-Koma</NormalText>
                                        </View>
                                    </View>
                                </View>}
                        />
                    </View>

                    <View>
                        <NormalText>Content rating</NormalText>
                        <SelectDropdown
                            multipleSelect={true}
                            data={contentRatingData}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem)
                            }}
                            renderButton={(selectedItem, isOpened) => {
                                let titlesString
                                if (Array.isArray(selectedItem)) {
                                    const titles = selectedItem.map((item) => item.item.title)
                                    titlesString = titles.length == 0 ? "None" : titles.join(", ")
                                } else {
                                    titlesString = (selectedItem && selectedItem.title) || 'None'
                                }
                                return (
                                    <View style={[styles.dropdownButtonStyle]}>
                                        <NormalText>{titlesString}</NormalText>
                                        <AntDesign name={isOpened ? "caretup" : "caretdown"} size={18} color={COLORS.white} />
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (
                                    <View key={index} style={{ ...styles.dropdownItemStyle }}>
                                        <NormalText style={{ ...(isSelected && { color: COLORS.primary }) }}>{item.title}</NormalText>
                                    </View>
                                );
                            }}
                            showsVerticalScrollIndicator={false}
                            dropdownStyle={styles.dropdownMenuStyle}
                        />
                    </View>

                    <View>
                        <NormalText>Magazine Demographic</NormalText>
                        <SelectDropdown
                            multipleSelect={true}
                            data={demographicData}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem)
                            }}
                            renderButton={(selectedItem, isOpened) => {
                                let titlesString
                                if (Array.isArray(selectedItem)) {
                                    const titles = selectedItem.map((item) => item.item.title)
                                    titlesString = titles.length == 0 ? "None" : titles.join(", ")
                                } else {
                                    titlesString = (selectedItem && selectedItem.title) || 'None'
                                }
                                return (
                                    <View style={[styles.dropdownButtonStyle]}>
                                        <NormalText>{titlesString}</NormalText>
                                        <AntDesign name={isOpened ? "caretup" : "caretdown"} size={18} color={COLORS.white} />
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (
                                    <View key={index} style={{ ...styles.dropdownItemStyle }}>
                                        <NormalText style={{ ...(isSelected && { color: COLORS.primary }) }}>{item.title}</NormalText>
                                    </View>
                                );
                            }}
                            showsVerticalScrollIndicator={false}
                            dropdownStyle={styles.dropdownMenuStyle}
                        />
                    </View>

                    <View>
                        <NormalText>Publication Status</NormalText>
                        <SelectDropdown
                            multipleSelect={true}
                            data={publicationStatusData}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem)
                            }}
                            renderButton={(selectedItem, isOpened) => {
                                let titlesString
                                if (Array.isArray(selectedItem)) {
                                    const titles = selectedItem.map((item) => item.item.title)
                                    titlesString = titles.length == 0 ? "None" : titles.join(", ")
                                } else {
                                    titlesString = (selectedItem && selectedItem.title) || 'None'
                                }
                                return (
                                    <View style={[styles.dropdownButtonStyle]}>
                                        <NormalText>{titlesString}</NormalText>
                                        <AntDesign name={isOpened ? "caretup" : "caretdown"} size={18} color={COLORS.white} />
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (
                                    <View key={index} style={{ ...styles.dropdownItemStyle }}>
                                        <NormalText style={{ ...(isSelected && { color: COLORS.primary }) }}>{item.title}</NormalText>
                                    </View>
                                );
                            }}
                            showsVerticalScrollIndicator={false}
                            dropdownStyle={styles.dropdownMenuStyle}
                        />
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
