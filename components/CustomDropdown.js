import React from 'react'
import { SelectDropdown } from './Dropdown'
import { StyleSheet, View } from 'react-native'
import { NormalText } from './NormalText'
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../constants';

export default function CustomDropdown({ data, multiSelect = false, setValue, queryKey, value }) {

    /// tao ham remove key de remove key khi ma selectedItem empty // hoac tao nhieu state cho nhieu option cua query
    const removeKey = (key) => {
        setValue(prev => {
            const { [key]: _, ...rest } = prev;
            return rest;
        });
    }

    const defaultValue = multiSelect ? (value[queryKey] ? data.filter((d) => value[queryKey].includes(d.value)) : null)
        : (value[queryKey] ? data.find(d => d.value == value[queryKey]) : null)
    return (
        <SelectDropdown
            multipleSelect={multiSelect}
            defaultValue={defaultValue}
            data={data}
            onSelect={(selectedItem, index) => {
                console.log("selectedItem: ", selectedItem)
                if (selectedItem.length !== 0) {
                    if (multiSelect) {
                        setValue(prev => ({ ...prev, [queryKey]: selectedItem.map(obj => obj.value) }))
                    } else {
                        setValue(prev => ({ ...prev, [queryKey]: selectedItem.value }))
                    }
                } else {
                    removeKey(queryKey)
                }
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
                        <NormalText numberOfLines={1}>{titlesString}</NormalText>
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
    )
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
    }
});
