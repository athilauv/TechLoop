const API_URL = "http://localhost:5264/Auth";


//LOGIN
export async function login(data: {
    email: string;
    password: string;
}) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || result.Success === false) {
        throw new Error(result.Message || "Something went wrong");
    }
    console.log(result);
    localStorage.setItem("accessToken", result.accessToken);
    return result;
}


//REGISTERATION
export async function register(data: {
    username: string;
    email: string;
    password: string;
}) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || result.Success === false) {
        throw new Error(result.Message || "Something went wrong");
    }

    return result;
}

// LOGOUT
export async function logout() {
    const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.Message || "Logout failed");
    }

    return result;
}