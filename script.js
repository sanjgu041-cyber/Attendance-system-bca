function saveAttendance() {

    let name = document.getElementById("name").value.trim();
    let roll = document.getElementById("roll").value.trim();
    let course = document.getElementById("course").value;
    let status = document.getElementById("status").value;

    if (name === "" || roll === "") {
        alert("Please enter Student Name and Roll Number.");
        return;
    }

    let students = JSON.parse(localStorage.getItem("students")) || [];

    let exists = students.find(function(student) {
        return student.roll === roll && student.course === course;
    });

    if (exists) {
        alert("This Roll Number already exists in " + course + ".");
        return;
    }

    students.push({
        name: name,
        roll: roll,
        course: course,
        status: status
    });

    localStorage.setItem("students", JSON.stringify(students));

    let table = document.getElementById("attendanceTable");

    let row = table.insertRow();

    row.insertCell(0).innerHTML = name;
    row.insertCell(1).innerHTML = roll;
    row.insertCell(2).innerHTML = course;
    row.insertCell(3).innerHTML = status;

    let actionCell = row.insertCell(4);

    actionCell.innerHTML =
        '<button class="edit-btn" onclick="editRow(this)">Edit</button> ' +
        '<button class="delete-btn" onclick="deleteRow(this)">Delete</button>';

    if (status === "Present") {
        row.style.backgroundColor = "lightgreen";
    } else if (status === "Late") {
        row.style.backgroundColor = "yellow";
    } else {
        row.style.backgroundColor = "#ff9999";
    }

    colorToday(status);

    document.getElementById("name").value = "";
    document.getElementById("roll").value = "";
    document.getElementById("course").selectedIndex = 0;
    document.getElementById("status").selectedIndex = 0;

    updateDashboard();
}
window.onload = function () {

    let students = JSON.parse(localStorage.getItem("students")) || [];

    let table = document.getElementById("attendanceTable");

    students.forEach(function(student){

        let row = table.insertRow();

        row.insertCell(0).innerHTML = student.name;
        row.insertCell(1).innerHTML = student.roll;
        row.insertCell(2).innerHTML = student.course;
        row.insertCell(3).innerHTML = student.status;

        let actionCell = row.insertCell(4);

        actionCell.innerHTML =
            '<button class="edit-btn" onclick="editRow(this)">Edit</button> ' +
            '<button class="delete-btn" onclick="deleteRow(this)">Delete</button>';

        if (student.status === "Present") {
            row.style.backgroundColor = "lightgreen";
        } else if (student.status === "Late") {
            row.style.backgroundColor = "yellow";
        } else {
            row.style.backgroundColor = "#ff9999";
        }

    });

    createCalendar();
    updateDashboard();
};

function createCalendar() {

    let calendar = document.getElementById("calendar");

    if (!calendar) return;

    calendar.innerHTML = "";

    for (let i = 1; i <= 31; i++) {

        let day = document.createElement("div");

        day.className = "day";
        day.id = "day" + i;
        day.innerHTML = i;

        calendar.appendChild(day);
    }

}

function colorToday(status) {

    let today = new Date().getDate();

    let box = document.getElementById("day" + today);

    if (!box) return;

    if (status === "Present") {
        box.style.backgroundColor = "lightgreen";
    } else if (status === "Late") {
        box.style.backgroundColor = "yellow";
    } else {
        box.style.backgroundColor = "#ff9999";
    }
}
function updateDashboard() {

    let students = JSON.parse(localStorage.getItem("students")) || [];

    let total = students.length;
    let present = 0;
    let late = 0;
    let absent = 0;

    students.forEach(function(student) {

        if (student.status === "Present") {
            present++;
        } else if (student.status === "Late") {
            late++;
        } else {
            absent++;
        }

    });

    document.getElementById("totalStudents").innerHTML = total;
    document.getElementById("presentCount").innerHTML = present;
    document.getElementById("lateCount").innerHTML = late;
    document.getElementById("absentCount").innerHTML = absent;
}

function deleteRow(button) {

    let row = button.parentNode.parentNode;

    let roll = row.cells[1].innerHTML;
    let course = row.cells[2].innerHTML;

    let students = JSON.parse(localStorage.getItem("students")) || [];

    students = students.filter(function(student) {
        return !(student.roll === roll && student.course === course);
    });

    localStorage.setItem("students", JSON.stringify(students));

    row.remove();

    updateDashboard();
}

function editRow(button) {

    let row = button.parentNode.parentNode;

    document.getElementById("name").value = row.cells[0].innerHTML;
    document.getElementById("roll").value = row.cells[1].innerHTML;
    document.getElementById("course").value = row.cells[2].innerHTML;
    document.getElementById("status").value = row.cells[3].innerHTML;

    deleteRow(button);
}