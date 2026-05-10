import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';
import { getPassword, updatePassword } from '../lib/database';
import { Colors } from '../constants/AppColors';

export default function SettingsScreen() {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const router = useRouter();

  const handleUpdatePassword = async () => {
    const savedPass = await getPassword();
    
    if (currentPass !== savedPass) {
      Alert.alert('Gagal', 'Password saat ini salah');
      return;
    }

    if (!newPass) {
      Alert.alert('Gagal', 'Password baru tidak boleh kosong');
      return;
    }

    await updatePassword(newPass);
    Alert.alert('Sukses', 'Password berhasil diubah');
    setCurrentPass('');
    setNewPass('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GANTI PASSWORD</Text>
        <View style={styles.card}>
          <Text style={styles.label}>PASSWORD SAAT INI</Text>
          <TextInput
            style={styles.input}
            placeholder="****"
            value={currentPass}
            onChangeText={setCurrentPass}
            secureTextEntry
          />

          <Text style={styles.label}>PASSWORD BARU</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            value={newPass}
            onChangeText={setNewPass}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
            <Text style={styles.buttonText}>SIMPAN PASSWORD</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DEVELOPER</Text>
        <View style={styles.developerCard}>
          <View style={styles.avatarContainer}>
            <User size={40} color={Colors.gray} />
          </View>
          <View style={styles.devInfo}>
            <Text style={styles.devName}>Nama Mahasiswa: Muhammad Syauqi Izzet Sakovic</Text>
            <Text style={styles.devNim}>NIM: 254107067004</Text>
            <Text style={styles.devBadge}>DEVELOPER APLIKASI</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={() => router.replace('/')}
      >
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.gray,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.gray,
    marginBottom: 5,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  developerCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  devInfo: {
    flex: 1,
  },
  devName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  devNim: {
    fontSize: 14,
    color: Colors.gray,
  },
  devBadge: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  logoutButton: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  logoutText: {
    color: Colors.important,
    fontWeight: 'bold',
  }
});
