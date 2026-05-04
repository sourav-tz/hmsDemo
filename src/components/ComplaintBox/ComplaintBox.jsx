import styles from './ComplaintBox.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Bug fix by Ravi: Bug 14 - Component was completely empty with no data fetching; hardcoded text shown in dashboard
const ComplaintBox = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        axios.get(import.meta.env.VITE_BASE_URL + '/HA/getComplaints', { withCredentials: true })
            .then(r => setComplaints(r.data.result || []))
            .catch(() => setComplaints([]));
    }, []);

    return <>
        <div className={styles.Container}>
            <div className={styles.titleArea}>
                <h3>Complaints</h3>
            </div>
            <div className={styles.contentArea}>
                {/* Bug fix by Ravi: Bug 14 - Show real complaint data instead of empty/hardcoded state */}
                {complaints.length === 0 ? (
                    <p>No complaints</p>
                ) : (
                    <p>{complaints.length} complaint(s)</p>
                )}
            </div>
        </div>
    </>
}

export default ComplaintBox;
