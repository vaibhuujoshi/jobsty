import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Discover from "./pages/Discover";
import SavedJobs from "./pages/SavedJobs";
import { SavedJobsProvider } from "./context/SavedJobsContext";
import { EnrichmentProvider } from "./context/EnrichmentContext";

function App() {
    return (
        <BrowserRouter>
            <SavedJobsProvider>
                <EnrichmentProvider>
                    <Routes>
                        <Route path="/" element={<Discover />} />
                        <Route path="/saved" element={<SavedJobs />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </EnrichmentProvider>
            </SavedJobsProvider>
        </BrowserRouter>
    );
}

export default App;