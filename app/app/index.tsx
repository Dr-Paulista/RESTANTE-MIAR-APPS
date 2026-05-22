import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Message = {
  role: 'user' | 'assistant';
  text: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function HomeScreen() {
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'MIAR APPS iniciada. Eu sou uma IA de apoio. Diga o que você quer fazer agora.',
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    setInput('');
    setMessages((current) => [...current, { role: 'user', text }]);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: data.reply || 'Não consegui responder agora.' },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: 'Backend não respondeu. O app abriu, mas falta ligar o servidor ou configurar a URL da API.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!started) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.hero}>
          <View style={styles.pulse} />
          <Text style={styles.title}>MIAR APPS</Text>
          <Text style={styles.subtitle}>Facilitador de vida</Text>
          <Text style={styles.body}>
            Apresentação inicial. Depois entra login, memória, voz, câmera, arquivos e permissões.
          </Text>
          <Pressable style={styles.button} onPress={() => setStarted(true)}>
            <Text style={styles.buttonText}>Entrar no chat</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.chatRoot}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MIAR APPS</Text>
          <Text style={styles.headerSub}>Chat base funcional</Text>
        </View>

        <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent}>
          {messages.map((message, index) => (
            <View
              key={`${message.role}-${index}`}
              style={[styles.bubble, message.role === 'user' ? styles.userBubble : styles.aiBubble]}
            >
              <Text style={styles.bubbleLabel}>{message.role === 'user' ? 'Você' : 'MIAR'}</Text>
              <Text style={styles.bubbleText}>{message.text}</Text>
            </View>
          ))}
          {loading ? <Text style={styles.loading}>Respondendo...</Text> : null}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Digite aqui"
            placeholderTextColor="#94a3b8"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <Pressable style={[styles.sendButton, !canSend && styles.disabled]} onPress={sendMessage}>
            <Text style={styles.sendText}>Enviar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  pulse: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#22d3ee',
    opacity: 0.9,
    marginBottom: 28,
  },
  title: {
    color: '#f8fafc',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#67e8f9',
    fontSize: 18,
    marginTop: 8,
    fontWeight: '600',
  },
  body: {
    color: '#cbd5e1',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 22,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#0891b2',
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingVertical: 16,
    marginTop: 34,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  chatRoot: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
  },
  headerSub: {
    color: '#94a3b8',
    marginTop: 4,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  bubble: {
    borderRadius: 18,
    padding: 14,
    maxWidth: '88%',
  },
  aiBubble: {
    backgroundColor: '#0f172a',
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#164e63',
    alignSelf: 'flex-end',
  },
  bubbleLabel: {
    color: '#67e8f9',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  bubbleText: {
    color: '#f8fafc',
    fontSize: 16,
    lineHeight: 22,
  },
  loading: {
    color: '#94a3b8',
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sendButton: {
    backgroundColor: '#0891b2',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  disabled: {
    opacity: 0.45,
  },
  sendText: {
    color: '#ffffff',
    fontWeight: '800',
  },
});
