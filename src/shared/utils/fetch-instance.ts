export  const fetchInstance = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const defaultOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY!
        }
    };

    const finalOptions: RequestInit = {
        ...defaultOptions,
        ...options
    };

    try {
        const response = await fetch(url, finalOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        return await response.json() as T
    } catch (error) {
        console.error('Fetch error:', error)
        throw error
    }
};

