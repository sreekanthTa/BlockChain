import { ethers } from "ethers";
import VotingAbi from "../Voting.json";

const CONTRACT_ADDRESS = "0x1B4C223c92d1F77d76D75E9A40656aD0513c327b";

export function getVotingContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, VotingAbi.abi, signerOrProvider);
}
