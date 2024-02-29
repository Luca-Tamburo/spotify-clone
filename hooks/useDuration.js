const useDuration = () => (durationMs) => {
    const hours = Math.floor(durationMs / 3600000);
    const minutes = Math.floor((durationMs % 3600000) / 60000);
    const seconds = Math.floor(((durationMs % 3600000) % 60000) / 1000);

    if (hours > 0) {
        return `${hours} hr ${minutes} min`;
    } else {
        return `${minutes} min ${seconds} sec`;
    }
};

export default useDuration;
