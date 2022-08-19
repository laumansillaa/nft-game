const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
    const gameContract = await gameContractFactory.deploy(
        ["Miguel One", "Abigail Lincoln", "Wallabee Beatles"],
        ["https://pm1.narvii.com/6395/a6d4c2fcc6da652b2cecb99accbf932a2dd6e21e_hq.jpg", // Images
        "https://static.wikia.nocookie.net/kidsnextdoorfanfiction/images/8/84/Abby_Lincoln.jpg/revision/latest/scale-to-width-down/400?cb=20140309003436", 
        "https://pm1.narvii.com/6056/208cd1672451b895dc33c286a157f5c4e22e3ceb_hq.jpg"],    
        [100, 200, 300],
        [100, 50, 25],
        "Mr. Boss",
        "https://pm1.narvii.com/6225/dc8b7196b5569a201f3f5b714f8a6d2fe59d188f_hq.jpg",
        10000, //BossHp,
        50 //Boss Attack Damage 

        );
    // console.log('GAME COTNRACT', gameContract)
    await gameContract.deployed();
    console.log('Contract deployed to: ', gameContract.address);

    let txn;
    //we only have three characters
    // an nft w/ the character at index 2 of out array
    txn = await gameContract.minCharacterNFT(2);
    await txn.wait();

    txn = await gameContract.attackBoss();
    await txn.wait();

    txn = await gameContract.attackBoss();
    await txn.wait();

    //get the value of the NFT uri´s
    let returnedTokenUri = await gameContract.tokenURI(1);
    // console.log('Token URI', returnedTokenUri);
};

const runMain = async () => {
    try {
        await main()
        process.exit(0)
        // console.log('data', data)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
};

runMain();