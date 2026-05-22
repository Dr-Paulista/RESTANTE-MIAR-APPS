#!/bin/bash

# MIAR APPS - Android APK Build Script
# Automatiza o build do APK nativo para Android

set -e

echo "🚀 Iniciando build do APK Android para MIAR APPS..."

# Verificar se está no diretório correto
if [ ! -f "app/package.json" ]; then
  echo "❌ Erro: Execute este script na raiz do projeto"
  exit 1
fi

# Verificar se EAS CLI está instalado
if ! command -v eas &> /dev/null; then
  echo "📦 Instalando EAS CLI..."
  npm install -g eas-cli
fi

# Verificar se está logado no Expo
echo "🔐 Verificando login Expo..."
eas whoami || {
  echo "❌ Erro: Faça login com 'eas login'"
  exit 1
}

# Navegar para o diretório do app
cd app

# Instalar dependências
echo "📥 Instalando dependências..."
npm install

# Verificar arquivo .env
if [ ! -f ".env" ]; then
  echo "⚠️  Aviso: Arquivo .env não encontrado"
  echo "   Copie .env.example para .env e configure EXPO_PUBLIC_API_URL"
  read -p "   Deseja continuar? (s/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    exit 1
  fi
fi

# Build APK
echo "🔨 Compilando APK..."
eas build --platform android --profile preview

echo "✅ Build concluído! Verifique o link fornecido para baixar o APK"
