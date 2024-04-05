import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import { NormalText } from './NormalText';
import { BoldText } from './BoldText';

export default function Pagination({ currentPage, setCurrentPage, pageRange, totalPage }) {
    const changePage = (index) => {
        if (index !== currentPage) {
            setCurrentPage(index)
        }
    }

    const decreasePage = () => {
        if (currentPage !== 1) setCurrentPage(prev => prev - 1)
    }

    const increasePage = () => {
        if (currentPage !== totalPage) setCurrentPage(prev => prev + 1)
    }

    return (
        <View style={[styles.container, { width: '100%' }]}>
            <Pressable onPress={decreasePage} style={styles.button}>
                <AntDesign name="left" size={24} color={COLORS.white} />
            </Pressable>
            {!pageRange.includes(1) && (<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Pressable onPress={() => changePage(1)} style={styles.button}>
                    <NormalText>{1}</NormalText>
                </Pressable>
                <BoldText>. . .</BoldText>
            </View>)}
            {pageRange.map((item, index) => {
                return (
                    <Pressable
                        key={index}
                        onPress={() => changePage(item)}
                        style={[styles.button, { backgroundColor: item == currentPage ? COLORS.gray2 : COLORS.black }]}
                    >
                        <NormalText>{item}</NormalText>
                    </Pressable>)
            })}
            {!pageRange.includes(totalPage) && (<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <BoldText>. . .</BoldText>
                <Pressable onPress={() => changePage(totalPage)} style={styles.button}>
                    <NormalText>{totalPage}</NormalText>
                </Pressable>
            </View>)}
            <Pressable onPress={increasePage} style={styles.button}>
                <AntDesign name="right" size={24} color={COLORS.white} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingBottom: 10,
        flexWrap: 'wrap'
    },
    button: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingHorizontal: 15
    }
})