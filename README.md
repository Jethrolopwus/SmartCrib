# SmartCribs - Decentralized Property Rental and Swap Platform

A comprehensive Web3 platform for secure, transparent property transactions including rentals, swaps, and sales with on-chain reviews and reputation systems.

## 🏗️ Project Structure

```
smartcribs/
├── smartcontract/          # Smart contract implementation
│   ├── contracts/          # Solidity contracts
│   ├── test/              # Contract tests
│   ├── scripts/           # Deployment scripts
│   └── hardhat.config.cjs # Hardhat configuration
├── frontend/              # Next.js frontend application
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   └── public/            # Static assets
└── docs/                  # Documentation (local only)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartcribs
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp smartcontract/.env.example smartcontract/.env
   
   # Add your configuration
   # SEPOLIA_URL=your_sepolia_rpc_url
   # PRIVATE_KEY=your_private_key
   # ETHERSCAN_API_KEY=your_etherscan_key
   ```

### Development

#### Smart Contracts
```bash
# Compile contracts
npm run smartcontract:compile

# Run tests
npm run smartcontract:test

# Deploy to local network
npm run smartcontract:deploy

# Deploy to testnet
npm run smartcontract:deploy:sepolia
```

#### Frontend
```bash
# Start development server
npm run frontend:dev

# Build for production
npm run frontend:build

# Start production server
npm run frontend:start
```

#### Full Stack Development
```bash
# Run both smart contracts and frontend
npm run dev
```

## 📋 Features

### Phase 1: User Management ✅
- User registration and role management
- Reputation system
- Profile management with IPFS

### Phase 2: Property Listings ✅
- Multi-transaction support (Rent, Swap, Sale)
- Property verification system
- Advanced swap proposals
- IPFS metadata storage

### Phase 3: Transaction Management (Coming Soon)
- Rental agreements
- Payment processing
- Escrow system
- Dispute resolution

## 🔧 Technology Stack

### Smart Contracts
- **Solidity** 0.8.24
- **Hardhat** - Development framework
- **OpenZeppelin** - Security libraries
- **Ethereum/Polygon** - Target networks

### Frontend
- **Next.js** 14 - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Web3.js/Ethers.js** - Blockchain interaction

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:
- `PHASE_1_README.md` - User management implementation
- `PHASE_2_README.md` - Property listings implementation
- `PHASE_1_SUMMARY.md` - Phase 1 completion summary
- `PHASE_2_SUMMARY.md` - Phase 2 completion summary

## 🧪 Testing

```bash
# Run all tests
npm run smartcontract:test

# Run specific test file
cd smartcontract && npx hardhat test test/PropertyListings.test.js
```

## 🚀 Deployment

### Smart Contracts
```bash
# Deploy to Sepolia testnet
npm run smartcontract:deploy:sepolia

# Deploy to Polygon mainnet
npm run smartcontract:deploy:polygon
```

### Frontend
```bash
# Build and deploy to Vercel
npm run frontend:build
# Then deploy to your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `docs/` folder
- Review the test files for usage examples

---

**SmartCribs** - Building the future of decentralized property transactions
