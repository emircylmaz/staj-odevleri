interface people {
    name: string;
    team: string;
    salary: number;
    year: number;
}

const data : people[] =
[
    {"name": "John", "team": "Engineering", "salary": 2000, "year": 2026},
    {"name": "Sheena", "team": "HR", "salary": 5000, "year": 2020},
    {"name": "Bob", "team": "Engineering", "salary": 8000, "year": 2023},
    {"name": "Emilia", "team": "Design", "salary": 8000, "year": 2018},
    {"name": "Ado", "team": "HR", "salary": 10000, "year": 2021},
    {"name": "Michael", "team": "HR", "salary": 4000, "year": 2022},
    {"name": "Brian", "team": "IT", "salary": 1000, "year": 2026},
    {"name": "Jane", "team": "Engineering", "salary": 6000, "year": 2018},
    {"name": "Giorgia", "team": "IT", "salary": 8000, "year": 2017},
    {"name": "Juan", "team": "HR", "salary": 5000, "year": 2021},
    {"name": "Sanae", "team": "Engineering", "salary": 9000, "year": 2020},
    {"name": "Kevin", "team": "Design", "salary": 5000, "year": 2025},
    {"name": "Jill", "team": "IT", "salary": 4000, "year": 2023},
    {"name": "Gabriel", "team": "Design", "salary": 6000, "year": 2019},
    {"name": "Ezekiel", "team": "Engineering", "salary": 9000, "year": 2016}
]

const itTeam = data.filter(employee => employee.team === "IT");
console.log("IT Team Employees:");
console.log(itTeam);

const hrTeam = data.filter(employee => employee.team === "HR");
console.log("HR Team Employees:");
console.log(hrTeam);

const engineeringTeam = data.filter(employee => employee.team === "Engineering");
console.log("Engineering Team Employees:");
console.log(engineeringTeam);

const designTeam = data.filter(employee => employee.team === "Design");
console.log("Design Team Employees:");
console.log(designTeam)



const names = [...data].map(employee => employee.name).sort((a, b) => a.localeCompare(b));
console.log("Employees names list in order:");
console.log(names);



const totalSalary = data.reduce((sum, employee) => sum + employee.salary, 0);
const averageSalary = totalSalary / data.length;
console.log("Average salary is:", averageSalary);

const highestSalary = data.reduce((prev, current) => {
    return (current.salary > prev.salary) ? current : prev;
});
console.log("Highest paid employee is:", highestSalary);



const itCount = itTeam.length;
console.log("Number of employees in the IT team is:", itCount);

const hrCount = hrTeam.length;
console.log("Number of employees in the HR team is:", hrCount);

const engineeringCount = engineeringTeam.length;
console.log("Number of employees in the Engineering team is:", engineeringCount);

const designCount = designTeam.length;
console.log("Number of employees in the Design team is:", designCount);



const sortedByYear = [...data].sort((a, b) => a.year - b.year);
console.log("Employees sorted by year:", sortedByYear);



const someEmployees = data.filter(employee => employee.year > 2020)
    .filter(employee => employee.salary > averageSalary);
console.log("Employees who joined after 2020 and have salaries over the average are:", someEmployees);