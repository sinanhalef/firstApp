import { Stack } from 'expo-router'

const _layout = () => {
  return (
      <Stack 
        screenOptions= {{
            headerShown: false,
            animation: "fade",   // 👈 options: 'default','none','fade',
                                         // 'slide_from_right','slide_from_left',
                                         // 'slide_from_bottom','simple_push','flip'
          gestureEnabled: true,            
        }}
        
      >

        <Stack.Screen name="my_games" options={{ animation: "fade" }}/>
      </Stack>

  )
}

export default _layout