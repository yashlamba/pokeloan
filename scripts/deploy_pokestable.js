const hre = require("hardhat");

async function main() {

  const PokeStable = await hre.ethers.getContractFactory("PokeStable");
  console.log('Deploying PokeStable...');
  const token = await PokeStable.deploy('10000000000000000000000');

  await token.deployed();
  console.log("PokeStable deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });