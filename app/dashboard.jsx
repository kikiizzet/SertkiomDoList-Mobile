import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { PlusSquare, List, Settings, CheckCircle2, Clock } from 'lucide-react-native';
import { getSummary } from '../lib/database';
import { Colors } from '../constants/AppColors';

export default function DashboardScreen() {
  const [summary, setSummary] = useState({
    totalSelesai: 0,
    totalBelum: 0,
    totalPenting: 0,
    totalBiasa: 0,
  });
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const data = await getSummary();
    setSummary(data);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Beranda</Text>
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Halo, User! 👋</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>TUGAS SELESAI</Text>
            <Text style={[styles.summaryValue, { color: Colors.normal }]}>{summary.totalSelesai}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>BELUM SELESAI</Text>
            <Text style={[styles.summaryValue, { color: Colors.important }]}>{summary.totalBelum}</Text>
          </View>
        </View>

        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartTitle}>AGENDA MINGGU INI (BERDASARKAN DEADLINE)</Text>
          <View style={styles.chartBarContainer}>
            {summary.dailyStats && summary.dailyStats.length > 0 ? (
              summary.dailyStats.map((stat, i) => {
                const maxCount = Math.max(...summary.dailyStats.map(s => s.count), 1);
                const height = stat.count > 0 ? Math.max((stat.count / maxCount) * 100, 10) : 0;
                
                // Color logic
                let barColor = '#E5E7EB'; // Default gray for no tasks
                if (stat.count > 0) {
                  if (stat.completedCount === stat.count) {
                    // All completed
                    barColor = stat.lateCount > 0 ? Colors.important : Colors.primary;
                  } else {
                    // Some pending
                    barColor = '#94A3B8'; 
                  }
                }
                
                const handlePress = () => {
                  if (stat.count > 0) {
                    Alert.alert(
                      `Agenda ${stat.day}`,
                      `Total Tugas: ${stat.count}\nSelesai: ${stat.completedCount}\nTerlambat: ${stat.lateCount}\nBelum Selesai: ${stat.count - stat.completedCount}`
                    );
                  }
                };

                return (
                  <TouchableOpacity 
                    key={i} 
                    style={styles.chartCol} 
                    onPress={handlePress}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.chartBar, 
                      { height: height, backgroundColor: barColor },
                      stat.isToday && { borderWidth: 2, borderColor: Colors.text }
                    ]} />
                    <Text style={[styles.chartDayLabel, stat.isToday && { fontWeight: 'bold', color: Colors.text }]}>
                      {stat.day}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.emptyChartText}>Belum ada data tugas</Text>
            )}
          </View>
        </View>

        <View style={styles.menuGrid}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/add-important')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
              <PlusSquare color={Colors.important} size={30} />
            </View>
            <Text style={styles.menuLabel}>Tambah Tugas Penting</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/add-normal')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
              <PlusSquare color={Colors.normal} size={30} />
            </View>
            <Text style={styles.menuLabel}>Tambah Tugas Biasa</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/task-list')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2FE' }]}>
              <List color="#0284C7" size={30} />
            </View>
            <Text style={styles.menuLabel}>Daftar Tugas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/settings')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#F3F4F6' }]}>
              <Settings color={Colors.gray} size={30} />
            </View>
            <Text style={styles.menuLabel}>Pengaturan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeContainer: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  dateText: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.gray,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartPlaceholder: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.gray,
    marginBottom: 15,
  },
  chartBarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    paddingHorizontal: 5,
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 15,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    opacity: 0.8,
    marginBottom: 8,
  },
  chartDayLabel: {
    fontSize: 10,
    color: Colors.gray,
    textAlign: 'center',
  },
  emptyChartText: {
    flex: 1,
    textAlign: 'center',
    color: Colors.gray,
    fontSize: 12,
    paddingVertical: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  menuItem: {
    width: '50%',
    padding: 10,
    alignItems: 'center',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.text,
    fontWeight: '500',
  },
});
