import contractABI from './contractABI.json'

const contractAddress = '0x555252Be427FebD679d5849A3514b50cbB79E9AC'

export const loadContract = async (web3) => {
    return new web3.eth.Contract(contractABI, contractAddress)
}