const GetCookie = (name: string): string | null => {
    return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1] || null;
};

export default GetCookie;
