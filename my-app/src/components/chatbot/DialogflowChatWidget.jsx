import { useEffect, useState } from 'react';

const DialogflowChatWidget = () => {
  const [scrollDirection, setScrollDirection] = useState(null);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection); // add event listener

    if (typeof window !== 'undefined' && !window.dialogflowMessengerLoaded) {
      window.dialogflowMessengerLoaded = true;

      const script = document.createElement('script');
      script.src =
        'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js';
      script.async = true;

      script.onload = () => {
        // for the messenger to appear
        const dfMessenger = document.createElement('df-messenger');
        dfMessenger.setAttribute('project-id', 'white-sunspot-403307');
        dfMessenger.setAttribute('agent-id', '48d6d88b-9934-406d-8523-e3ec7f4f7381');
        dfMessenger.setAttribute('language-code', 'en');

        // for the chat bubble to appear
        const chatBubble = document.createElement('df-messenger-chat-bubble');
        chatBubble.setAttribute('chat-title', 'CMDR Chatbot');

        dfMessenger.appendChild(chatBubble);

        document.getElementById('chatContainer').appendChild(dfMessenger);
      };

      document.body.appendChild(script);
      return () => window.removeEventListener("scroll", updateScrollDirection); // remove event listener
    }
  }, [scrollDirection]);

  const dfMessengerColors = {
    textColor:'#fff',
    primaryColor: '#203444',
    primaryColorHover: '#293b4d',
    backgroundColor: '#282b31',
    botBubbleBackground: '#428fd9',
    userBubbleBackground: '#414c52',
    userInputBackground: '#273034',
    sendIcon: '#76abe8',
    sendIconHover: '#95bcec',
    chipColor: '#414c52',
    chipColorHover: '#515759',
  };

  return (
    <div>
      <style>
        {`
        :root {
          --df-messenger-font-family: Helvetica Neue, Helvetica, sans-serif;
          --df-messenger-primary-color: ${dfMessengerColors.primaryColor};
          --df-messenger-focus-color: ${dfMessengerColors.botBubbleBackground}50;
          --df-messenger-link-font-color: ${dfMessengerColors.textColor};
          --df-messenger-link-hover-font-color: #eee;
          --df-messenger-chat-border-radius: 4px;
          --df-messenger-chat-window-offset: 8px;
          --df-messenger-chat-window-box-shadow: 0 16px 32px 0 rgba(0, 0, 0, 0.25);
          --df-messenger-titlebar-padding: 2px 18px;
          --df-messenger-titlebar-title-font-size: 17px;
          --df-messenger-titlebar-title-font-family: Helvetica Neue, Helvetica, sans-serif;
          --df-messenger-titlebar-title-font-weight: 500;
          --df-messenger-chat-background-color: ${dfMessengerColors.backgroundColor};
          --df-messenger-message-bot-background: ${dfMessengerColors.botBubbleBackground};
          --df-messenger-message-bot-font-color: ${dfMessengerColors.textColor};
          --df-messenger-message-user-background: ${dfMessengerColors.userBubbleBackground};
          --df-messenger-message-user-font-color: ${dfMessengerColors.textColor};
          --df-messenger-message-bot-border-bottom-left-radius: 2px;
          --df-messenger-message-user-border-bottom-right-radius: 2px;
          --df-messenger-message-bot-stack-border-bottom-left-radius: 8px;
          --df-messenger-message-user-stack-border-bottom-right-radius: 8px;
          --df-messenger-input-background: ${dfMessengerColors.userInputBackground};
          --df-messenger-input-border-top: 1px solid ${dfMessengerColors.userBubbleBackground};
          --df-messenger-input-padding: 8px;
          --df-messenger-input-inner-padding: 8px 10px;
          --df-messenger-send-icon-color: ${dfMessengerColors.sendIcon};
          --df-messenger-send-icon-color-hover: ${dfMessengerColors.sendIconHover};
          --df-messenger-input-font-color: ${dfMessengerColors.textColor};
          --df-messenger-chips-background: ${dfMessengerColors.chipColor};
          --df-messenger-chips-background-hover: ${dfMessengerColors.chipColorHover};
          --df-messenger-chips-border-color: ${dfMessengerColors.chipColor};
          --df-messenger-chips-border-color-hover: ${dfMessengerColors.chipColorHover};
          --df-messenger-chips-font-color: ${dfMessengerColors.textColor};
          --df-messenger-card-background: ${dfMessengerColors.chipColor};
          --df-messenger-card-padding: 8px 12px 8px 8px;
          --df-messenger-button-icon-spacing: 8px;
          --df-messenger-card-border: 1px solid ${dfMessengerColors.chipColor};
          --df-messenger-button-font-color: ${dfMessengerColors.textColor};
        }
        df-messenger {
          z-index: 999;
          right: 16px;
        }
        df-messenger-chat-bubble:hover {
          --df-messenger-chat-bubble-background: ${dfMessengerColors.primaryColorHover};
        }
      `}
      </style>
      <div id="chatContainer" className={`fixed ${ scrollDirection === "down" ? "-bottom-24" : "bottom-0"} right-4 h-20 transition-all duration-500 z-999`}></div>
    </div>
  );
};

export default DialogflowChatWidget;
