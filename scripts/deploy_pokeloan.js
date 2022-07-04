async function main() {
    const PokeLoan = await ethers.getContractFactory("PokeLoan");
 
    // Start deployment, returning a promise that resolves to a contract object
    const contract = await PokeLoan.deploy(5);
    console.log("Contract deployed to address:", contract.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });