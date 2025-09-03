import { HugeiconsIcon } from "@hugeicons/react-native";

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Home01Icon } from '@hugeicons/core-free-icons';

const Home = (props) => {
  return (
    <HugeiconsIcon
      icon={Home01Icon}
      size={24}
      color="#000000"
      strokeWidth={props.strokeWidth}
      stroke = "currentColor"
        {...props}
    />
  )
}

export default Home
const styles = StyleSheet.create({})