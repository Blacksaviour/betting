import "./App.css";
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { abi, contractAddress } from "./constants";

function App() {
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0); // Define the balance state variable
  const [connectedAddress, setConnectedAddress] = useState(null);


 
 
 
 
  async function init() {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);
        const contractInstance = new web3.eth.Contract(abi, contractAddress);
        setContract(contractInstance);
        const balance = await contractInstance.methods.getBalance().call();
        setBalance(web3.utils.fromWei(balance, "ether"));
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Please install MetaMask to use this dApp!");
    }
  }

  useEffect(() => {
    init();
  }, []);

  
  async function placeBet(amount, team) {
    if (!connectedAddress) {
      alert("Please connect to MetaMask to place a bet!");
      return;
    }
  
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(abi, contractAddress);
      const teamIndex = team === "Team A" ? 0 : 1;
      const amountInWei = web3.utils.toWei(amount.toString(), "ether");
  
      await contract.methods.placeBet(teamIndex).send({
        from: connectedAddress,
        value: amountInWei,
        gasPrice: '1000000000' // 1 gwei
      });
  
      console.log(`Successfully placed bet of ${amount} ether on ${team}`);
      setBalance(balance - amount);
      alert(`You bet $${amount} on ${team}!`);
    } catch (error) {
      console.error(`Failed to place bet: ${error.message}`);
      alert(`Failed to place bet: ${error.message}`);
    }
  }

  


  async function connectToMetaMask() {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setConnectedAddress(accounts[0]);
      console.log(`Connected to MetaMask with address: ${accounts[0]}`);
    } catch (error) {
      console.error(error);
    }
  }


 
  async function handleBet(amount, team) {
    if (contract) {
      try {
        const amountInWei = Web3.utils.toWei(amount.toString(), "ether");
        console.log(`Betting ${amountInWei} wei on ${team}`)
        await placeBet(amountInWei, team); // Call placeBet with the correct arguments
        setBalance(balance - amount);
        alert(`You bet ${amount} ETH on ${team}!`);
      } catch (error) {
        alert(error.message);
      }
    }
  }
  
  async function handleWithdraw() {
    if (contract) {
      try {
        const amount = balance; // Store the value of balance before calling setBalance
        await contract.methods.withdraw().send({
          from: window.ethereum.selectedAddress,
        });
        setBalance(0);
        alert(`You withdrew $${balance}!`);
      } catch (error) {
        alert(error.message);
      }
    }
  }
  


  return (
    <div className="App">
      <h1>Football Betting</h1>
      <p>Current balance: ${balance}</p>
      <div className="team-container">
        <div className="team-a">
          <h2>Team A</h2>
          <button onClick={() => handleBet(0.0001, "Team A")}>Bet 0.0001 ETH on Team A</button>
          <button onClick={() => handleBet(0.0003, "Team A")}>Bet 0.0003 ETH on Team A</button>
          <button onClick={() => handleBet(0.0005, "Team A")}>Bet 0.0005 ETH on Team A</button>
          <button onClick={connectToMetaMask}>Connect to MetaMask</button>
        </div>
        <div className="team-b">
          <h2>Team B</h2>
          <button onClick={() => handleBet(0.0001, "Team B")}>Bet 0.0001 ETH on Team B</button>
          <button onClick={() => handleBet(0.0003, "Team B")}>Bet 0.0003 ETH on Team B</button>
          <button onClick={() => handleBet(0.0005, "Team B")}>Bet 0.0005 ETH on Team B</button>
        </div>
      </div>
    </div>
  );
}

export default App;
