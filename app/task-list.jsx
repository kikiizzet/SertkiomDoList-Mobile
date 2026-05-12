import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Check, ChevronRight, Square } from 'lucide-react-native';
import { getTasks, toggleTaskStatus } from '../lib/database';
import { Colors } from '../constants/AppColors';

export default function TaskListScreen() {
  const [tasks, setTasks] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  const handleToggle = async (id, currentStatus) => {
    await toggleTaskStatus(id, currentStatus);
    loadTasks();
  };

  const renderItem = ({ item }) => {
    const isPenting = item.category === 'PENTING';
    const color = isPenting ? Colors.important : Colors.normal;

    return (
      <View style={styles.taskCard}>
        <TouchableOpacity 
          style={styles.checkbox} 
          onPress={() => handleToggle(item.id, item.is_completed)}
        >
          {item.is_completed === 1 ? (
            <View style={[styles.checkedBox, { backgroundColor: color }]}>
              <Check size={16} color={Colors.white} />
            </View>
          ) : (
            <View style={styles.emptyBox} />
          )}
        </TouchableOpacity>

        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, item.is_completed === 1 && styles.completedText]}>
            {item.title}
          </Text>
          <Text style={styles.taskDate}>
            {new Date(item.due_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} - {item.category}
            {item.is_completed === 1 && item.completed_at > item.due_date && (
              <Text style={{ color: Colors.important, fontWeight: 'bold' }}> - TERLAMBAT</Text>
            )}
          </Text>
        </View>

        <ChevronRight size={20} color={color} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listPadding}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada tugas.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listPadding: {
    padding: 15,
  },
  taskCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    marginRight: 15,
  },
  emptyBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.lightGray,
  },
  checkedBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  taskDate: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.gray,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 16,
  },
});
