import { useEffect } from 'react';
import toast from 'react-hot-toast';

const useWebSocket = () => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/');

    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_ALERT') {
        toast.error(`ALERTE CRITIQUE : ${data.alert.person} détecté !`, {
          duration: 6000,
          position: 'top-right',
          style: {
            background: '#ef4444',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '16px'
          }
        });
        
        // Jouer un son d'alerte optionnel
        const audio = new Audio('/alert-sound.mp3');
        audio.play().catch(e => console.log('Audio play failed', e));
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket');
      // Tentative de reconnexion après 5 secondes
      setTimeout(() => useWebSocket(), 5000);
    };

    return () => {
      socket.close();
    };
  }, []);
};

export default useWebSocket;
