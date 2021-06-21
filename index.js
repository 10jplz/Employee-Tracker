const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table')

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'M@xi6898',
    database: 'employee_trackerDB',
});

connection.connect((err) => {
    if (err) throw err;
    runSearch();
});

const start = () => {
    inquirer
    .prompt({
        name: 'initialSelect',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [

            "Add a department, role, or employee",
            "View existing departments, roles or employees",
            "Update employee role"
        ],

    })
    .then(selection => {
        if(selection.initialSelect === "Add a department, role, or employee"){
            addSelect();
        }else if (
            selection.initialSelect ===
            "View existing department, roles or employees"
        ) {
            viewSelect();
        } else if (selection.initialSelect === "Update employee role") {
            updateEmployee();
        } else {
            connection.end();
        }
    });
};

const addSelect = () => {
    inquirer
    .prompt({
        name: "tableRowAdd",
        type: "rawlist",
        message: "What would like to add?",
        choices: ["New Employee", "New Department", "New Role"],
    })
    .then(selection => {
        if(selection.tableRowAdd === "New Employee") {
            newEmployee();
        } else if (selection.tableRowAdd === "New Department") {
            addDepartment();
        } else if (selection.tableRowAdd === "New Role") {
            newRole();
        } else {
            start();
        }
    });
};

const viewSelect = () => {
    inquirer
    .prompt({
        name: "tableRowView",
        type: "rawlist",
        message: "What would you like to view?",
        choices: ["Employees", "Department", "Roles"],
    })
    .then(selection => {
        if(selection.tableRowView === "Employees") {
            viewEmployee();
        } else if (selection.tableRowView === "Department") {
            viewDepartment(); 
        } else if (selection.tableRowView === "Roles") {
            viewRole();
        } else {
            start();
        }
    })
};
const updateEmployee = async () => {

    connection.query = await util.promisity(coonection.query);
    const roles = await connection.query("SELECT title FROM role");
    const employeeQuery = "SELECT * FROM employee";
    const employeeList = await connection.query("SELECT * FROM employee");
    const managerSelection = await connection.query(
        "SELECT first_name, last_name FROM employee WHERE role_id = 1"
    );

    connection.query(employeeQuery, (err, res) => {
        if (err) throw err;
        inquirer
        .prompt({
            name: "employeeSelect",
            type: "rawlist",
            message: "Which employee would you like to update?",
            choices: [

                ...employeeList.map(
                    employee => employee.first_name + " " + employee.last_name
                ),
                "none",
            ],
        })
        .then(async data => {
            connection.query = await util.promisify(connection.query);

        })
    })

}