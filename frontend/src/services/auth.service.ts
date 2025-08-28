export class AuthService {

    baseUrl = 'http://localhost:3000/api';

    async login(username: string, password: string) {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) throw new Error("Credenziali errate");
        const data = await response.json();
        return data;
    }
}