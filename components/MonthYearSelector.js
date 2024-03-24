import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const MonthYearSelector = ({ selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const years = generateYearsArray();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const handleMonthSelected = (itemValue) => {
        onMonthChange(itemValue);
    };

    const handleYearSelected = (itemValue) => {
        onYearChange(itemValue);
    };

    return (
        <View style={styles.container}>
            <Picker
                style={styles.picker}
                selectedValue={selectedMonth}
                onValueChange={handleMonthSelected}
            >
                {months.map((month, index) => (
                    <Picker.Item key={index} value={index + 1} label={month} color={currentMonth === index + 1 ? 'blue' : 'black'} />
                ))}
            </Picker>
            <Picker
                style={styles.picker}
                selectedValue={selectedYear}
                onValueChange={handleYearSelected}
            >
                {years.map((year) => (
                    <Picker.Item key={year} value={year} label={`${year}`} color={currentYear === year ? 'blue' : 'black'} />
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    picker: {
        flex: 1,
    },
});

function generateYearsArray() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 2020; i <= currentYear; i++) {
        years.push(i);
    }
    return years;
}

export default MonthYearSelector;
