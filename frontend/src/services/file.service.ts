export class FileService {

baseUrl = 'http://localhost:3000/api';
token = localStorage.getItem("authToken");
headers = {
    Authorization: `Bearer ${this.token}`,
};

    async downloadFile(s3Key: string, filename: string) {
        const response = await fetch(`${this.baseUrl}/file/${s3Key}/download`, {headers: this.headers});
        if (!response.ok) {
            throw new Error('Download failed');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    }

    async findAll() {
        const response = await fetch(`${this.baseUrl}/file/all`, {headers: this.headers});

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Errore backend: ${response.status} - ${text}`);
        }

        const data = await response.json();
        return data;
    }

    async upload(file: File) {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${this.baseUrl}/file/upload`, {
                headers: this.headers,
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            console.log("Upload result:", result);
        } catch (error) {
            console.error("Upload error:", error);
        }
    }
}