// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {
    // ---- State Variables ----
    address public admin;                     // contract deployer = election admin
    uint public totalVotes;                   // total votes cast

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted; // tracks who already voted
    uint public candidatesCount;              // number of candidates

    // ---- Events ----
    event Voted(address indexed voter, uint candidateId);
    event CandidateAdded(uint candidateId, string name);

    // ---- Modifiers ----
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // ---- Constructor ----
    constructor() {
        admin = msg.sender;                   // the account that deploys the contract becomes admin
    }

    // ---- Functions ----
    function addCandidate(string memory _name) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function vote(uint _candidateId) public {
        // enforce: one person = one vote
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        totalVotes++;

        emit Voted(msg.sender, _candidateId);
    }

    // Helper to get all candidates (for frontend)
    function getCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            allCandidates[i - 1] = candidates[i];
        }
        return allCandidates;
    }
}