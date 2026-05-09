import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initDatabase } from '../lib/database';

export default function RootLayout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="add-important" options={{ 
        headerShown: true, 
        title: 'Tambah Tugas Penting',
        headerStyle: { backgroundColor: '#DC2626' },
        headerTintColor: '#fff'
      }} />
      <Stack.Screen name="add-normal" options={{ 
        headerShown: true, 
        title: 'Tambah Tugas Biasa',
        headerStyle: { backgroundColor: '#059669' },
        headerTintColor: '#fff'
      }} />
      <Stack.Screen name="task-list" options={{ 
        headerShown: true, 
        title: 'Daftar Tugas',
        headerStyle: { backgroundColor: '#0D9488' },
        headerTintColor: '#fff'
      }} />
      <Stack.Screen name="settings" options={{ 
        headerShown: true, 
        title: 'Pengaturan',
        headerStyle: { backgroundColor: '#0D9488' },
        headerTintColor: '#fff'
      }} />
    </Stack>
  );
}
