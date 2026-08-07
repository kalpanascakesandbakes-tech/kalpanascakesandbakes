import { useEffect } from 'react';

const LandbotChat = () => {
  useEffect(() => {
    if (window.myLandbot) return;

    const initLandbot = () => {
      if (window.Landbot && !window.myLandbot) {
        window.myLandbot = new window.Landbot.Livechat({
          configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-3490348-IP7OZWB0STBDBCKK/index.json',
        });
      }
    };

    if (window.Landbot) {
      initLandbot();
    } else {
      try {
        const dynamicImport = new Function(
          "return import('https://cdn.landbot.io/landbot-3/landbot-3.0.0.mjs')"
        );
        dynamicImport()
          .then(() => {
            initLandbot();
          })
          .catch((err) => {
            console.error('Error importing Landbot:', err);
          });
      } catch (e) {
        console.error('Dynamic import failed:', e);
      }
    }
  }, []);

  return null;
};

export default LandbotChat;
