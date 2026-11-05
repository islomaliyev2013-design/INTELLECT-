import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NeuroQuiz Global</Text>
        </View>

        <Text style={styles.title}>Mobil Viktorina Platformasi</Text>
        <Text style={styles.desc}>
          Dasturlash, Rus tili, Ingliz tili va Matematika bo'yicha global viktorina platformasi.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📱 To'liq ilovani telefoningizda ochish:</Text>
          <Text style={styles.cardText}>
            Telefoningiz brauzeri (Chrome yoki Safari)da quyidagi manzilni oching:
          </Text>
          <View style={styles.urlBox}>
            <Text style={styles.urlText}>http://192.168.0.9:5173</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 16,
  },
  badgeText: {
    color: '#4F46E5',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  desc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 320,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  urlBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    alignItems: 'center',
  },
  urlText: {
    color: '#4338CA',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

