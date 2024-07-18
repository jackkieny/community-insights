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

// General Link
export const handleGeneralLinkSelected = (generalLinkSelected, setGeneralLinkSelected) => {
    setGeneralLinkSelected(!generalLinkSelected);
};

export const insertGeneralLink = (GLDispayText, GLLinkAddress) => {
    return `[${GLDispayText}](${GLLinkAddress})`;
};
