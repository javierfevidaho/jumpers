// components/ChatWidget.tsx
'use client'
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, Minimize2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatWidgetProps {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  showChat, 
  setShowChat
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Hello! I'm the virtual assistant for Hernandez Jumpers. How can I help you today? I can answer questions about products, prices, availability, and services. 😊",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Detectar idioma
  const detectLanguage = (msg: string): "es" | "en" => {
    const message = msg.toLowerCase();

    // Palabras clave para español
    const spanishKeywords = [
      'hola','gracias','precio','cuanto','cuesta','donde','cuando','como','que',
      'mesa','silla','brinca','tobogan','renta','alquiler','comprar','venta',
      'entrega','garantia','contacto','horarios','telefono','direccion'
    ];

    const isSpanish = 
      spanishKeywords.some(k => message.includes(k)) || 
      message.includes("ñ") || 
      message.includes("¿") || 
      message.includes("¡");

    return isSpanish ? "es" : "en";
  };

  // Respuestas predefinidas
  const responses = {
    bounceHouse: {
      es: `Tenemos varios modelos de brincadores disponibles. Venta: $1,300 - $2,400. Renta: $100 - $300/día. ¿Te interesa algún modelo específico?`,
      en: `We have several bounce house models available. Sale: $1,300 - $2,400. Rent: $100 - $300/day. Are you interested in any specific model?`
    },
    tables: {
      es: `Mesas: 6ft rectangulares ($60 venta, $15 renta), redondas 60" ($120 venta, $25 renta), y mesas de niños ($55 venta, $12 renta). ¿Cuál necesitas?`,
      en: `Tables: 6ft rectangular ($60 sale, $15 rent), 60" round ($120 sale, $25 rent), kids' tables ($55 sale, $12 rent). Which one do you need?`
    },
    chairs: {
      es: `Sillas: Duramax (8 por $104), sillas para niños ($12 c/u), Chiavari elegantes ($8 renta), plegables blancas ($1.50 renta). ¿Para qué evento son?`,
      en: `Chairs: Duramax (8 for $104), kids' chairs ($12 each), elegant Chiavari ($8 rent), white folding ($1.50 rent). What event are they for?`
    },
    waterslide: {
      es: `Toboganes acuáticos de 16ft. Venta: $2,400 (motor + garantía 2 años). Renta: $190 - $300/día. ¡Perfectos para verano!`,
      en: `16ft water slides. Sale: $2,400 (includes motor + 2-year warranty). Rent: $190 - $300/day. Perfect for summer!`
    },
    prices: {
      es: `Precios: brincadores desde $100/día o $1,300 venta. Mesas desde $15/día o $60 venta. Sillas desde $1.50/día renta. ¿Qué producto específico buscas?`,
      en: `Prices: bounce houses from $100/day rent or $1,300 sale. Tables from $15/day or $60 sale. Chairs from $1.50/day rent. Which product are you looking for?`
    },
    delivery: {
      es: `Entrega gratuita dentro de 15 millas (Phoenix, Scottsdale, Tempe, Mesa, Chandler, Glendale). ¿Dónde sería tu evento?`,
      en: `Free delivery within 15 miles (Phoenix, Scottsdale, Tempe, Mesa, Chandler, Glendale). Where is your event?`
    },
    warranty: {
      es: `Brincadores incluyen garantía de 2 años en costuras, soplador, kit de reparación y manual. Calidad Duramax.`,
      en: `Bounce houses include 2-year seam warranty, blower, repair kit, and manual. Duramax quality.`
    },
    contact: {
      es: `📞 Fidel: (480) 438-1258 (Inglés y Español)\n📞 Yesii: (623) 418-0360 (Español)\n📧 hernandezjumpers@gmail.com\n📍 330 N 21st Ave, Phoenix, AZ 85009`,
      en: `📞 Fidel: (480) 438-1258 (English & Spanish)\n📞 Yesii: (623) 418-0360 (Spanish)\n📧 hernandezjumpers@gmail.com\n📍 330 N 21st Ave, Phoenix, AZ 85009`
    },
    hello: {
      es: `¡Hola! Bienvenido a Hernandez Jumpers. Renta/venta de brincadores, mesas y sillas. ¿Cómo puedo ayudarte?`,
      en: `Hello! Welcome to Hernandez Jumpers. We rent/sell bounce houses, tables, and chairs. How can I help you?`
    },
    thanks: {
      es: `¡De nada! Estoy aquí para ayudarte. Si quieres hacer un pedido, mándanos WhatsApp. ¡Buen día! 😊`,
      en: `You're welcome! If you'd like to place an order, send us a WhatsApp. Have a great day! 😊`
    },
    default: {
      es: `Puedo ayudarte con:\n🏰 Brincadores\n🪑 Mesas y sillas\n📦 Disponibilidad\n🚚 Entregas\n💰 Cotizaciones\n📞 Contacto\n\n¿Qué necesitas saber?`,
      en: `I can help you with:\n🏰 Bounce houses\n🪑 Tables & chairs\n📦 Availability\n🚚 Delivery\n💰 Quotes\n📞 Contact info\n\nWhat do you need?`
    }
  };

  // Lógica principal
  const getAIResponse = (userMessage: string): string => {
    const lang = detectLanguage(userMessage);
    const msg = userMessage.toLowerCase();

    if (msg.includes("bounce") || msg.includes("jumper") || msg.includes("brinca"))
      return responses.bounceHouse[lang];

    if (msg.includes("table") || msg.includes("mesa"))
      return responses.tables[lang];

    if (msg.includes("chair") || msg.includes("silla"))
      return responses.chairs[lang];

    if (msg.includes("slide") || msg.includes("tobogan") || msg.includes("acuatico"))
      return responses.waterslide[lang];

    if (msg.includes("price") || msg.includes("precio") || msg.includes("cuesta"))
      return responses.prices[lang];

    if (msg.includes("delivery") || msg.includes("entrega") || msg.includes("envio"))
      return responses.delivery[lang];

    if (msg.includes("warranty") || msg.includes("garantia"))
      return responses.warranty[lang];

    if (msg.includes("contact") || msg.includes("contacto") || msg.includes("telefono"))
      return responses.contact[lang];

    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hola"))
      return responses.hello[lang];

    if (msg.includes("thank") || msg.includes("gracias"))
      return responses.thanks[lang];

    return responses.default[lang];
  };

  const sendChatMessage = (): void => {
    if (!chatInput.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      text: chatInput,
      isBot: false,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    const inputText = chatInput;
    setChatInput('');
    setIsTyping(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: Date.now() + 1,
        text: getAIResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${showChat ? 'w-80 h-96' : 'w-auto h-auto'}`}>
      {!showChat ? (
        <button
          onClick={() => setShowChat(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors animate-pulse"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col h-full">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <p className="text-xs opacity-90">Hernandez Jumpers</p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatMessagesRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50"
          >
            {chatMessages.map((message: ChatMessage) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.isBot
                      ? 'bg-white text-gray-800 border border-gray-200'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 opacity-70 ${message.isBot ? 'text-gray-500' : 'text-blue-100'}`}>
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChatInput(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type your question..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="off"
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatInput.trim() || isTyping}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;