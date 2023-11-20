import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";


export const AgeRestrictionPage = () => (
  <div className="container">
    <h1>You Must Be 21 Years or Older</h1>
    <p>Sorry, but you must be 21 years or older to use this service. Please come back when you are 21.</p>
  </div>
);

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [userAge, setUserAge] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const redirectToAgeRestrictionPage = () => {
    window.location.href = "/age-restriction"; // Redirect to the AgeRestrictionPage component
  };

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const handleDepositAmountChange = (event) => {
    setDepositAmount(event.target.value);
  };

  const handleWithdrawAmountChange = (event) => {
    setWithdrawAmount(event.target.value);
  };

  const askForUserAge = () => {
    const age = prompt("Please enter your age:");
    setUserAge(parseInt(age, 10));

    // Redirect to age restriction page if under 21
    if (userAge && userAge < 21) {
      redirectToAgeRestrictionPage();
    }
  };

  const deposit = async () => {
    if (!userAge || userAge < 21) {
      redirectToAgeRestrictionPage();
      return;
    }

    if (atm && depositAmount) {
      let tx = await atm.deposit(depositAmount);
      await tx.wait();
      getBalance();
      setDepositAmount("");

      const transaction = {
        type: "Deposit",
        amount: depositAmount,
        timestamp: new Date().toLocaleString(),
      };
      setTransactionHistory([...transactionHistory, transaction]);
    }
  };

  const withdraw = async () => {
    if (!userAge || userAge < 21) {
      redirectToAgeRestrictionPage();
      return;
    }

    if (atm && withdrawAmount) {
      let tx = await atm.withdraw(withdrawAmount);
      await tx.wait();
      getBalance();
      setWithdrawAmount("");

      const transaction = {
        type: "Withdraw",
        amount: withdrawAmount,
        timestamp: new Date().toLocaleString(),
      };
      setTransactionHistory([...transactionHistory, transaction]);
    }
  };

  const toggleTransactionHistory = () => {
    setShowHistory(!showHistory);
  };

  const renderTransactionHistory = () => {
    if (!showHistory) {
      return null;
    }

    return (
      <div>
        <h2 className="history-heading">TRANSACTION HISTORY</h2>
        <ul className="history-list">
          {transactionHistory.map((transaction, index) => (
            <li key={index} className="history-item">
              {transaction.type} of {transaction.amount} ETH on {transaction.timestamp}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
    getBalance();
    askForUserAge(); // Prompt for user's age on component mount
  }, []);

  return (
    <main className="container">
      <div className="logo-container">
      </div>
      <div className="account-box">
        <header>
          <h1 className="title">ATM SERVICES</h1>
        </header>
        {account ? (
          <div className="account-info">
            <p className="account-text">Your Account Address: {account}</p>
            <p className="account-text">Your Current Balance: {balance}</p>
            <div className="input-group">
              <label htmlFor="depositAmount" className="label">
                Deposit Amount
              </label>
              <input
                id="depositAmount"
                type="number"
                placeholder="Enter deposit amount"
                value={depositAmount}
                onChange={handleDepositAmountChange}
                className="input"
              />
              <button className="action-button" onClick={deposit}>
                Deposit
              </button>
            </div>
            <div className="input-group">
              <label htmlFor="withdrawAmount" className="label">
                Withdraw Amount
              </label>
              <input
                id="withdrawAmount"
                type="number"
                placeholder="Enter withdraw amount"
                value={withdrawAmount}
                onChange={handleWithdrawAmountChange}
                className="input"
              />
              <button className="action-button" onClick={withdraw}>
                Withdraw
              </button>
            </div>
            <br />
            <button className="history-button" onClick={toggleTransactionHistory}>
              {showHistory ? "Hide History" : "Show History"}
            </button>
            {renderTransactionHistory()}
          </div>
        ) : (
          <button className="connect-button" onClick={connectAccount}>
            Please connect your Metamask wallet
          </button>
        )}
      </div>
      <style jsx>{`
        .container {
          text-align: center;
          background: #aec6cf;
          padding: 20px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: black;
        }
        .logo-container {
          margin-bottom: 20px;
        }
        .logo {
          width: 65%;
          display: block;
          margin: 0 auto;
        }
        .account-box {
          background: white;
          border: 2px solid white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        header {
          margin-bottom: 30px;
        }
        .title {
          font-family: Arial;
          color: black;
        }
        .account-info {
          font-family: Arial;
        }
        .account-text {
          font-family: Arial;
          margin-bottom: 10px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }
        .label {
          font-family: Arial;
          color: black;
          margin-bottom: 10px;
        }
        .input {
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .action-button {
          background-color: #008cba;
          color: white;
          border: none;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        .action-button:hover {
          background-color: #00567c;
        }
        .history-button {
          background-color: #3f72af;
          color: white;
          border: none;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        .history-button:hover {
          background-color: #1c4966;
        }
        .connect-button {
          background-color: #3f72af;
          color: white;
          border: none;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        .connect-button:hover {
          background-color: #1c4966;
        }
        .history-heading {
          font-family: Arial;
          color: white;
        }
        .history-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .history-item {
          font-family: Arial;
          color: white;
          margin-bottom: 10px;
        }
      `}</style>
    </main>
  );
}