import React from 'react';
import { View } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';

const DiseaseInformation = ({ disease, image }) => {
    
    return (
        <Card>
            <View style={{backgroundColor: '#e5c3eb', borderRadius: 5}}>
                <Text style={{ marginLeft: 'auto', marginRight: 'auto', padding: 20, width:'auto', fontSize: 25 }} variant='titleMedium'> {disease} </Text>
            </View>
            <Text/>
            <Card.Content>
                <Card.Cover source={image} />

            </Card.Content>
            <Card.Actions>
                <Button icon={'chat-question-outline'} style={{width: '100%'}} mode='contained' onPress={() => console.log('Ask Questions')}>Ask Questions</Button>
            </Card.Actions>
        </Card>
    );
}

export default DiseaseInformation;
