import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, Image, TextInput, Button } from 'react-native';
import { RadioButton } from 'react-native-paper';

const FeedbackModal = ({ visible, onClose, imageDataFromBackend }) => {
  const [selectedValue, setSelectedValue] = useState('accept');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAKgAswMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAACBQYBB//EADcQAAEEAAQEBQEFCAMBAAAAAAEAAgMRBBIhMQUiQVEGEzJhcYEUQlKRoRUjYrHB4fDxcoLRFv/EABoBAAIDAQEAAAAAAAAAAAAAAAECAAQFAwb/xAAiEQACAgEFAQEBAQEAAAAAAAAAAQIREgMEITFBYVETIjL/2gAMAwEAAhEDEQA/AOty6hMxtoITQitOUb0qaRfbJLo3a1VrszNaa1upteTTZG2XZG9TVkrB4lj5ZajDXMjvRl8zvom4RFya03FYYDlYRpzE9gsjH+I2Ma50fpboHbBYeK8+WLy2jK1uvlNJ/UjdZzcHK6S5WiR7RTQRTW/RDImKNWTjs2JZYJo9dr9v8/usyfiFuyMt7ju7c37V/nuixcIxEoBdKADvVDRNw+GXO1zmjsXtIH86QtBp+GLLijGNZcrj9wakf+JGTHTF1Bxy9ab/AJa7RnhWJtF7G3000Rn+HcMGZWxto9a2+EMkg4/Tg38QkjFtziux3/8AEXB8fxUF5ZXNyuu3LocX4cjZpHZ5hfusufghia8jS9wOyDmmRRZt8N8S/aMvmW5zhlLh+S63CY0SAUQaoWF8ywmHdA4M2P3Wjou34Fmbhx+JLY1HWQPuvdAxPK8m6VMK4+W3MLKFxGUNiJIoDVG+AUDfxAR2HOH1WFxXxTHhxTMrnDosHjvE5ZZiGPys20XOywYnEOaGbG9Amj9Fn8Ool8VTSkHNlN1Y6hdd4T8StxcYgncHOBptdF8zh4Ti2tstqv1WlwmPG4LFsnZG4tabcA67H/H/ADqrWk4p8FTWjKUeT7PG7l02Vw5JcMnE+BglA9bAU4eZWyiXzKIeVRQhztUSvH0Rr090UgVqhOaKNfyWW2bCQnM9u1X9Uk6MuOuVo9m0T8905iAQDX80qC/okbHSPGYWIXoBff8A0riCNp0APwrij6lYZe9IWHE9ZFH1yu/5NGicga2M22Np9m6pVtXobHVMRGttuilhxGW6Ny3X8Kq+MOYczbHdeteK1XvntP0QZEjNxMAyZWigFlT4e27XS2cTKC6x0SM40zpaGaoxZ4QZBy0R1W9wxrfKGVuUdglWMLyCBa1sGwMNgV3UXYX0OxN5e3uErxZrfsT8zdK/JPwNzs12O6zePNc2GNjfQ51FdPDn6cjFwoSvzy8xvT2C28Dw2JhByj5PRWjbzey0sO0WLStjUT7BEWk5W69aQ8NgHfamFkgBv8PutEuAGnRO8OaKe8+y77dXNFbdcQGsJC2HDxxM2YKHwi5l5Q3HVehaRlHtqKlKKEMd42CjYtD7o7W2ihuiy6NizNkwmZI4jC+Xqt/IDuLQpYGvHpH1SuI0ZHJy4trDTzVeyA7iUVHmH1ct3H8IjxEZzFzK6xlcrxDwthtxPO866ZjqlUTrkh9uPzADzAPjW0eHHHUB2av4dv1Xz3HcElw87fs2OxMbC8XUp0Hf86SWGZxp8rIjjsTTaFE2BZpP/O/RP6/D6m/GmhZI+G/3QzxMC8zj9Wr5sZuL4Z7h9rlMLXkOeR6T7q7+JcZYwNlxGbUaluhvZH+X0D1l+HeTcViBFEHvk1TEEjcVHUTg5p7dF85hnx8uIEOMxuJio7OjDQD8ZdQuy8OYaTBuz/aXywymsriDR+R/tJKGAY6mR0OEhOodsVq4WIA07cJTKCbcKuloYZoEgpRIFj7YwGaLD8TgtjgI/Ef5LoWBZvHIGyYcl2zTZ+E0kJF8nJwYpt12T7MW0ALjuLt4uDLicN5UUQeRHEWucQPofr9Vkft3jOHcGyx4d/y06/qlWm2dHqUfTmYthu+y3eCv83Bl/wDGf6L49/8AVY1rQRgoWPHclfRfCHiPB43BMw4cG4iP1MDSTffRW9vp4sqbrUjKHB1QXqoxzXtzN1B1tXCuGcWUVbUUIINRQht1RAs6jWJuvMtqysAlcQpi747Sk+DBGu/RamWwqOjSUNZyeJ4FG97nOFlyzn+HmsdmY3Uart3xWgOhSjpnHt4SWmQZfU6yrScJzRgOia4DbMBp3XVmJDdADuiNaOYi4TE31Nb7ABaOAwAiy5RVu2Wl9nHRORYblBUYrZRkQzOvojR0DojNZQUrVPRzDRnReTsE0LmO2doVGr19gWEfAHI4/hgfIY5BbemnVZv7GNktjaW/xartMXC1xLz9UkICw193olHTs5YeGsNiHDPCGdyxbvDuAcMgLCcIx7x94gXfyFosjHVNRxmtU0ZOLElFNMbhY1jA1npG2t0roUR1RAbJHdaMZZKzLnHF0XUVbrRREUx5sSYQMu5NJmORswDmmgNEjLUjKKNhqjYAFnemxSoeHzaK1LMdm0G6tDIx4JZspYtDYKmXMqMKJalEKFiDIz/fZNEob4tilaCmJ+VlN9+q8c3SqtNFv6KgN21KMCih0uqR+iq3Q12VnC2lEBUmkMTa0q4glkDnDcBJYCUTRB+RzXXrm3PuihlFNWag11Uc4kadEIODQLXuYEaa+yIiPBIC6unVUDABkO3RRzw02Rm916P3vMzlIQ+Ba9IYxGNBaYiHJdVaoy/vGyjN2QoUodCCi7gHuhv2Vo9G/Kubd/5op7lcpnqi98u1FZoq2YEeZwomj1RWks0JtKCXIb290ZszANNI+gWWbdDkcta/0RszI26fySDcocANjsislbI4mrrRGwOI+yQObYFosc2ezd0kW8wp7Tl7BMMLI2jZoGzR1UTFaHAbXjvi0Fr3FzS3ladwjl19KCYUG/ppSrkr6ojl5aV9hKBuoHc9UHmbJTtq0tHkPKgSupyRsZFcQ+mO/AsoTNDjkdSJjZzGHVsd1m4YGR7iQSDsov06xSNI4p5bzMpoV2Tk5fLFBTDwhzmtIA+E3HhwGmuiKYHSQRozNaO6KGispSgeGOoo5mGTRNaOTT8PdWmirtN6d0EyW0IgfzoAaL307L1Uc/mV2m9FY0HyVd0uCyi820UVqynRycjS4Eg0vYg5o3u0SNzXN5TfdeuAa03Vu0FrMNzPwI0nKbR8PLK0ex9knC2YauvNtrsmW5jo1uZ5/RQDNBj9P7q2a+3yeiUYWAhv581q4kaHFqNipDcTmZqFWeqYEhcHG600WQcfFHiSxzqJGg7pxjnP5ulDRSwyg+xxgcC7Mbs6KxSr5w1lDX2RGyWQO/3lLFxfZ640EpO7lKPK46gdPvJN9G6OU3such4owuKYoiXIOqNw2TKOb+yyeOskjeX3mAcdPZTBcQGVuZw+Sg5NI7pWjq/PA1Dq03rVc9xvxzwvhc32efE3MBqxjS4j8ktxbHYmTByRcPcPPeKae3uuSwXhF8ZMuNp5cbe49SpB3yzm40dnwvxZgOJ2MPKHSb5CcrvyW3BjQ5gpxp3dfNH8BwbJs7eSQbOaapdPwsTNYyPM6Sho67QaV8EaOsjlBdRN1+iZw7y9pd90+n4WFhpjiD5QJDRufxe3wtaEgCgdB90dE+VCY2MzAujIbvWnyjYZ5dGwu3rVLiiKKLhZA+Kx0cR+qs7fspbv/gYJ1UXlqK2UDj8DqCBunWPa8A1YGyVbGA4kIkmIbCzm2Wabb5YbJJJIGtIaOtndGokgMcQQebXdAwsnmt03O6MxzmtLVCdAxHIyQuzOBvRrjojlzjGS06dATslpGF+5r3RmxlsWnMe6A34Y0rGvx8ZkugTVd10sByMF1ddFlyYInLLGy5AdRmr/AGmJnTiaPyadF94dQkT5Os5ZJIYk1ma7a+t/om8waNdPaqWf+8fihYOQdSncwuner4REl0Rzy7Q3rpoqtBzgitddEV/Kzm67aJcwl+JY43oOiHoLFcfw1mJJzfKwJvDsbZNHEA6ml2PlAmySPnZDcObmDR2y7o0FTo5iHhIi9DSO1ps4Z7mBjt1uOa2roFAdC281jXoOihMzJfwqGRgOXNfRWjwfkZco0vdaZIHK1uYnp7Jflc4tfYcCCK6+yAHKwDGCGWx3WjHy6pMtzdCAXdU3ARkLTuCj2LYwCMhPUpmKNscbWt2CUw9+bqnG7K5tVwyhu5cpBF6hqK3ZSOWig8tz9bzaoeLw/msA7G0aUEatNEKpe5zLqj1WWbStMvC4RtaCaTAlaR6lg8QY+RoAu70pauDbTGk1mIF13QHaTVscblsa2mRlodlnzGtRuNkBuPcZA1u43KloMYZdGyGu/wCvReUR6Pqk2Plc9ul31TXmZdLvt8KMWi9j7ynntBvt8KgkBsFLiB1E3VndI2NFfo8HiQW1Xj9SUiYYxzG76orcRGXPYxzXOY6n1uPlBAdeDDjzKo9N9kPzC4ilQPPmaphSzhdmyPhCDTrnPwTuEV7bve+lJLEcQgw4yvcHO9uhQDGLfQ1EwtblLs1fiCSxmElkcHxuzi+bK7osrFcbJPKaA90ieOyRuzB2l6i0b+FiO3kdYWRshuZxFD1LyN7Swlhttbrl5uKTYl2Z7tCNQm+B43995d20pkc9TRxVnT4Y3Iz4TaUwbbFja9EzfMQruiv8GPuXc6LqLy14rFlazlJsR5bwaI/iAV4p85y66dSFSbmjLqv2VcI4SMcTynoFlG9XAdwo5q+vZAixpbM6EN2F2iZ2gFt28JWRjy4HqN9USRo0S8SRNIFEhAjgY15I9R3Q4ZSeQenpomLDaB36JWMm48IZjvSzVK5lp29obaDdDRO6qYc7gLtRgX0NHITLoLTbWnUk2hwx+WKTGwXNkbBuN6XVdUuzrreu9UiyO1CQnl8sl1WhYOxsyBhGZK4nieHw9ky69lyvHuMzYaQsa1z7/DsFzrn47HPGZ3ltNn1Wnimx4aakzruI+Kw9hZGar2XNz8VmkdbiC09zqpHwd3lZnTBxyXrevX+i08PwlhYCJARnANN1Auv62uqhZo6Wg0jFbipJCQc1HblKu0ylzQyLYg27RdD+ymMabltwJFV76fWqQm4Rsby6IAgd+vZNhRajop9sznuxzWudHD5rvUGAVp3W34cw+Ic0PxQAc/YB1/6XrJCC7y2mz3W7wwZsO2xTuqEujO32moco2MJpGfcphDhFRhECvaaqCR5nVdzZ6ovaXic5nKeoUqCQRHVRRZZuBczS0vUDGyj5UUUYQkULWx19FSVrI+c/d02UUQIWwknnj+6bwwIFBeqIMjHWZaVtDdKKJWABMOvZJyQiUEkWoolCgGIwMTvU0adwlHcOhrMImgDfl3UUTJs6Qk0yseFjDixsBr3KLlgDzH5ZZeunVRRHNotQ1JWCldFrlBPe0F0sAaNKJ91FEM2zutSVEw0fnTBrOvuuiwkTYmsa3bZRRdNPlozN3qyfBpjb9FZq9UWkujBfZZRRREB//9k=');

  useEffect(() => {
    // Assume imageDataFromBackend is an object containing image URL
    if (imageDataFromBackend && imageDataFromBackend.imageUrl) {
      setImageUrl(imageDataFromBackend.imageUrl);
    }
  }, [imageDataFromBackend]);

  const handleConfirm = () => {
    // Implement feedback submission logic here
    console.log('Selected Value:', selectedValue);
    console.log('Description:', description);
    console.log('Image URL:', imageUrl);

    // Close the modal
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Provide Feedback</Text>
          
          {/* Image Box */}
          <View style={styles.imageContainer}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholder}>No Image Selected</Text>
            )}
          </View>

          {/* Radio Buttons */}
          <RadioButton.Group onValueChange={newValue => setSelectedValue(newValue)} value={selectedValue}>
            <View style={styles.radioContainer}>
              <RadioButton.Item label="Accept" value="accept" />
              <RadioButton.Item label="Reject" value="reject" />
            </View>
          </RadioButton.Group>

          {/* Description Input */}
          <TextInput
            style={styles.descriptionInput}
            multiline
            placeholder="Enter feedback description..."
            value={description}
            onChangeText={text => setDescription(text)}
          />

          {/* Confirm Button */}
          <Button title="Confirm" onPress={handleConfirm} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  imagePlaceholder: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666666',
  },
  radioContainer: {
    marginBottom: 20,
  },
  descriptionInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default FeedbackModal;
