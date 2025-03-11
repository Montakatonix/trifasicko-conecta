#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

function checkFile(filePath, message) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ ${message} no encontrado en ${filePath}`)
    return false
  }
  console.log(`✅ ${message} encontrado`)
  return true
}

function checkEnvVariables() {
  const envPath = path.join(rootDir, '.env')
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
    'NEXT_PUBLIC_NEWS_API_KEY'
  ]

  if (!fs.existsSync(envPath)) {
    console.error('❌ Archivo .env no encontrado')
    return false
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  const missingVars = []

  for (const variable of requiredVars) {
    if (!envContent.includes(variable + '=')) {
      missingVars.push(variable)
    }
  }

  if (missingVars.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missingVars.join(', '))
    return false
  }

  console.log('✅ Todas las variables de entorno requeridas están presentes')
  return true
}

function verifyConfigurations() {
  console.log('🔍 Verificando configuraciones...\n')

  const checks = [
    checkFile(path.join(rootDir, 'next.config.mjs'), 'Configuración de Next.js'),
    checkFile(path.join(rootDir, 'next.config.analyzer.mjs'), 'Configuración del analizador'),
    checkFile(path.join(rootDir, 'tsconfig.json'), 'Configuración de TypeScript'),
    checkFile(path.join(rootDir, '.eslintrc.json'), 'Configuración de ESLint'),
    checkFile(path.join(rootDir, '.prettierrc'), 'Configuración de Prettier'),
    checkFile(path.join(rootDir, 'postcss.config.js'), 'Configuración de PostCSS'),
    checkFile(path.join(rootDir, 'tailwind.config.js'), 'Configuración de Tailwind'),
    checkFile(path.join(rootDir, '.npmrc'), 'Configuración de NPM'),
    checkEnvVariables()
  ]

  const allPassed = checks.every(check => check)

  console.log('\n' + (allPassed 
    ? '✅ Todas las configuraciones están correctas'
    : '❌ Algunas configuraciones necesitan atención'))

  return allPassed
}

verifyConfigurations() 