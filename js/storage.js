const STORAGE_URL = "https://joinlist-9f728-default-rtdb.europe-west1.firebasedatabase.app";

async function setItem(key, value) {
    const url = `${STORAGE_URL}/${key}.json`;
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value)
        });
        return await response.json();
    } catch (error) {
        console.error("Error saving data to Firebase:", error);
        throw error;
    }
}

async function getItem(key) {
    const url = `${STORAGE_URL}/${key}.json`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data !== null) {
            localStorage.setItem(key, JSON.stringify(data)); 
        }
        return data;
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten von Firebase:", error);
        const localValue = localStorage.getItem(key);
        if (localValue !== null) {
            return JSON.parse(localValue);
        }
        
        throw new Error("Daten konnten weder aus Firebase noch aus Local Storage geladen werden.");
    }
}