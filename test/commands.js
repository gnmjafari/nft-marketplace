const instance = await NftMarket.deployed();

instance.mintToken("https://tomato-fresh-kangaroo-585.mypinata.cloud/ipfs/QmX7zfipZRBnFbWzAdq4ayx1Jz2WqcCArcvNkZJ1RsqAPP","500000000000000000",{value:"250000000000000000",from:accounts[0]});

instance.mintToken("https://tomato-fresh-kangaroo-585.mypinata.cloud/ipfs/QmRPuxMZ3uUwk2UTRGVvHAns6CsjLLU7pnF2NaVho5XXxL","300000000000000000",{value:"250000000000000000",from:accounts[0]});
