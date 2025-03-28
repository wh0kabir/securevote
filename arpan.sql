// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Define a structure for a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store the candidates
    mapping(uint => Candidate) public candidates;
    
    // Store addresses that have voted
    mapping(address => bool) public voters;

    uint public candidatesCount;
    uint public totalVotes;

    // Event that is triggered when a vote is cast
    event Voted(address indexed voter, uint candidateId);

    constructor() {
        addCandidate("RanVjay");
        addCandidate("Panghal");
    }

    // Function to add a candidate
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Function to vote for a candidate
    function vote(uint _candidateId) public {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate.");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        totalVotes++;

        emit Voted(msg.sender, _candidateId);
    }

    // Function to
    function getVotes(uint _candidateId) public view returns (uint) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate.");
        return candidates[_candidateId].voteCount;
    }

    // Function to get total number of votes
    function getTotalVotes() public view returns (uint) {
        return totalVotes;
    }
}