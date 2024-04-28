import React, { useState } from 'react';
import { SafeAreaView, FlatList, Platform } from 'react-native';
import PatientReportCard from '../PatientReportCard';
import SearchBar from '../SearchBar';


const Home = () => {
    const [patients, setPatients] = useState([
        {
            id: '1',
            name: "John Doe",
            age: 45,
            imageUrl: "https://via.placeholder.com/150",
            summary: "John has been experiencing mild symptoms and requires routine check-ups.",
            status: "Stable"
        },
        {
            id: '2',
            name: "Jane Smith",
            age: 37,
            imageUrl: "https://via.placeholder.com/150",
            summary: "Jane requires medication adjustments and a follow-up in three weeks.",
            status: "Monitoring"
        },
        {
            id: '3',
            name: "Emily Clark",
            age: 29,
            imageUrl: "https://via.placeholder.com/150",
            summary: "Emily is scheduled for a surgical procedure next month.",
            status: "Pre-Op"
        },
    ]);
    const [filteredPatients, setFilteredPatients] = useState(patients);

    const handleSearch = (query) => {
        if (query.trim()) {
            const filteredData = patients.filter(
                patient => patient.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPatients(filteredData);
        } else {
            setFilteredPatients(patients);
        }
    };

    const renderPatient = ({ item }) => <PatientReportCard patient={item} />;

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <SearchBar onSearch={handleSearch} />
            <FlatList
                data={filteredPatients}
                renderItem={renderPatient}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16, paddingTop: Platform.OS === 'android' ? 25 : 0 }}
            />
        </SafeAreaView>
    );
};

export default Home;
