pragma solidity ^0.8.0;

// Import ReentrancyGuard from the OpenZeppelin Contracts library
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./DDALLESubmissions.sol";

contract DDALLE is Ownable, ReentrancyGuard {

    uint constant public PAGE_SIZE = 10;

    struct Task {
        uint id;
        string description;
        uint256 deadline;
        uint256 bounty;
        address owner;
        bool completed;
        uint256 winner;
        DDALLESubmissions submissionsContract;
    }

    Task[] public tasks;

    event TaskCreated(uint indexed id, address indexed owner, uint256 indexed deadline);
    event WinnerAssigned(uint indexed id, address indexed winner);

    // Duration is in minutes
    function makeTask(string memory description, uint256 duration) public payable nonReentrant {
        uint256 bounty = msg.value;
        require(bounty > 0, "Bounty must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");

        uint taskId = tasks.length;
        Task memory newTask = Task(
            taskId,
            description,
            block.timestamp + (duration * 1 minutes),
            bounty,
            msg.sender,
            false,
            0,
            new DDALLESubmissions(taskId)
        );
        tasks.push(newTask);

        emit TaskCreated(taskId, newTask.owner, newTask.deadline);
    }

    function assignWinner(uint taskId, uint submissionId) public nonReentrant {
        require(taskId < tasks.length, "Task does not exist");
        Task storage task = tasks[taskId];
        require(msg.sender == task.owner, "Only the task owner can assign a winner");
        require(block.timestamp >= task.deadline, "Task deadline has not passed");
        require(!task.completed, "Task has already been completed");

        require(submissionId < task.submissionsContract.numSubmissions(), "Submission does not exist");
        address winningOwner = task.submissionsContract.ownerOf(submissionId);

        // Send 90% to submitter
        (bool success, bytes memory data) = winningOwner.call{value : task.bounty * 9 / 10}("");
        require(success, "Transfer failed");

        // Send 10% to owner
        (success, data) = owner().call{value : task.bounty / 10}("");
        require(success, "Transfer failed");

        task.completed = true;
        task.winner = submissionId;

        emit WinnerAssigned(taskId, winningOwner);
    }

    function deadlinePassed(uint taskId) public view {
        require(taskId < tasks.length, "Task does not exist");
        Task storage task = tasks[taskId];
        require(block.timestamp > task.deadline, "Task deadline has not passed");
    }

    function getTasks(uint pageNumber) public view returns (Task[] memory results) {
        uint skip = pageNumber * PAGE_SIZE;
        uint cnt = tasks.length;
        require(skip < cnt, "Page does not exist");

        uint startIdx = cnt - skip;
        uint endIndex = (startIdx < PAGE_SIZE) ? 0 : startIdx - PAGE_SIZE;

        results = new Task[](startIdx - endIndex);
        for (uint i = startIdx - 1;; i--) {
            results[startIdx - 1 - i] = tasks[i];
            if (i == endIndex) break;
        }
    }

    function numTasks() public view returns (uint) {
        return tasks.length;
    }

    function getTask(uint taskId) public view returns (Task memory) {
        uint cnt = tasks.length;
        require(taskId < cnt, "Task does not exist");
        return tasks[taskId];
    }

}