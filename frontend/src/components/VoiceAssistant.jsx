import React, { useState, useRef } from "react";
import axios from "axios";

function VoiceAssistant() {
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const keepListeningRef = useRef(false);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setResponse(
        "Voice recognition Chrome ya Edge browser me try karo."
      );
      return;
    }

    if (listening) {
      stopListening();
      return;
    }

    keepListeningRef.current = true;

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    // Hindi voice recognition
    recognition.lang = "hi-IN";

    // Continuous listening
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setResponse("🎙 Sun raha hoon... Bolo.");
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const text = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      if (interimText) {
        setCommand(interimText);
      }

      if (finalText) {
        setCommand(finalText);
        handleCommand(finalText);
      }
    };

    recognition.onerror = (event) => {
      console.log("Voice error:", event.error);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        keepListeningRef.current = false;
        setListening(false);

        setResponse(
          "🎤 Microphone permission allow karo."
        );
      } else if (event.error === "no-speech") {
        setResponse(
          "🎙 Awaaz nahi mili. Bolo..."
        );
      } else {
        console.log("Voice recognition error:", event.error);
      }
    };

    recognition.onend = () => {
      if (keepListeningRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (error) {
            console.log("Restart error:", error);
          }
        }, 300);
      } else {
        setListening(false);
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.log("Start error:", error);
      keepListeningRef.current = false;
      setListening(false);
    }
  };

  const stopListening = () => {
    keepListeningRef.current = false;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setListening(false);
    setResponse("Voice listening stopped.");
  };

  const handleCommand = async (text) => {
    if (!text.trim()) {
      return;
    }

    try {
      const result = await axios.post(
        "http://localhost:5000/api/ai/command",
        {
          command: text,
        }
      );

      const message =
        result.data.message ||
        result.data.response ||
        "Command completed.";

      setResponse(message);

      // Assistant voice
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        const speech =
          new SpeechSynthesisUtterance(message);

        speech.lang = "hi-IN";
        speech.rate = 0.9;

        window.speechSynthesis.speak(speech);
      }
    } catch (error) {
      console.log("AI command error:", error);

      setResponse(
        "Command process nahi ho paya."
      );
    }
  };

  const sendCommand = () => {
    if (!command.trim()) {
      alert("Pehle command bolo ya type karo.");
      return;
    }

    handleCommand(command);
  };

  return (
    <div className="voice-assistant">
      <h1>🎙 DukaanMitra Voice AI</h1>

      <p>
        Button dabao aur shop ke baare mein bolo.
      </p>

      <button onClick={startListening}>
        {listening
          ? "🛑 Stop Listening"
          : "🎤 Start Listening"}
      </button>

      <br />
      <br />

      <input
        type="text"
        placeholder="Example: Aaj kitna profit hua"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
      />

      <button onClick={sendCommand}>
        Send
      </button>

      {response && (
        <div className="assistant-response">
          <h3>Assistant:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default VoiceAssistant;