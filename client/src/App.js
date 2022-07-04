import { useEffect, useState } from 'react';
import Web3 from 'web3';
import BorrowForm from './BorrowForm';
import InputAmount from './FormComponents';
import { borrow, getEthBalance, getExpectedEth, getPKSBalance, init, repay, getExpectedPKS, getWalletAddress } from './Web3Client';

function App() {
  const [ethBalance, setEthBalance] = useState(0);
  const [pksBalance, setPKSBalance] = useState(0);
  const [depositAmount, setdepositAmount] = useState(0);
  const [repayAmount, setrepayAmount] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");

  async function updateBalance() {
    let ethVal = await getEthBalance();
    let pokeVal = await getPKSBalance();
    setEthBalance(ethVal);
    setPKSBalance(pokeVal);
    setWalletAddress(await getWalletAddress())
    console.log(ethVal);
  }

  async function deposit(event){
    setdepositAmount(0);
    event.preventDefault();
    if(depositAmount > 0){
      await borrow(depositAmount.toString())
      updateBalance();
    }
  }

  async function repayment(event){
    setrepayAmount(0);
    event.preventDefault();
    if(repayAmount > 0){
      await repay(repayAmount.toString())
      updateBalance();
    }
  }

  useEffect(() => {
    init();
    updateBalance();
  }, []);

  return (
    <div className='flex flex-col h-screen max-w-6xl mx-auto'>
      <div className='flex h-28 justify-between align-middle'>
      <div className='px-6 my-auto font-extrabold text-4xl'>PokeLoan</div>
      <div className='my-auto'>{walletAddress || "Wallet Not Connected"}</div>
      </div>
      <div className='flex justify-around py-8'>
        <div className='bg-yellow-400 p-2 border-gray-500 border-2 rounded-lg font-medium text-white'>PKS Balance: {pksBalance}</div>
        <div className='bg-red-400 p-2 border-gray-500 border-2 rounded-lg font-medium text-white'>Interest on Repayment: 5%</div>
        <div className='bg-purple-400 p-2 border-gray-500 border-2 rounded-lg font-medium text-white'>ETH Balance:  {ethBalance}</div>
      </div>
      <div className='flex py-4 items-center justify-around'>
        <form onSubmit={deposit}>
        <div className="w-72 mx-auto border-2 rounded-xl">
        <div className="flex-row items-center p-4">
            <div className="text-center text-xl font-bold">Borrow PKS</div>
            <div className="py-4">
                <label htmlFor="Deposit" className="block text-sm font-medium text-gray-700">
                Deposit Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                    type="text"
                    name="deposit"
                    id="deposit"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    onChange={event => setdepositAmount(parseFloat(event.target.value))}
                    value={depositAmount || 0}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="token" className="sr-only">
                    Token
                    </label>
                    <select
                    id="token"
                    name="token"
                    className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                    >
                    <option>ETH</option>
                    </select>
                </div>
                </div>
                <div className='block text-sm font-medium text-green-500'>Expected PKS: {getExpectedEth(depositAmount) || 0}</div>
            </div>
            
            <button className='bg-blue-500 w-full p-2 border-gray-500 border-2 rounded-lg font-medium text-white text-center'>Deposit</button>
        </div>
        </div>
        </form>
        <form onSubmit={repayment}>
        <div className="w-72 mx-auto border-2 rounded-xl">
        <div className="flex-row items-center p-4">
            <div className="text-center text-xl font-bold">Repay PKS</div>
            <div className="py-4">
                <label htmlFor="Repay" className="block text-sm font-medium text-gray-700">
                Repay Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                    type="text"
                    name="repay"
                    id="repay"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    onChange={event => setrepayAmount(parseFloat(event.target.value))}
                    value={repayAmount || 0}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="token" className="sr-only">
                    Token
                    </label>
                    <select
                    id="token"
                    name="token"
                    className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                    >
                    <option>PKS</option>
                    </select>
                </div>
                </div>
                <div className='block text-sm font-medium text-red-500'>ETH After Interest: {getExpectedPKS(repayAmount) || 0}</div>
            </div>
            <button className='bg-blue-500 w-full p-2 border-gray-500 border-2 rounded-lg font-medium text-white text-center'>Repay</button>
        </div>
        </div>
        </form>
      </div>
    </div>
  );
}
export default App;
