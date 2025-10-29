# VOIX - Social Media Platform

VOIX is a decentralized social media platform built with React Native (Expo), Node.js, and Solana blockchain integration. Users can create buzzes, interact with content, send tips, and manage friendships.

## 🏗️ Project Structure

```
VOIX/
├── frontend/voix-app/          # React Native (Expo) frontend
├── Backend/                    # Node.js backend with Express
├── smart_contract/             # Solana smart contract (Anchor)
└── Readme.MD                   # This file
```

## 🚀 Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** (recommended)
- **Expo CLI** (`npm install -g @expo/cli`)
- **Rust** (for smart contract development)
- **Anchor CLI** (for Solana smart contracts)
- **Solana CLI** (for blockchain interactions)

## 📱 Frontend Setup (React Native/Expo)

### 1. Navigate to frontend directory
```bash
cd frontend/voix-app
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

### 3. Install additional dependencies
```bash
npm install @solana/web3.js @solana/spl-token
```

### 4. Start the development server
```bash
npm start
# or
expo start
```

### 5. Run on specific platforms
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web
npm run web
```

## 🔧 Backend Setup (Node.js/Express)

### 1. Navigate to backend directory
```bash
cd Backend
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```


## 🌐 API Endpoints

The backend provides the following main API endpoints:

- **Authentication**: `/api/v1/auth/*`
- **Buzzes**: `/api/v1/buzz/*`
- **Friends**: `/api/v1/friend/*`
- **Wallet**: `/api/v1/wallet/*`
- **Tips**: `/api/v1/tip/*`
- **Karma**: `/api/v1/karma/*`
- **Search**: `/api/v1/search/*`

## 🔧 Configuration

### Frontend Configuration
- API base URL: `frontend/voix-app/config/constants.ts`
- Environment variables: `frontend/voix-app/.env`

### Backend Configuration
- Database: `Backend/prisma/schema.prisma`
- Environment: `Backend/.env`
- Routes: `Backend/src/routes/`

### Smart Contract Configuration
- Program ID: `smart_contract/Anchor.toml`
- Program logic: `smart_contract/programs/voix/src/`

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **Database connection**: Check DATABASE_URL in `.env`
3. **Solana RPC issues**: Verify SOLANA_RPC_URL in backend `.env`
4. **Build failures**: Ensure all dependencies are installed


## 📱 Platform Support

- **Android**: API level 21+



