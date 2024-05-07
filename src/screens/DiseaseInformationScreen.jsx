import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Searchbar, Card, Button, Text, Divider } from 'react-native-paper';


import DiseaseInformation from "../components/Patient/DiseaseInformation";
import GeneralHeader from '../components/GeneralHeader';

const dummyDiseases = [
    { id: 1, name: 'Diabetes', image: 'https://example.com/diabetes.jpg' },
    { id: 2, name: 'Hypertension', image: 'https://example.com/hypertension.jpg' },
    { id: 3, name: 'Common Cold', image: 'https://example.com/commoncold.jpg' }
];


const DiseaseInformationScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDiseases, setFilteredDiseases] = useState(dummyDiseases);

    const onChangeSearch = query => {
        setSearchQuery(query);
        if (query) {
            const filtered = dummyDiseases.filter(disease => disease.name.toLowerCase().includes(query.toLowerCase()));
            setFilteredDiseases(filtered);
        } else {
            setFilteredDiseases(dummyDiseases);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <GeneralHeader title="Disease Information" />
            <Searchbar
                mode='view'
                placeholder="Search Diseases"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />
            <Text />
            {filteredDiseases.length === 0 && <Text>No diseases found</Text>}
            <ScrollView style={{margin: 4, marginHorizontal: 20}}>
                {filteredDiseases.map(disease => (
                    <View>
                        <DiseaseInformation key={disease.id} disease={disease.name} image={disease.image} />
                        <Text />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default DiseaseInformationScreen;
