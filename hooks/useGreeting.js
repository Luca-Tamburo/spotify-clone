// Imports
import dayjs from 'dayjs';

const useGreeting = () => {
    const now = dayjs();
    const hour = now.hour();

    if (hour >= 0 && hour < 12) {
        return 'Good morning';
    } else if (hour >= 12 && hour < 18) {
        return 'Good afternoon';
    } else {
        return 'Good evening';
    }
}

export default useGreeting;
