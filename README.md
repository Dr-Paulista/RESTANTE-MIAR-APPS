# MIAR APPS

Base inicial do aplicativo MIAR APPS.

Estrutura criada:

- `app/` — aplicativo mobile em Expo/React Native.
- `api-server/` — backend simples para receber mensagens do chat e responder via IA quando a chave estiver configurada.

Estado atual:

- App abre tela de apresentação.
- Depois entra no chat.
- Chat funciona visualmente.
- Backend tem rota `/api/health` e `/api/chat`.
- Sem chave de IA configurada, o backend responde em modo seguro de teste.

Próximo passo:

1. Rodar o backend.
2. Rodar o app.
3. Configurar a variável `OPENAI_API_KEY` no servidor quando for ativar IA real.
