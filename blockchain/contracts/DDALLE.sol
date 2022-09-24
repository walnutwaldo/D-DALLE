pragma solidity ^0.8.0;

// Import Ownable from the OpenZeppelin Contracts library
import "@openzeppelin/contracts/access/Ownable.sol";
// Import ReentrancyGuard from the OpenZeppelin Contracts library
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DDALLE is Ownable, ReentrancyGuard {

    struct Task {
        uint id;
        string description;
        uint256 deadline;
        uint256 bounty;
        address owner;
        bool completed;
        uint256 winner;
    }

    struct Submission {
        uint submissionId;
        string uri;
        string prompt; // No guarantee this was the actual prompt
        address payable submitter;
        uint submissionTime;
    }

    Task[] public tasks;
    mapping(uint => Submission[]) public submissions;

    event TaskCreated(uint indexed id, address indexed owner, uint256 indexed deadline);
    event SubmissionCreated(uint indexed id, address indexed submitter, string uri);
    event WinnerAssigned(uint indexed id, address indexed winner);

    // Duration is in minutes
    function makeTask(string memory description, uint256 duration) public payable nonReentrant {
        uint256 bounty = msg.value;
        require(bounty > 0, "Bounty must be greater than 0");

        Task memory newTask = Task(
            tasks.length,
            description,
            block.timestamp + (duration * 1 minutes),
            bounty,
            msg.sender,
            false,
            0
        );
        tasks.push(newTask);

        emit TaskCreated(newTask.id, newTask.owner, newTask.deadline);
    }

    function submit(uint taskId, string memory uri, string memory prompt) public nonReentrant {
        require(taskId < tasks.length, "Task does not exist");
        Task storage task = tasks[taskId];
        require(block.timestamp < task.deadline, "Task deadline has passed");

        Submission memory newSubmission = Submission(
            submissions[taskId].length,
            uri,
            prompt,
            payable(msg.sender),
            block.timestamp
        );
        submissions[taskId].push(newSubmission);

        emit SubmissionCreated(taskId, newSubmission.submitter, newSubmission.uri);
    }

    function assignWinner(uint taskId, uint submissionId) public nonReentrant {
        require(taskId < tasks.length, "Task does not exist");
        Task storage task = tasks[taskId];
        require(msg.sender == task.owner, "Only the task owner can assign a winner");
        require(block.timestamp >= task.deadline, "Task deadline has not passed");
        require(!task.completed, "Task has already been completed");

        Submission storage submission = submissions[taskId][submissionId];

        // Send 90% to submitter
        (bool success, bytes memory data) = submission.submitter.call{value : task.bounty * 9 / 10}("");
        require(success, "Transfer failed");

        // Send 10% to owner
        (success, data) = task.owner.call{value : task.bounty / 10}("");
        require(success, "Transfer failed");

        task.completed = true;
        task.winner = submissionId;

        emit WinnerAssigned(taskId, submission.submitter);
    }

    function getSubmissions(uint taskId, uint pageNumber) public view returns (Submission[] memory results) {
        require(taskId < tasks.length, "Task does not exist");
        Submission[] storage submissionsForTask = submissions[taskId];
        uint submissionsPerPage = 10;
        uint startIndex = pageNumber * submissionsPerPage;
        uint endIndex = startIndex + submissionsPerPage;
        if (endIndex > submissionsForTask.length) {
            endIndex = submissionsForTask.length;
        }
        results = new Submission[](endIndex - startIndex);
        for (uint i = startIndex; i < endIndex; i++) {
            results[i - startIndex] = submissionsForTask[i];
        }
    }

    function getSubmission(uint taskId, uint submissionId) public view returns (Submission memory) {
        require(taskId < tasks.length, "Task does not exist");
        Submission[] storage submissionsForTask = submissions[taskId];
        require(submissionId < submissionsForTask.length, "Submission does not exist");
        return submissionsForTask[submissionId];
    }

    function deadlinePassed(uint taskId) public view {
        require(taskId < tasks.length, "Task does not exist");
        Task storage task = tasks[taskId];
        require(block.timestamp > task.deadline, "Task deadline has not passed");
    }

    function getWinner(uint taskId) public view returns (Submission memory) {
        require(taskId < tasks.length, "Task does not exist");
        Task storage task = tasks[taskId];
        require(task.completed, "Task winner has not been assigned");
        return submissions[taskId][task.winner];
    }

}