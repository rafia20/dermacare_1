import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import GeneralHeader from '../GeneralHeader';
import PieComponent from '../PieChart';
import { useEffect } from 'react';
import { useState } from 'react';







export default Classification = ({ route, navigation }) => {
    const [data, setData] = useState([]);
    function mergeAndSortData(samplePieData, additionalData) {
        // Function to generate random colors
        function generateRandomColor() {
          return '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
      
        // Convert additionalData into the format used by samplePieData
        const convertedData = additionalData.map(item => {
          const label = Object.keys(item)[0];
          const value = item[label];
          return {
            value: parseFloat(value.toFixed(2)), // Ensure the value is a number with two decimal places
            label: label,
            color: generateRandomColor(), // Assign a random color
            gradientCenterColor: generateRandomColor() // Assign a random gradient center color
          };
        });
      
        // Merge and sort the data
        const combinedData = [...samplePieData, ...convertedData];
        combinedData.sort((a, b) => b.value - a.value);
        combinedData[0]['focused'] = true; // Focus on the first item   
        return combinedData;
      }



   

    const [flag, setFlag] = useState(false);
    // const [data, setData] = useState(pieData);
    // const updatedPieData = mergeAndSortData([], [{"acne": 12.918820977210999 }, {"dermatomyositis": 81.23594522476196}, {"pediculosis lids": 5.845235288143158}]);

    // console.log(updatedPieData);

    const { image } = route.params;
    useEffect(() => {
        classify();
    }, []);
    
    const classify = async () => {
        const formData = new FormData();
        formData.append('file', {
            uri: image,
            name: `photo.jpg`,
            type: `image/jpeg`
        });
        try {
            let response = await fetch('https://kitten-tight-optionally.ngrok-free.app/classify', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'responseType': 'json',
                },
            });

            let content = ''
            if (!response.ok) {
                response = [{'acne': 12.918820977210999}, {'dermatomyositis': 81.23594522476196}, {'pediculosis lids': 5.845235288143158}]
                
                console.log(response)
                content = response;
              
            }
            else {
                content = await response.json();
                setData(mergeAndSortData([], content));
            }
            console.log(content.length)
            
       
            setFlag(true);;

        } catch (error) {
            console.error('There was an error!', error);
        }
    };
   
    return (

        <View>
            <GeneralHeader title="Classification" />

            {flag && <PieComponent pieData={data} />}
            

        </View>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        margin: 10,
    },
})
// Compare this snippet from src/screens/Chat.jsx:
// import React from 'react';
