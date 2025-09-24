import React, { useState, useEffect } from 'react';
function (AI EDUCATION) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Untuk animasi mengetik

  // Fungsi untuk mengirim pesan
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    // Menampilkan animasi mengetik
    setIsTyping(true);
    setTimeout(async () => {
      const response = await fetch("http://127.0.0.1:8000/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = { 
        text: data.response, 
        sender: "bot", 
        image: data.image || "https://via.placeholder.com/150", // Gambar default jika tidak ada
        video: data.video || null,  // Menambahkan video jika ada
        audio: data.audio || null,  // Menambahkan audio jika ada
        isTyping: false,
      };
      setMessages([...messages, userMessage, botMessage]);
    }, 1000); // Delay untuk membuat efek mengetik
  };

  // Fungsi untuk menangani umpan balik (like/dislike)
  const handleFeedback = (messageIndex, feedback) => {
    const updatedMessages = [...messages];
    updatedMessages[messageIndex].feedback = feedback;  // Menambahkan feedback pada pesan
    setMessages(updatedMessages);
  };

  // WebSocket untuk obrolan real-time
  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

    socket.onmessage = (event) => {
      const botMessage = { text: event.data, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    };

    return () => socket.close();  // Menutup WebSocket saat komponen di-unmount
  }, []);

  return (
    <div className="flex flex-col justify-between h-screen max-w-lg mx-auto p-4">
      <div className="flex flex-col space-y-4 overflow-y-auto p-2 border-2 rounded-xl bg-gray-50 shadow-lg h-4/5">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs p-3 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              <p>{msg.text}</p>
              {msg.image && <img src={msg.image} alt="Visual Terkait" className="mt-2 rounded-md" />}
              {msg.video && (
                <video width="320" height="240" controls className="mt-2">
                  <source src={msg.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {msg.audio && (
                <audio controls className="mt-2">
                  <source src={msg.audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              {msg.isTyping && <p className="italic text-gray-400">Bot sedang mengetik...</p>}
              {/* Tombol Feedback */}
              {msg.sender === "bot" && (
                <div className="flex space-x-2 mt-2">
                  <button onClick={() => handleFeedback(index, 'like')} className="text-green-500">👍</button>
                  <button onClick={() => handleFeedback(index, 'dislike')} className="text-red-500">👎</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tanyakan sesuatu tentang kalor..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
import React, { useState, useEffect } from 'react';
import math from 'mathjs'; // Pustaka untuk perhitungan matematika

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Fungsi untuk mengirim pesan
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    setIsTyping(true); // Menampilkan animasi mengetik
    setTimeout(async () => {
      let botMessage;

      // Cek jika input berisi persamaan al-jabar
      if (input.toLowerCase().includes("x") || input.toLowerCase().includes("=")) {
        try {
          const solution = math.solve(input, 'x'); // Gunakan mathjs untuk menyelesaikan persamaan
          botMessage = { 
            text: `Hasil dari persamaan '${input}' adalah x = ${solution}`, 
            sender: "bot", 
            isTyping: false 
          };
        } catch (error) {
          botMessage = { 
            text: "Maaf, saya tidak bisa memecahkan persamaan tersebut. Coba format lain.", 
            sender: "bot", 
            isTyping: false 
          };
        }
      } else if (input.toLowerCase().includes("suhu") || input.toLowerCase().includes("kalor")) {
        botMessage = { 
          text: "Kalor adalah energi yang ditransfer karena perbedaan suhu. Berikut adalah ilustrasi mengenai transfer kalor.",
          sender: "bot", 
          image: "https://via.placeholder.com/320x240.png?text=Ilustrasi+Suhu+dan+Kalor", 
          isTyping: false 
        };
      } else {
        botMessage = { 
          text: "Saya belum mengerti tentang itu, coba tanyakan sesuatu tentang suhu, kalor, atau al-jabar!",
          sender: "bot", 
          isTyping: false 
        };
      }

      setMessages([...messages, userMessage, botMessage]);
    }, 1000); // Delay untuk membuat efek mengetik
  };

  return (
    <div className="flex flex-col justify-between h-screen max-w-lg mx-auto p-4">
      <div className="flex flex-col space-y-4 overflow-y-auto p-2 border-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-xl h-4/5">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs p-3 rounded-lg ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}>
              <p className="text-lg">{msg.text}</p>
              {msg.image && <img src={msg.image} alt="Ilustrasi" className="mt-2 rounded-md" />}
              {msg.isTyping && <p className="italic text-gray-400">Bot sedang mengetik...</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          placeholder="Tanyakan sesuatu tentang kalor atau al-jabar..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 focus:outline-none text-lg"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
