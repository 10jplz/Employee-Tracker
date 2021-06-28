const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'M@xi6898',
    database: 'employee_trackerDB',
});

const start = () =>  {
    inquirer
    .prompt({
        name: 'main',
        type: "list",
        message: 'Welcome, What would you like to do ?',
        choices: [ 'Add Employee', 'New Department', 'Add Role', 'View Employees', 'View Departments', 'View Roles', 'Update Employee' ]
    })
    .then((answer) => {
        if(answer.main === 'Add Employee') {
            addEmployee();
        } else if (answer.main === 'Add Role') {
            addRole();
        } else if (answer.main === 'View Employees') {
            viewEmployees();
        } else if (answer.main === 'View Departments') {
            viewDepartments();
        } else if (answer.main === 'View Roles') {
            viewRoles();
        } else if (answer.main === 'Update Employee') {
            updateEmployee();
        } else if (answer.main === 'New Department') {
            newDepa();
        } else {
            connection.end()
        }

    })
};

const newDepa = () => {
    inquirer 
    .prompt([
        {
            name: 'newDepa',
            type: 'input',
            message: 'Name the new Department'
        },
    ])
    .then((answer) => {
        connection.query('INSERT INTO departments SET ?' ,
        {
            department_name: answer.newDepa,
        },
        (error) => {
            if (error) throw err;
            console.log('Added Department')
            start();
        }
   )
    })
}

const addEmployee = () =>  {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: "What is the first name of the employee? ",
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: "What is the last name of the employee? "
                },
                {
                    name: 'manager_id',
                    type: 'input',
                    message: "What is the manager ID for the employee?"
                },
                {
                    name: 'addRole',
                    type: 'list',
                    choices: function () {
                        return res.map(role => ({ name: role.title, value: role.id }))
                    },
                    message: "What is the role of the employee?"
                }
            ]).then(function (answer) {
                connection.query(
                    'INSERT INTO employees SET ?',
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        manager_id: answer.manager_id,
                        role_id: answer.addRole,
                    },
                    function (err) {
                        if (err) throw err;
                        start()
                    })
            })
    })
};



const addRole = () => {
    inquirer 
    .prompt([
        {
            name: 'addRole',
            type: 'input',
            message: 'Name the new role'
        },
        {
            name: 'addSalary',
            type: 'input',
            message: 'What is the salary for this role?'
        },
    ])
    .then((answer) => {
        connection.query('INSERT INTO roles SET ?' ,
        {
            title: answer.addRole,
            salary: answer.addSalary,
        },
        (error) => {
            if (error) throw err;
            console.log('Added Role')
            start();
        }
   )
    })
}

const viewEmployees = () => {
    let query = 'SELECT first_name, last_name, id, role_id, manager_id FROM employees ORDER BY last_name';
    connection.query(query, function (err, res){
        if (err) throw err;
        console.table('All Employees:', res);
        inquirer
        .prompt({
            name: 'viewEmployees',
            type: 'confirm',
            message: 'Return to the main menu?'
        })
        .then((answer) => {
            if (answer.viewEmployees) {
                start();
            } else {
                connection.end();
            }
        })
    })
}

const viewDepartments = () => {
    let query = 'SELECT * FROM departments';
    connection.query(query, function (err, res) {
        if (err) throw err; 
        console.table('View Departments: ', res);
        inquirer
        .prompt({
            name: 'viewDepartments',
            type: 'confirm',
            message: 'Return to the main menu?'
        })
        .then((answer) => {
            if(answer.viewDepartments) {
                start();
            } else {
                connection.end();
            }
        })
    })
}

const viewRoles = () => {
    let query = 'SELECT distinct TITLE, salary FROM roles';
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table('View Roles', res);
        inquirer 
        .prompt ({
            name: 'viewRoles',
            type: 'confirm',
            message: 'Return to the main menu?'
        })
        .then((answer) => {
            if (answer.viewRoles) {
                start();
            } else {
                connection.end();
            }
        })
    })
};

const updateEmployee = () => {
    connection.query('SELECT * FROM roles', function (err, res) {
        inquirer.prompt([
            {
                name: 'employeeID',
                type: 'input',
                message: 'What is the employee id of the employee you would like to update?',
            },
            {
                name: "updatedRole",
                type: "list",
                message: "What is the new role for this employee?",
                choices: function () {
                    if (err) throw err
                    return res.map(role => ({ name: role.title, value: role.id }))
                }

            }
        ]).then(function (answer) {
            console.log(answer.updatedRole)
            connection.query('UPDATE employees SET ? WHERE ?', [{ role_id: answer.updatedRole }, { id: answer.employeeID }],
                function (err) {
                    if (err) throw err
                    start();
                }
            )
        })
    })
};

start();
