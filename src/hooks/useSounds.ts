import { useState, useEffect, useRef } from 'react';
import Sound from 'react-native-sound';

// Enable playback in silence mode (iOS)
Sound.setCategory('Playback');

interface SoundInstances {
  [key: string]: Sound | null;
}

export function useSounds() {
  const [soundsEnabled, setSoundsEnabled] = useState<boolean>(true);
  const soundInstancesRef = useRef<SoundInstances>({});

  useEffect(() => {
    // Use filename-based loading instead of require() statements
    const soundFiles = {
      buttonClick: 'button_click.mp3',
      cardFlip: 'card_flip.mp3',
      cardDeal: 'card_deal.mp3',
      gameWin: 'game_win.mp3',
      gameLose: 'game_lose.mp3',
      cardSelect: 'card_select.mp3',
    };

    Object.entries(soundFiles).forEach(([soundKey, fileName]) => {
      try {
        soundInstancesRef.current[soundKey] = new Sound(
          fileName,
          Sound.MAIN_BUNDLE, // This tells Sound to look in the app bundle
          (error: string | null) => {
            if (error) {
              console.log(`❌ Failed to load ${soundKey}:`, error);
              soundInstancesRef.current[soundKey] = null;
            } else {
              console.log(`✅ Successfully loaded ${soundKey}`);
            }
          }
        );
      } catch (error) {
        console.error(`❌ Error creating Sound instance for ${soundKey}:`, error);
        soundInstancesRef.current[soundKey] = null;
      }
    });

    // Cleanup function
    return () => {
      Object.values(soundInstancesRef.current).forEach(sound => {
        if (sound) {
          sound.release();
        }
      });
    };
  }, []);

  const playSound = (soundName: string, volume: number = 1.0): void => {
    if (!soundsEnabled) {
      console.log(`🔇 Sounds disabled - would play ${soundName}`);
      return;
    }
    
    const sound = soundInstancesRef.current[soundName];
    if (sound) {
      try {
        sound.setVolume(volume);
        sound.stop(() => {
          sound.play((success: boolean) => {
            if (success) {
              console.log(`🔊 Playing ${soundName} successfully`);
            } else {
              console.log(`❌ Failed to play ${soundName}`);
            }
          });
        });
      } catch (error) {
        console.error(`❌ Error playing ${soundName}:`, error);
      }
    } else {
      console.log(`⚠️ Sound ${soundName} not available (failed to load)`);
    }
  };

  const playButtonClick = (): void => playSound('buttonClick', 0.6);
  const playCardFlip = (): void => playSound('cardFlip', 0.8);
  const playCardDeal = (): void => playSound('cardDeal', 0.5);
  const playGameWin = (): void => playSound('gameWin', 0.9);
  const playGameLose = (): void => playSound('gameLose', 0.9);
  const playCardSelect = (): void => playSound('cardSelect', 0.7);

  return {
    soundsEnabled,
    setSoundsEnabled,
    playButtonClick,
    playCardFlip,
    playCardDeal,
    playGameWin,
    playGameLose,
    playCardSelect,
  };
}
