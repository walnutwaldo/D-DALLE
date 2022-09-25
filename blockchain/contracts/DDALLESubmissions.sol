pragma solidity ^0.8.0;

import "@klaytn/contracts/KIP/token/KIP17/KIP17.sol";
import "@klaytn/contracts/access/Ownable.sol";

interface IDDALLE {

    struct Task {
        uint id;
        string description;
        uint256 deadline;
        uint256 bounty;
        address owner;
        bool completed;
        uint256 winner;
        address submissionsContract;
    }

    function getTask(uint taskId) external view returns (Task memory);

}

contract DDALLESubmissions is KIP17, Ownable {

    uint constant public PAGE_SIZE = 10;
    uint immutable public taskId;
    uint public numMinted = 0;

    mapping(uint => string) public prompts;
    mapping(uint => string) public urls;

    constructor(uint _taskId) KIP17(
        string.concat("D-DALLE Submission Collection ", Strings.toString(_taskId)),
        string.concat("DSC", Strings.toString(_taskId))
    ){
        taskId = _taskId;
    }

    function submit(string memory url, string memory prompt) public {
        IDDALLE.Task memory task = IDDALLE(owner()).getTask(taskId);
        require(block.timestamp < task.deadline, "Task deadline has passed");

        uint tokenId = numMinted++;
        _safeMint(msg.sender, tokenId);
        urls[tokenId] = url;
        prompts[tokenId] = prompt;
    }

    function getImageURL(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "DDALLESubmissions: Image query for nonexistent token");
        return urls[tokenId];
    }

    function getPrompt(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "DDALLESubmissions: Prompt query for nonexistent token");
        return prompts[tokenId];
    }

    // NFT Data
    string public BASE_BASE_URI = "https://ddalle-backend.herokuapp.com/submissions/";

    function _baseURI() internal view override returns (string memory) {
        return string.concat(
            BASE_BASE_URI,
            Strings.toString(block.chainid),
            "/",
            Strings.toHexString(address(this)),
            "/"
        );
    }

    function setBaseBaseURI(string memory baseBaseURI) public onlyOwner {
        BASE_BASE_URI = baseBaseURI;
    }

    // CUSTOM FUNCTION
    struct Submission {
        uint submissionId;
        string uri;
        string prompt; // No guarantee this was the actual prompt
        address owner;
    }

    function numSubmissions() public view returns (uint) {
        return numMinted;
    }

    function getSubmission(uint submissionId) public view returns (Submission memory) {
        require(submissionId < numSubmissions(), "Submission does not exist");
        return Submission(
            submissionId,
            urls[submissionId],
            prompts[submissionId],
            ownerOf(submissionId)
        );
    }

    function getSubmissions(uint pageNumber) public view returns (Submission[] memory results) {
        uint skip = pageNumber * PAGE_SIZE;
        uint cnt = numSubmissions();
        require(skip < cnt, "Page does not exist");

        uint startIdx = cnt - skip;
        uint endIndex = (startIdx < PAGE_SIZE) ? 0 : startIdx - PAGE_SIZE;

        results = new Submission[](startIdx - endIndex);
        for (uint i = startIdx - 1;; i--) {
            results[startIdx - 1 - i] = getSubmission(i);
            if (i == endIndex) break;
        }
    }

    function getWinner() public view returns (Submission memory) {
        return getSubmission(IDDALLE(owner()).getTask(taskId).winner);
    }

}
