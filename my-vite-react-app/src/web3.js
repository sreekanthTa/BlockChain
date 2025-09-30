import Web3 from "web3"


let web3;

try {
    if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        console.log('Web3 Version:', Web3.version);
        web3 = new Web3(window.ethereum);
        console.log('Web3 initialized successfully');
    } else {
        console.log('Please install MetaMask!');
        web3 = null;
    }
} catch (error) {
    console.error('Error initializing web3:', error);
    web3 = null;
}

export default web3;