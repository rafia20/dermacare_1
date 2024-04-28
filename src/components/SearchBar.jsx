import React, { useState } from 'react';
import { View, TextInput } from 'react-native';


const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text) => {
    setSearchQuery(text);
    onSearch(text);
  };

  return (
    <View className="p-4">
      <TextInput
        className="bg-white border border-gray-300 rounded-lg p-2 text-lg"
        placeholder="Search patients..."
        value={searchQuery}
        onChangeText={handleSearch}
        clearButtonMode="while-editing" // iOS specific feature for an 'x' button
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

export default SearchBar;
