import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import PropTypes from 'prop-types';

const PieComponent = ({ pieData }) => {
  if (!pieData || !Array.isArray(pieData) || pieData.length === 0) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Text>No data available</Text>
      </View>
    );
  }

  const renderDot = color => (
    <View
      style={{
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
  );

  const renderLegendComponent = () => (
    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
      {pieData.map((section, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          {renderDot(section.gradientCenterColor)}
          <Text style={{ color: 'white' }}>{`${section.label}: ${section.value}%`}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={{ paddingVertical: 10 }}>
      <View style={{ margin: 20, padding: 16, borderRadius: 20, backgroundColor: '#232B5D' }}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Classification Chart</Text>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <PieChart
            data={pieData}
            donut
            showGradient
            sectionAutoFocus
            radius={90}
            innerRadius={60}
            innerCircleColor={'#232B5D'}
            centerLabelComponent={() => (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
                  {pieData.find(d => d.focused)?.value || 'N/A'}%
                </Text>
                <Text style={{ fontSize: 14, color: 'white' }}>
                  {pieData.find(d => d.focused)?.label || 'N/A'}
                </Text>
              </View>
            )}
          />
        </View>
        {renderLegendComponent()}
      </View>
    </View>
  );
};

PieComponent.propTypes = {
  pieData: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      gradientCenterColor: PropTypes.string,
      focused: PropTypes.bool,
      label: PropTypes.string
    })
  ).isRequired,
};

export default PieComponent;
