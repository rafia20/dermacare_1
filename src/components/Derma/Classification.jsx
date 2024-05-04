import React from 'react';
import { View, Text, Image, Button } from 'react-native';
import GeneralHeader from '../GeneralHeader';



export default Classification = ({route, navigation}) => {
    
    const { image } = route.params;
    const classify = async () => {
        const formData = new FormData();
        formData.append('file', {
            uri: image,
            name: `photo.jpg`,
            type: `image/jpeg`
        });
        try {
            const response = await fetch('https://kitten-tight-optionally.ngrok-free.app/classify', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'responseType': 'json',
                },
            });
            // if (!response.ok) {
            //     console.log(response)
            //     throw new Error('Network response was not ok' + response);
            // }
            console.log(await response.json());

            // const content = await response.json();
            // console.log(content);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    return (
        
        <View>
            <GeneralHeader title="Classification" />

            <Text>Classification</Text>
            <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
            <Button title="Classify" onPress={classify} />
            
        </View>
    )
}
// Compare this snippet from src/screens/Chat.jsx:
// import React from 'react';
