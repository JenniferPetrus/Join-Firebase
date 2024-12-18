/**
 * Base URL of the API.
 * @type {string}
 */
const STORAGE_URL = "https://joinlist-9f728-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Asynchronously stores a key-value pair in remote storage.
 * The data is sent as a JSON payload in a POST request to the storage API.
 *
 * @param {string} key - The key under which the value is stored.
 * @param {string|object} value - The value to store, which can be a string or any object (object must be serializable to JSON).
 * @returns {Promise<object>} A promise that resolves with the response from the storage API.
 * @async
 * @example
 * await setItem('user', JSON.stringify({ name: 'Jane Doe', email: 'jane.doe@example.com' }));
 */
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

/**
 * Asynchronously retrieves the value associated with a given key from remote storage.
 * The request is made by appending the key and token as query parameters to the GET request.
 *
 * @param {string} key - The key for which to retrieve the associated value.
 * @returns {Promise<string|object>} A promise that resolves with the value associated with the specified key.
 * @async
 * @example
 * const user = await getItem('user');
 */
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