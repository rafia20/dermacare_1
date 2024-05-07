import React from 'react';
import { Card, Button, Text } from 'react-native-paper';

const DiseaseInformation = ({ disease, image }) => {
    console.log(disease)
    return (
        <Card>
            <Card.Title focusable style={{}} title={disease} />
            <Card.Content>
                <Card.Cover source={{ uri: image }} /> 
                
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => console.log('Ask Questions')}>Ask Questions</Button>
                <Button onPress={() => console.log('View Symptoms')}>View Symptoms</Button>
            </Card.Actions>
        </Card>
    );
}

export default DiseaseInformation;
