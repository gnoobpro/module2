import {React, useState, useEffect} from 'react'
import {ethers} from 'ethers'
import styles from './Bank.module.css'
import simple_token_abi from './Contracts/bank_app_abi.json'


const BankApp = () => {

 // deploy simple token contract and paste deployed contract address here. This value is local ganache chain
 let contractAddress = '0x59eFE99aA926a79edEA31F7ED3b2661b1F9e2F62';

 const [errorMessage, setErrorMessage] = useState(null);
 const [defaultAccount, setDefaultAccount] = useState(null);
 const [connButtonText, setConnButtonText] = useState('Connect Wallet');

 const [provider, setProvider] = useState(null);
 const [signer, setSigner] = useState(null);
 const [contract, setContract] = useState(null);

 const [transferHash, setTransferHash] = useState(null);
 const [checkAcc, setCheckAcc] = useState("false");
 const [accStatus, setAccStatus]= useState("");
 const [accbalance, setAccBalance]= useState("");

 const connectWalletHandler = () => {
  if (window.ethereum && window.ethereum.isMetaMask) {

   window.ethereum.request({ method: 'eth_requestAccounts'})
   .then(result => {
    accountChangedHandler(result[0]);
    setConnButtonText('Wallet Connected');
   })
   .catch(error => {
    setErrorMessage(error.message);
   
   });

  } else {
   console.log('Need to install MetaMask');
   setErrorMessage('Please install MetaMask browser extension to interact');
  }
 }

 // update account, will cause component re-render
 const accountChangedHandler = (newAccount) => {
  setDefaultAccount(newAccount);
  updateEthers();
 }
 const chainChangedHandler = () => {
  // reload the page to avoid any errors with chain change mid use of application
  window.location.reload();
 }

 // listen for account changes
 window.ethereum.on('accountsChanged', accountChangedHandler);

 window.ethereum.on('chainChanged', chainChangedHandler);

 const updateEthers = () => {
  let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
  setProvider(tempProvider);

  let tempSigner = tempProvider.getSigner();
  setSigner(tempSigner);

  let tempContract = new ethers.Contract(contractAddress, simple_token_abi, tempSigner);
  setContract(tempContract); 
 }

 const createAccount = async()=>{
  let txt = await contract.createAcc();
  console.log(txt);
  setAccStatus("Your Account is created");
 }
 const checkAccountExists = async()=>{
  ///e.preventDefault();
  let txt = await contract.accountExists();
  if(txt==true){
  setCheckAcc("true");
  }
 }
 const AccountBalance = async()=>{
  let txt= await contract.accountBalance();
  let balanceNumber = txt.toNumber();
  //let tokenDecimals = await contract.decimals();
  console.log(balanceNumber)
  setAccBalance(''+balanceNumber);
 }
 const DepositBalance = async(e)=>{
  e.preventDefault();
  let depositAmount = e.target.depositAmount.value;
  let txt= await contract.deposit({
   value: depositAmount 
  });
 }
 const transferHandler = async (e) => {
  e.preventDefault();
  let transferAmount = e.target.sendAmount.value;
  let recieverAddress = e.target.recieverAddress.value;
  let txt = await contract.transferEther(recieverAddress, transferAmount);
  setTransferHash("Transfer confirmation hash: " + txt.hash);
 }
 const WithdrawBalance = async(e)=>{
  e.preventDefault();
  let withdrawAmount = e.target.withdrawAmount.value;
  let txt= await contract.withdraw(withdrawAmount);
  console.log(txt);
 }


 return (
 <div className="bg">
  <h2 id="heading"> Bank App </h2>
  <button className={styles.button6} onClick={connectWalletHandler}>{connButtonText}</button>

  <div className={styles.walletCard}>
  <div>
   <h3>Address: {defaultAccount}</h3>
   <p >This is user account which gets connected to Metamask wallet</p>
  </div>

  

   
  </div>
  <div className={styles.interactionsCard}>
  <div>
  <h4>Click here to Create your account. Make sure you are connected to Wallet</h4>
   <button onClick={createAccount}>CreateAccount</button>
   
   <form onSubmit={transferHandler}>
     <h3> Transfer money </h3>
      <p> Reciever Address </p>
      <input type='text' id='recieverAddress' className={styles.addressInput}/>

      <p> Transfer Amount </p>
      <input type='number' id='sendAmount' min='0' step='1'/>

      <button type='submit' className={styles.button6}>Transfer</button>
      <div>
       {transferHash}
      </div>
   </form>
   
  </div>
    
   <form onSubmit={DepositBalance}>
     <h3> Deposit Money </h3>
      
      <input type='number' id='depositAmount' min='0' step='1'/>
      <button type='submit' className={styles.button6}>Deposit</button>

   </form>
   
  </div>

 </div>
 )
}

export default BankApp;