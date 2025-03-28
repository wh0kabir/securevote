const express = require('express');
const app = express();
const port = 4000;
const { ethers } = require('ethers');

// Load compiled contract ABI and address
const contractABI = require('./arpan-abi.json'); // You'll need to generate this
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

// Set up Ethereum provider
const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_ENDPOINT");
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Middleware
app.use(express.json());

// API Endpoints
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = [];
    for (let i = 1; i <= await contract.candidatesCount(); i++) {
      const candidate = await contract.candidates(i);
      candidates.push({
        id: candidate.id.toString(),
        name: candidate.name,
        votes: candidate.voteCount.toString()
      });
    }
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vote', async (req, res) => {
  try {
    const { candidateId, voterAddress } = req.body;
    
    // In real app, you'd verify the voter's signature
    const tx = await contract.vote(candidateId, { from: voterAddress });
    
    res.json({ 
      status: 'success', 
      transactionHash: tx.hash 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/results', async (req, res) => {
  try {
    const results = {};
    const totalVotes = await contract.getTotalVotes();
    
    for (let i = 1; i <= await contract.candidatesCount(); i++) {
      const candidate = await contract.candidates(i);
      results[candidate.id.toString()] = {
        name: candidate.name,
        votes: candidate.voteCount.toString(),
        percentage: (candidate.voteCount / totalVotes * 100).toFixed(2)
      };
    }
    
    res.json({ results, totalVotes: totalVotes.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});