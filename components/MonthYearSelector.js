import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View } from 'react-native';

const MonthYearSelector = ({ selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
    // Implement your preferred UI for month-year selection here
    // Use a Picker for native UI or 3rd-party libraries for custom designs

    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const years = generateYearsArray();


    const handleMonthSelected = (itemValue) => {
        onMonthChange(itemValue);
    };

    const handleYearSelected = (itemValue) => {
        onYearChange(itemValue);
    };

    return (
        <View>
            <Picker
                selectedValue={selectedMonth}
                onValueChange={handleMonthSelected}
            >
                {months.map((month, index) => (
                    <Picker.Item key={index} value={index + 1} label={month} />
                ))}
            </Picker>
            <Picker
                selectedValue={selectedYear}
                onValueChange={handleYearSelected}
            >
                {years.map((year) => (
                    <Picker.Item key={year} value={year} label={`${year}`} />
                ))}
            </Picker>
        </View>
    );
};


function generateYearsArray() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 2020; i <= currentYear; i++) {
        years.push(i);
    }
    return years;
}

export default MonthYearSelector;