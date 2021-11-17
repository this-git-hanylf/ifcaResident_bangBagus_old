import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {useTheme} from '@config';
export default function EmptyImage(props) {
  const {colors} = useTheme();
  const {style, enableRTL, ...rest} = props;
  const layoutStyle = enableRTL ? styles.styleRTL : {};
  return (
    <View style={{marginBottom: 10, marginTop: 10}}>
      <View
        style={{
          borderColor: colors.primary,
          borderWidth: 1,
          width: 60,
          marginBottom: 10,
          alignSelf: 'center',
        }}>
        <Icon
          name="image"
          size={40}
          color={colors.primary}
          enableRTL={true}
          style={{alignSelf: 'center'}}
        />
      </View>
      <Text style={{alignSelf: 'center'}}>Oops! Your Gallery is Empty</Text>
    </View>
  );
}

EmptyImage.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  enableRTL: PropTypes.bool,
};

EmptyImage.defaultProps = {
  style: {},
  enableRTL: false,
};
