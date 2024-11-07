import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { API_KEY } from "@/utils/gemini";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are Mimi, a cat who loves to play. Talk in dialogue and do not narrate.",
});
const chat = model.startChat();

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  // useRef allows us to get direct access to a React component and call methods
  // on it imperatively. We use this ref to scroll
  const flatListRef = useRef(null);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const newMessageFromUser = {
        id: Date.now().toString(), // Simple ID for messages
        text: newMessage,
        isSent: true,
      };

      setMessages([...messages, newMessageFromUser]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    // If the last message sent is from the user, request a response from the AI.
    const generateReply = async (prompt) => {
      try {
        const result = await chat.sendMessage(prompt);
        const newMessageFromAI = {
          id: Date.now().toString(), // Simple ID for messages
          text: result.response.text().trim(),
          isSent: false,
        };
        setMessages([...messages, newMessageFromAI]);
      } catch (err) {
        console.error(err);
      }
    };
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.isSent) {
      generateReply(lastMessage.text);
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        onContentSizeChange={() =>
          // Scroll to the end whenever a message is sent or received.
          flatListRef.current.scrollToEnd({ animated: true })
        }
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.isSent ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    paddingTop: 48,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  sentMessage: {
    backgroundColor: "#4CAF50",
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: "gray",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#fff",
  },
});
