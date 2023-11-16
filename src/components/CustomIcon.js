import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from '../../selection.json';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react'

const CustomIcon = ({name, size, color}) => {
  return (
    <Icon name={name} size={size} color={color} />
  )
}

export default CustomIcon

//export default createIconSetFromIcoMoon(icoMoonConfig);