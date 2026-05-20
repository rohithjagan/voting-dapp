# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-05-20
### Added
- Initial release of Voting dApp.
- Solidity contract with addCandidate, vote, getCandidates.
- Admin dashboard in React UI.
- Real-time event listening for Vote and CandidateAdded events.
- MetaMask wallet connection.
- Deployment scripts for Polygon Amoy.
- Dark mode professional UI.
- Skeleton loaders, empty states, and responsive design.
- Project documentation (README, LICENSE, CONTRIBUTING, etc.).

### Security
- One person, one vote enforced by mapping.
- Admin only access for candidate addition.
- Private key management via .env (gitignored).