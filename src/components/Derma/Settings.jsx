import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Avatar, List, Button, Divider } from "react-native-paper";


const Settings = () => {
const navigation = useNavigation()
    const userData = {
    name: "John Doe",
    email: "johndoe@example.com",
    avatarUrl: "https://via.placeholder.com/150", // Placeholder for an avatar image
  };

  const handleLogout = () => {
    console.log("Logout action triggered");
    navigation.navigate('Login')
    // Implement your logout logic here
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Avatar.Image
          size={100}
          source={{ uri: userData.avatarUrl }}
          style={styles.avatar}
        />
        <List.Subheader style={styles.username}>{userData.name}</List.Subheader>
      </View>
      <Divider />
      <List.Section>
        <List.Subheader>User Settings</List.Subheader>
        <List.Item
          title="Username"
          description={userData.name}
          left={(props) => <List.Icon {...props} icon="account-circle" />}
        />
        <List.Item
          title="Change Password"
          left={(props) => <List.Icon {...props} icon="lock-reset" />}
          onPress={() => console.log("Change Password Pressed")}
        />
        <List.Item
          title="Email"
          description={userData.email}
          left={(props) => <List.Icon {...props} icon="email" />}
        />
      </List.Section>
      <Divider />
      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <Button
       
         
          onPress={handleLogout}
          icon="logout"
          textColor="#0584fa" // Sets the background color of the button
         mode="elevated"
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 8,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    margin: 15,
  },
});

export default Settings;
