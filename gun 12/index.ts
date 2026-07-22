interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    city: string;
    [key: string]: unknown;
  };
}

interface UserTableRow {
  id: number;
  name: string;
  username: string;
  email: string;
  city: string;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

interface CreatePostPayload {
  title: string;
  body: string;
  userId: number;
}

interface UpdatePostPayload {
  title?: string;
  body?: string;
  userId?: number;
}

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

// 🚨 1. ÖZEL HATA SINIFI (Ödev gereksinimi: status taşıyan ApiError)
class ApiError extends Error {
  public status: number;
  public url: string;

  constructor(status: number, statusText: string, url: string) {
    super(`API Error: ${status} ${statusText} for URL: ${url}`);
    this.name = "ApiError";
    this.status = status;
    this.url = url;

    // TypeScript ES5/ES6 inheritance prototype zinciri düzeltmesi
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// 🌐 2. ORTAK HTTP İSTEK VE HATA KATMANI
async function apiRequest<T>(
  url: string,
  method: HttpMethod = "GET",
  body?: unknown
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    // Özel ApiError fırlatılıyor
    throw new ApiError(response.status, response.statusText, url);
  }

  return (await response.json()) as T;
}

async function apiGet<T>(url: string): Promise<T> {
  return apiRequest<T>(url, "GET");
}

async function getUsers(): Promise<void> {
  console.log("---STEP 1: Fetching Users Table---");
  const users = await apiGet<User[]>("https://jsonplaceholder.typicode.com/users");

  const userTable: UserTableRow[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    city: user.address.city,
  }));

  console.table(userTable);
}

async function getUserPostsWithComments(userId: number = 1): Promise<void> {
  console.log("---STEP 2: Fetching Posts and Comments---");
  const posts = await apiGet<Post[]>(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);

  for (const post of posts) {
    const comments = await apiGet<Comment[]>(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
    console.log(`[Post ID: ${post.id}] ${post.title}`);
    console.log(`   Comments count: ${comments.length}`);
    console.log(`   First Comment Preview: "${comments[0]?.body.substring(0, 40)}..."`);
  }
}

async function comparePerformance(userId: number = 1): Promise<void> {
  console.log("---STEP 3: Performance Benchmark---");
  const posts = await apiGet<Post[]>(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);

  const startSequential = performance.now();
  const sequentialResults: Comment[][] = [];
  for (const post of posts) {
    const comments = await apiGet<Comment[]>(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
    sequentialResults.push(comments);
  }
  const endSequential = performance.now();
  const sequentialDuration = (endSequential - startSequential).toFixed(2);
  console.log(`Sequential execution time: ${sequentialDuration} ms`);

  const startParallel = performance.now();
  const commentPromises: Promise<Comment[]>[] = posts.map((post) =>
    apiGet<Comment[]>(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`)
  );
  await Promise.all(commentPromises);
  const endParallel = performance.now();
  const parallelDuration = (endParallel - startParallel).toFixed(2);
  console.log(`Parallel execution time (Promise.all): ${parallelDuration} ms`);
}

async function createAndUpdatePost(): Promise<void> {
  console.log("---STEP 4: POST and PATCH---");

  const newPostData: CreatePostPayload = {
    title: "Typescript Internship Post",
    body: "Created using fetch POST method in TypeScript",
    userId: 1,
  };

  const createdPost = await apiRequest<Post>(
    "https://jsonplaceholder.typicode.com/posts",
    "POST",
    newPostData
  );
  console.log("POST Response (Newly Created Resource):", createdPost);

  const updateData: UpdatePostPayload = {
    title: "Updated TypeScript Title",
  };

  const updatedPost = await apiRequest<Post>(
    "https://jsonplaceholder.typicode.com/posts/1",
    "PATCH",
    updateData
  );
  console.log("PATCH Response (Partially Updated Resource):", updatedPost);
}

async function main(): Promise<void> {
  try {
    await getUsers();
    await getUserPostsWithComments();
    await comparePerformance();
    await createAndUpdatePost();

    console.log("\n--- STEP 5 Test: Triggering Custom Error ---");
    await apiGet<unknown>("https://jsonplaceholder.typicode.com/invalid_endpoint");
  } catch (error) {
    // Özel ApiError tip kontrolü
    if (error instanceof ApiError) {
      console.error(`Caught ApiError successfully! [Status: ${error.status}] Message: ${error.message}`);
    } else if (error instanceof Error) {
      console.error("Caught standard error:", error.message);
    } else {
      console.error("Unknown error occurred:", error);
    }
  }
}

main();