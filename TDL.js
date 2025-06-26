let editingIndex = null; // Track which task is being edited


// Save user input 
function SaveUserInput(e) {
    var Txt = e.target.value.trim();

    // do nothing if user writes nothing
    if (!Txt) {
        return;
    }

    var tasks = JSON.parse(localStorage.getItem('UserInput')) || [];

    if (editingIndex !== null) {
        // if editing, update the task instead of adding a new one
        tasks[editingIndex].text = Txt;
        editingIndex = null; // Reset after editing
    } else {
        // add a new task instead
        tasks.push({ text: Txt, completed: false });
    }

    localStorage.setItem('UserInput', JSON.stringify(tasks));

    e.target.value = ""; // Clear input after saving
    WriteUserInput();
}

function WriteUserInput(filter = "all") {
    var tasksContainer = document.getElementById('Tasks');
    tasksContainer.innerHTML = "";

    var tasks = JSON.parse(localStorage.getItem('UserInput')) || [];

    if (tasks.length === 0) {
        tasksContainer.innerHTML = "<p>No tasks found.</p>";
    }

    tasks.forEach((task, index) => {
        if (
            (filter === "completed" && !task.completed) ||
            (filter === "pending" && task.completed)
        ) {
            return;
        }

        var taskItem = document.createElement('div');
        taskItem.classList.add('task-item');


        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        

        checkbox.addEventListener('change', function () {
            tasks[index].completed = checkbox.checked;
            localStorage.setItem('UserInput', JSON.stringify(tasks));
            WriteUserInput(filter);
        });


        var label = document.createElement('label');
        label.innerText = task.text;

        // Create menu button
        var menuBtn = document.createElement('button');
        menuBtn.innerHTML = "⋮";
        menuBtn.classList.add('menu-btn');


        // Create div menu
        var menuDiv = document.createElement('div');
        menuDiv.classList.add('menu-div');
        menuDiv.style.display = 'none';

        // Create Edit button in the div menu
        var editOption = document.createElement('button');
        editOption.innerText = "Edit";
        editOption.classList.add('menu-option');

        editOption.addEventListener('click', function () {
            EditTask(index);
            menuDiv.style.display = 'none'; // Hide menu after clicking
        });

        var deleteOption = document.createElement('button');

        deleteOption.innerText = "Delete";
        deleteOption.classList.add('menu-option');

        deleteOption.addEventListener('click', function () {
            DeleteTask(index, filter);
            menuDiv.style.display = 'none'; // Hide menu after clicking
        });


        // APPEND_CHILDS
        menuDiv.appendChild(editOption);
        menuDiv.appendChild(deleteOption);
        taskItem.appendChild(checkbox);
        taskItem.appendChild(label);
        taskItem.appendChild(menuBtn);
        taskItem.appendChild(menuDiv);
        tasksContainer.appendChild(taskItem);

        // Show/hide menu on click
        menuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            menuDiv.style.display = menuDiv.style.display === 'block' ? 'none' : 'block';
        });

        // click outside div => hide menu
        document.addEventListener('click', function (e) {
            if (!menuDiv.contains(e.target) && e.target !== menuBtn) {
                menuDiv.style.display = 'none';
            }
        });
    });
}

// DELETE task function (delete each task)
function DeleteTask(index, filter) {
    var tasks = JSON.parse(localStorage.getItem('UserInput')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('UserInput', JSON.stringify(tasks));
    WriteUserInput(filter);
}

// EDIT each task function
function EditTask(index) {
    var tasks = JSON.parse(localStorage.getItem('UserInput')) || [];

    document.getElementById("txtbox").value = tasks[index].text;
    editingIndex = index;
    document.getElementById("txtbox").focus(); // Auto-Focus
}

// CLEAR All tasks function
function Clearbtn() {
    localStorage.removeItem('UserInput');
    WriteUserInput();
}

document.addEventListener('DOMContentLoaded', () => {
    WriteUserInput("all");
    setActiveButton(document.getElementById("Btn1")); // Set "All" as default active button
});

function setActiveButton(activeBtn) {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    activeBtn.classList.add("active");
}

// SHOW ALL taks function
function ShowAll() {
    WriteUserInput("all");
    setActiveButton(document.getElementById("Btn1"));
}

// SHOW PENDING tasks function
function PendTsk() {
    WriteUserInput("pending");
    setActiveButton(document.getElementById("Btn2"));
}

// SHOW COMPLETED tasks function
function CompTsk() {
    WriteUserInput("completed");
    setActiveButton(document.getElementById("Btn3"));
}

// Load tasks when the page loads
document.addEventListener('DOMContentLoaded', () => WriteUserInput("all"));
