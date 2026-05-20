# Security Policy

## Reporting a Vulnerability
If you discover a security vulnerability within this project, **please do NOT open a public issue**. Instead, send an email to [rohithjagan25@gmail.com] with a detailed description. We appreciate responsible disclosure and will respond within 48 hours.

## Supported Versions
Only the latest commit on `main` branch is supported with security updates.

## Security Model
- **Private Key**: Never share your `PRIVATE_KEY`. The `.env` file is gitignored. Use environment variables in production.
- **Smart Contract**: The contract is designed to be immutable after deployment. Admin functions (`addCandidate`) are restricted to the deployer. Ensure the deployer address is controlled by a multi-sig or hardware wallet in production.
- **Frontend**: The dApp uses MetaMask for transaction signing. No private keys are stored in the browser.

## Audits
No formal audit has been performed. Use at your own risk on testnets only.

## Known Issues
- Gas price must be ≥ 30 gwei on Amoy due to network minimums (handled in UI).
- React Strict Mode may cause duplicate renders in development (no production impact).
