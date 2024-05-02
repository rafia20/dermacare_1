import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Platform, RefreshControl } from 'react-native';
import PatientReportCard from '../PatientReportCard';
import SearchBar from '../SearchBar';
import { get, ref } from 'firebase/database';
import { auth, db } from '../../Connection/DB';
import { getAuth } from 'firebase/auth';


const Home = () => {
    const [patients, setPatients] = useState([]);
    const [patientsData, setPatientsData] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setRefreshing(true);
        setPatientsData([]);
        get(ref(db, 'patients')).then((snapshot) => {  
            if (snapshot.exists()) {
                const data = Object.keys(snapshot.val());
                console.log(Object.keys(snapshot.val()));
                
                for (let i = 0; i < data.length; i++) {
                    if (snapshot.val()[data[i]].profile){
                        
                        const profile = snapshot.val()[data[i]].profile;
                        profile['id'] = data[i];

                        console.log(profile);
                        patientsData.push(snapshot.val()[data[i]].profile);
                    }
                }
                setFilteredPatients(patientsData);
                setPatients(patientsData);
                console.log(patientsData)
            } else {
                console.log('No data available');
            }
            setRefreshing(false);
        }).catch((error) => {
            console.error(error);
            setRefreshing(false);
        });
    };

    const handleSearch = (query) => {
        // console.log(query.trim())
        if (query === "") {
            setFilteredPatients(patients);
            return;
        }

        // console.log(patients);
        console.log(query);
        if (query.trim() && query.trim() != "") {
            
            const filteredData = patients.filter(
                
                patient => patient.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPatients(filteredData);
        } 
    };

    const renderPatient = ({ item }) => <PatientReportCard patient={item} />;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'gray' }}>
            <SearchBar onSearch={handleSearch} />
            <FlatList
                data={filteredPatients}
                renderItem={renderPatient}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16, paddingTop: Platform.OS === 'android' ? 25 : 0 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fetchData}
                    />
                }
            />
        </SafeAreaView>
    );
};

export default Home;
