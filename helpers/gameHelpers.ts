import * as FileSystem from 'expo-file-system';

/**
 * Ensures a folder for the given gameName exists in FileSystem.documentDirectory.
 * @param gameName The name of the game/folder to create.
 * @returns The full path to the created/existing folder.
 */
export async function ensureGameFolder(gameName: string): Promise<string> {
  console.log("start", gameName);
  const folderPath = FileSystem.documentDirectory + gameName + '/';
  const folderInfo = await FileSystem.getInfoAsync(folderPath);
  if (!folderInfo.exists) {
    console.log("Creating folder:", folderPath);
    await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
  }
  return folderPath;
}
