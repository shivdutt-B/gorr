const GetCookie = (name: string): string | null => {
    try {
        // Decode the cookie string to handle special characters
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');
        
        for (const cookie of cookies) {
            const [key, value] = cookie.trim().split('=');
            if (key === name) {
                return value;
            }
        }   
        return null;
    } catch (error) {
        return null;
    }
};

export default GetCookie;
