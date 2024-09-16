import { StyleSheet, Image} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFD1DC', dark: '#FFC1CC' }}
      headerImage={
        <Image
          source={require('@/assets/images/homeicon.png')}
          style={styles.homeIcon}
        />
      }>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Created By:</ThemedText>
      </ThemedView>

      <ThemedText>Hailey Maree Jaranilla</ThemedText>
      <ThemedText>Mariah Camille Orilla</ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  homeIcon: {
    height: 200,
    width: 200,
    bottom: 0,
    top: 70,
    left: 0,
    position: 'absolute',
  },
});
