import { readFile, writeFile } from 'fs/promises';

type Role = 'admin' | 'developer' | 'intern';

interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
}

const FILE_PATH = './gun 1/users.json';

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



async function readDatabase(): Promise<User[]> {
    try {
        const data = await readFile(FILE_PATH, 'utf-8');
        return JSON.parse(data) as User[];
    } catch (error) {
        return [];
    }
}

async function writeDatabase(users: User[]): Promise<void> {
    try {
        const jsonText = JSON.stringify(users, null, 2);
        await writeFile(FILE_PATH, jsonText, 'utf-8');
    } catch (error) {
        console.error("Failed to write on to the database file: ", error);
    }
}




async function deleteUser(id:number): Promise<string> {
    const users = await readDatabase();
    const updatedUsers = users.filter(user => user.id !== id);

    if (updatedUsers.length === users.length) {
        console.log(`Delete failed: User with ID ${id} not found.`);
        return "User not found";
    }

    await writeDatabase(updatedUsers);
    console.log(`Deleted user with ID: ${id}`);
    return "User deleted successfully";
}

async function createUser(newUserData: Omit<User, 'id'>): Promise<User | string> {
    const users = await readDatabase();

    const emailExists = users.some(user => user.email === newUserData.email);
    if (emailExists) {
        console.log(`User with email ${newUserData.email} already exists.`);
        return "Email already exists";
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    const newUser: User = {
    id: newId,
     ...newUserData };
    
     users.push(newUser);
    await writeDatabase(users);
    console.log(`Created user: ${newUser.name} with ID: ${newUser.id}`);
    return newUser;
}

async function updateUser(id: number, updates: Partial<Omit<User, 'id'>>): Promise<User | string> {
    const users = await readDatabase();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        console.log(`Update failed: User with ID ${id} not found.`);
        return "User not found";
    }

    users[userIndex] = {
        ...users[userIndex],
        ...updates
    };

    await writeDatabase(users);
    console.log(`Updated user with ID: ${id}`);
    return users[userIndex];
}




async function testDatabase() {
    // These operations will now happen completely silently in the background
    await createUser({ name: "Ahmet1", email: "ahmet1@test.com", role: "admin" });
    await createUser({ name: "Emir1", email: "emir1@test.com", role: "intern" });
    await updateUser(1, { role: "admin" });
    await deleteUser(2);

    // ONLY print once right here at the end to see the final result!
    const finalUsers = await readDatabase();
    console.log("=== FINAL DATABASE STATE ===");
    console.log(JSON.stringify(finalUsers, null, 2));
}

testDatabase();