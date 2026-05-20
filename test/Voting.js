import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("Voting Contract", function () {
  let Voting;
  let voting;
  let admin;
  let voter1;
  let voter2;

  beforeEach(async function () {
    [admin, voter1, voter2] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
  });

  it("Should set the deployer as admin", async function () {
    expect(await voting.admin()).to.equal(admin.address);
  });

  it("Should allow admin to add candidates", async function () {
    await voting.connect(admin).addCandidate("Alice");
    const candidates = await voting.getCandidates();
    expect(candidates.length).to.equal(1);
    expect(candidates[0].name).to.equal("Alice");
  });

  it("Should NOT allow non-admin to add candidates", async function () {
    await expect(
      voting.connect(voter1).addCandidate("Eve")
    ).to.be.revertedWith("Only admin can perform this action");
  });

  it("Should allow a user to vote only once", async function () {
    await voting.connect(admin).addCandidate("Alice");
    await voting.connect(voter1).vote(1);
    expect(await voting.hasVoted(voter1.address)).to.equal(true);

    await expect(
      voting.connect(voter1).vote(1)
    ).to.be.revertedWith("You have already voted");
  });

  it("Should correctly count votes", async function () {
    await voting.connect(admin).addCandidate("Alice");
    await voting.connect(admin).addCandidate("Bob");

    await voting.connect(voter1).vote(1);
    await voting.connect(voter2).vote(2);

    const candidates = await voting.getCandidates();
    expect(candidates[0].voteCount).to.equal(1);
    expect(candidates[1].voteCount).to.equal(1);
    expect(await voting.totalVotes()).to.equal(2);
  });

  it("Should reject vote for non-existent candidate", async function () {
    await voting.connect(admin).addCandidate("Alice");
    await expect(
      voting.connect(voter1).vote(99)
    ).to.be.revertedWith("Invalid candidate ID");
  });
});