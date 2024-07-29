// Poll Handlers

export const handlePollOptionsChange = (index, value, pollOptions, setPollOptions) => {
    const newPollOptions = [...pollOptions];
    newPollOptions[index] = value;
    setPollOptions(newPollOptions);
}

export const addPollOption = (pollOptions, setPollOptions, pollOptionCount, setPollOptionCount) => {
    if (pollOptions.length < 10){
        setPollOptions([...pollOptions, ""]);
        setPollOptionCount(pollOptionCount + 1);
    }
}

export const removePollOption = (index, pollOptions, setPollOptions, pollOptionCount, setPollOptionCount) => {
    if (pollOptionCount > 2) {
        const updatedPollOptions = pollOptions.filter((_, i) => i !== index);
        setPollOptions(updatedPollOptions);
        setPollOptionCount(pollOptionCount - 1);
    }
}