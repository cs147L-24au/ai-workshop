import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import gemini from "@/utils/gemini";

// TODO: Set up the model with appropriate system instructions.

const INITIAL_OPPONENT = "rock";

export default function GameApp() {
  const [opponent, setOpponent] = useState(INITIAL_OPPONENT);
  const [answer, setAnswer] = useState("paper");
  const [emoji, setEmoji] = useState("🪨");

  const [loaded, error] = useFonts({
    "Comic-Sans-MS": require("../assets/fonts/Comic-Sans-MS.ttf"),
  });

  useEffect(() => {
    const fetchEmoji = async () => {
      try {
        // TODO: Ask model to generate an emoji for the current `opponent`
        const result = "TODO";
        // Extract the emoji from the response using regex
        const emoji = result.response.text().match(/\p{Emoji}+/gu);
        // If there's no emoji in the response, then something probably went wrong.
        // Let's check the output from the model to see what it says.
        if (emoji == null || emoji.length === 0) {
          Alert.alert(result.response.text());
        }
        setEmoji(emoji);
      } catch (err) {
        console.error(err);
      }
    };
    if (opponent !== INITIAL_OPPONENT) {
      fetchEmoji();
    }
  }, [opponent]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const submitAnswer = async () => {
    // TODO: Ask the model to determine who wins and give an explanation.
    const result = "TODO";
    Alert.alert("Result", result.response.text().trim());
    setOpponent(answer.trim());
    setAnswer("");
  };

  const submitDisabled = answer.length === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>what beats</Text>
      <Text style={styles.opponent}>{opponent}?</Text>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={answer}
          onChangeText={setAnswer}
        />
        <TouchableOpacity
          style={[
            styles.button,
            submitDisabled ? styles.buttonDisabled : undefined,
          ]}
          onPress={submitAnswer}
          disabled={submitDisabled}
        >
          <Text style={styles.buttonText}>GO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 42,
    paddingBottom: 100,
    backgroundColor: "white",
  },
  title: {
    fontFamily: "Comic-Sans-MS",
    fontSize: 30,
  },
  opponent: {
    fontFamily: "Comic-Sans-MS",
    fontSize: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    fontFamily: "Comic-Sans-MS",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    flex: 1,
  },
  emoji: {
    fontSize: 100,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: "#AAAAAA",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Comic-Sans-MS",
  },
});
