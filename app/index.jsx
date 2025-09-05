import { View, Text, Button } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';
import {ensureGameFolder} from '../helpers/gameHelpers';

const index = () => {
  const router = useRouter();
  React.useEffect(() => {
    ensureGameFolder('spy');
    ensureGameFolder('id');
  }, []);
  
  return (
    <ScreenWrapper>
      <Text>index</Text>
      <Button title="welcome" onPress={() => router.push('my_games')} />
    </ScreenWrapper>
  )
}

export default index