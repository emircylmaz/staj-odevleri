import { readFile } from "fs/promises";

interface Person {
    name: string;
    team: string;
    salary: number;
    year: number;
}


async function main() {
    let data: Person[] = [];

    try {
        const rawData = await readFile("./gun 2/calisanlar.json", "utf-8");
        data = JSON.parse(rawData) as Person[];
    } catch (error) {
        console.error("Dosya okunurken veya JSON ayristirilirkenrken hata olustu:", error);
        return;
    }

    if (data.length === 0) {
        console.log("Veri bulunamadi veya liste boş.");
        return;
    }

const itTeam = data.filter(employee => employee.team === "IT");
console.log("IT Team Employees:");
console.log(JSON.stringify(itTeam, null, 2));

const hrTeam = data.filter(employee => employee.team === "HR");
console.log("HR Team Employees:");
console.log(JSON.stringify(hrTeam, null, 2));

const engineeringTeam = data.filter(employee => employee.team === "Engineering");
console.log("Engineering Team Employees:");
console.log(JSON.stringify(engineeringTeam, null, 2));

const designTeam = data.filter(employee => employee.team === "Design");
console.log("Design Team Employees:");
console.log(JSON.stringify(designTeam, null, 2))


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
console.log("Employees sorted by year:", JSON.stringify(sortedByYear, null, 2));



const someEmployees = data.filter(employee => employee.year > 2020)
    .filter(employee => employee.salary > averageSalary);
console.log("Employees who joined after 2020 and have salaries over the average are:", JSON.stringify(someEmployees, null, 2));

}

main();