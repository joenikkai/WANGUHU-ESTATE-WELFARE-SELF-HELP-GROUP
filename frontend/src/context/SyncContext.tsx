import { useState, useEffect } from 'react';

export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(window.navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}

type SyncItem = {
    id: string;
    action: string;
    payload: any;
    timestamp: number;
};

export function useOfflineSync() {
    const isOnline = useOnlineStatus();
    const [queue, setQueue] = useState<SyncItem[]>(() => {
        const saved = localStorage.getItem('sync_queue');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('sync_queue', JSON.stringify(queue));
    }, [queue]);

    const addToQueue = (action: string, payload: any) => {
        const newItem = { id: crypto.randomUUID(), action, payload, timestamp: Date.now() };
        setQueue(prev => [...prev, newItem]);
    };

    const rollbackItem = (id: string) => {
        setQueue(prev => prev.filter(item => item.id !== id));
    };

    useEffect(() => {
        if (isOnline && queue.length > 0) {
            console.log("System Online. Synchronizing changes...");
            // Simulated sync logic
            const sync = async () => {
                for (const item of queue) {
                    console.log(`Syncing ${item.action}...`, item.payload);
                    // Actual API calls would go here
                    // await axios.post(`/api/${item.action}`, item.payload);
                }
                setQueue([]);
                alert("All offline changes have been synchronized successfully.");
            };
            sync();
        }
    }, [isOnline, queue]);

    return { queue, addToQueue, rollbackItem };
}
