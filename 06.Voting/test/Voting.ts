import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();


describe("Voting Contract", function () {
  let voting: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addr3: any;

  beforeEach(async ()=>{
    [owner, addr1, addr2, addr3]= await ethers.getSigners()
     const VotingFactory = await ethers.getContractFactory("Voting");
    voting = (await VotingFactory.deploy(["Alice", "Bob", "Charlie"])) as Voting; // ✅ await here

  })
   it("Should have owner set correctly", async () => {
       expect(await voting.owner()).to.equal(owner.address);
     });
  
   it("Should have owner set correctly", async () => {
        expect(await voting.owner()).to.equal(owner.address);
    });


    it("Should allow register Voters", async ()=> {
      await voting.addVoters(
        addr1.address
      )
        await voting.addVoters(
        addr2.address
      )

      const voter = await voting.totalVoters()
      expect(voter).to.equal(2)
    })

   
  it("Should add proposals", async () => {
    await voting.addProposals("David");

    const proposals = await voting.getAllProposals(); // make sure this exists in contract
    expect(proposals.length).to.equal(4);
    expect(proposals[3].title).to.equal("David");
  });



    it("Should allow voting", async ()=> {
       await voting.addVoters(addr1.address)
       await voting.addVoters(addr2.address)

       await voting.nextPhase()

       await voting.connect(addr1).vote(0)
       await voting.connect(addr2).vote(1)

      const proposal0 = await voting.getProposal(0);
      const proposal1 = await voting.getProposal(1);

      expect(proposal0.voteCount).to.equal(1);
      expect(proposal1.voteCount).to.equal(1);
    })

    it("Should allow pickWinner", async ()=>{
   
       await voting.addVoters(addr1.address)
       await voting.addVoters(addr2.address)

       await voting.nextPhase()

       await voting.connect(addr1).vote(0)
       await voting.connect(addr2).vote(0)

       await voting.nextPhase()

       const winnerIndex = await voting.pickWinner()
       const winnerName = await voting.winnerName()

       expect(winnerIndex).to.equal(0)
       expect(winnerName).to.equal("Alice")


    })


});
