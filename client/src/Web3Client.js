import Web3 from 'web3';
import pokeloan from "./PokeLoan.json";
import pokestable from "./PokeStable.json";

let selectedAccount;
let pokeLoan;
let pokeStable;
let web3;
let ethBalance = 0;
let pokeBalance = 0;
let interest = 5/100;
const providerUrl = "http://localhost:8545"

export const init = async () => {
    let provider = window.ethereum;

    if (typeof provider !== 'undefined') {
      provider.request({method: "eth_requestAccounts"}).then(accounts =>{
        selectedAccount = accounts[0];
        console.log(accounts);
      }).catch((err) => {
        console.log(err);
      });

      window.ethereum.on("accountsChanged", (accounts)=>{
        selectedAccount = accounts[0];
        console.log(accounts);
      })
    }
    web3 = new Web3(providerUrl);

    const networkId = await web3.eth.net.getId();

    pokeLoan = new web3.eth.Contract(
      pokeloan.abi,
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    );

    pokeStable = new web3.eth.Contract(
      pokestable.abi,
      "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );
    console.log(pokeStable);

    // console.log(await pokeLoan.methods.pokeBalance().call({from: selectedAccount}));
    // console.log(await pokeLoan.methods.borrow().send({from: selectedAccount, to:"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", value: web3.utils.toWei("1", "ether")}));
}

export async function borrow(eth_amount) {
  await pokeLoan.methods.borrow().send({from: selectedAccount, to:"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", value: web3.utils.toWei(eth_amount, "ether")});
}

export async function repay(pks_amount) {
  while(!pokeStable){
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  let temp = await pokeStable.methods.approve("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", web3.utils.toWei(pks_amount, "ether")).send({from: selectedAccount});
  console.log(temp);
  console.log(await pokeLoan.methods.repay(web3.utils.toWei(pks_amount, "ether")).send({from: selectedAccount}));
}

export async function getEthBalance() {
  while(!pokeLoan){
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  ethBalance = await web3.eth.getBalance(pokeLoan.options.address);
  console.log(ethBalance);
  return web3.utils.fromWei(ethBalance.toString(), "ether");
}

export async function getPKSBalance() {
  while(!pokeLoan){
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  pokeBalance = await pokeLoan.methods.pokeBalance().call({from: selectedAccount});
  return web3.utils.fromWei(pokeBalance.toString(), "ether");
}

export function getExpectedEth(amount){
  return amount/10;
}

export function getExpectedPKS(amount){
  return (amount - (amount * interest))/10;
}

export async function getWalletAddress(amount){
  while(!pokeLoan){
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return selectedAccount;
}