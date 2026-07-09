import { readFile } from 'fs/promises';

type Role = 'admin' | 'developer' | 'intern';

interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
}

interface Admin {
type: 'admin';
permissions: string[];
}

interface Developer {
type: 'developer';
permissions: string[];
}

interface Intern {
    type: 'intern';
    permissions: string[];
}


function filterByRole <T extends User> (users: T[], role: Role): T[] {
    return users.filter(user => user.role === role);
}


async function readAndFilterUsers(filePath: string, selectedRole: Role) {
    try {
        const data = await readFile(filePath, 'utf-8');

        const users = JSON.parse(data);

        const filteredResult = filterByRole(users, selectedRole);

        console.log(`--- ${selectedRole} ---`);
        console.log(JSON.stringify(filteredResult, null, 2));
    }
    catch (error) {
        console.error("Error! File could not be found or JSON format is wrong.")
    }
}

// Call the function with your file name and the role you want to filter by
readAndFilterUsers('./gun 1/users.json', 'developer');
readAndFilterUsers('./gun 1/users.json', 'intern');