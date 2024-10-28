import { useState, useEffect } from 'react';

interface HistoryEntry {
    id: string;           // unique identifier, e.g., message ID
    text: string;         // the user’s input message
    date: string;         // timestamp in a string format (ISO or formatted)
    audioUrl: string;     // URL for the stored audio file
}

const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch the history data from your API
        const fetchHistory = async () => {
            try {
                const response = await fetch('/api/history');  // Adjust API path if needed
                const data: HistoryEntry[] = await response.json();
                setHistory(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="history-page">
            <h1>Message History</h1>
            {isLoading ? (
                <p>Loading history...</p>
            ) : (
                history.length ? (
                    history.map((entry) => (
                        <div key={entry.id} className="history-entry">
                            <p><strong>Date:</strong> {new Date(entry.date).toLocaleString()}</p>
                            <p><strong>Message:</strong> {entry.text}</p>
                            <audio controls src={entry.audioUrl}>
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ))
                ) : (
                    <p>No history available.</p>
                )
            )}
        </div>
    );
};

export default HistoryPage;
