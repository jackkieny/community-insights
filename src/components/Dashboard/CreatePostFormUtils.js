import React from "react";

// Check Empty Fields
export const checkEmptyFields = (title, content, date, time) => {
    if (title === "" || content === "" || date === "" || time === "") {
        return true;
    }
    return false;
};

// Check Date & Time is Valid
export const checkDateTimeIsValid = (date, time) => {
    const selectedDateTime = new Date(`${date}T${time}`);
    const futureDateTime = new Date();
    futureDateTime.setMinutes(futureDateTime.getMinutes() + 15);

    if (selectedDateTime < futureDateTime) {
        return true;
    }
    return false;
}

// Action Button Selected
export const handleActionButtonSelected = (actionButtonSelected, setActionButtonSelected) => {
    setActionButtonSelected(!actionButtonSelected);
};

// Form Toggle
export const handleFormToggle = (formName, openForm, setOpenForm) => {
    if (openForm === formName) {
        setOpenForm(null);
    } else {
        setOpenForm(formName);
    }
};

// Format General Link
export const formatGeneralLink = (GLDispayText, GLLinkAddress) => {
    return `[${GLDispayText}](${GLLinkAddress})`;
};
