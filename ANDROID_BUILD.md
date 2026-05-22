# Android APK Build Guide

## 📱 Opção 1: Build Local (Recomendado para teste)

### Pré-requisitos:
- ✅ Node.js 18+ instalado
- ✅ EAS CLI instalado: `npm install -g eas-cli`
- ✅ Login Expo feito: `eas login`
- ✅ `.env` configurado em `app/` com `EXPO_PUBLIC_API_URL`

### Gerar APK:

```bash
cd app
npm install
eas build --platform android --profile preview
```

O EAS vai compilar e disponibilizar o APK em ~10-15 minutos.

---

## 🤖 Opção 2: Build Automatizado (CI/CD)

O repositório inclui um GitHub Actions workflow que compila o APK automaticamente a cada push.

### Configurar segredos no GitHub:

1. Acesse: **Settings → Secrets and variables → Actions**

2. Crie os seguintes segredos:

| Segredo | Valor |
|---------|-------|
| `EXPO_TOKEN` | Seu token Expo (obter em https://expo.dev/settings/tokens) |
| `EXPO_PUBLIC_API_URL` | URL pública da sua API (ex: https://api.example.com:3001) |

3. O workflow `.github/workflows/build-apk.yml` executará automaticamente

---

## 🚀 Quick Start Script

Use o script fornecido:

```bash
chmod +x build-apk.sh
./build-apk.sh
```

---

## 📥 Baixar o APK

Após a build:

1. **Build Local**: Verifique o link fornecido pelo EAS CLI
2. **CI/CD**: Acesse **Actions → Build Android APK → Artifacts**

---

## 🔧 Solução de Problemas

### "Erro: EXPO_TOKEN inválido"
- Regenere o token em https://expo.dev/settings/tokens
- Atualize o segredo no GitHub

### "Erro: EXPO_PUBLIC_API_URL não configurado"
- Configure em `app/.env`: `EXPO_PUBLIC_API_URL=https://sua-api.com:3001`
- Ou adicione o segredo no GitHub Actions

### "APK não consegue conectar à API"
- Verifique que `EXPO_PUBLIC_API_URL` é uma URL **pública** (não localhost)
- Use ngrok se a API for local: `ngrok http 3001`

---

## 📊 Perfis de Build

No `eas.json`:
- **preview**: Gera APK (teste rápido, não signed)
- **production**: Gera app-bundle (Google Play Store)

Para mudar, edite `eas.json` ou use: `eas build --profile production`
