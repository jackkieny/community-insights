import React, { useState } from "react";

// Import Actions Functions
import { handleActionButtonSelected } from "./CreatePostFormActions";

// Import Styles
import "../../styles/dashboard/createPostForm.css";

// Import Icons
import { FaTrash, FaPoll } from "react-icons/fa";  // Trash Icon, Poll Icon
import { TfiClip } from "react-icons/tfi"; // Paperclip Icon
import { IoMdLink } from "react-icons/io"; // Link Icon
import { FaYoutube, FaFaceSmileWink, FaBolt } from "react-icons/fa6"; // YouTube Icon, Emoji Icon, Bolt Icon
import { PiGifBold } from "react-icons/pi"; // GIF Icon

function CreatePostForm({ closeForm }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const [dateTimeWarning, setDateTimeWarning] = useState(false);
    const [actionButtonSelected, setActionButtonSelected] = useState(false);

    // Handle Form Changes
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };
    const handleContentChange = (e) => {
        setContent(e.target.value);
    };
    const handleDateChange = (e) => {
        setDate(e.target.value);
        checkDateTimeIsValid(e.target.value, time);
    };
    const handleTimeChange = (e) => {
        setTime(e.target.value);
        checkDateTimeIsValid(date, e.target.value);
    };

    // Check Empty Fields
    const checkEmptyFields = () => {
        if (title === "" || content === "" || date === "" || time === "") {
            return true;
        }
        return false;
    };

    // Check Date & Time
    const checkDateTimeIsValid = (date, time) => {
        const selectedDateTime = new Date(`${date}T${time}`);
        const futureDateTime = new Date();
        futureDateTime.setMinutes(futureDateTime.getMinutes() + 15);

        if (selectedDateTime < futureDateTime) {
            setDateTimeWarning(true);
            return false;
        } else {
            setDateTimeWarning(false);
        }
        return true;
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if Date & Time is valid
        if (!checkDateTimeIsValid(date, time)) {
            setDateTimeWarning(true);
            return;
        } else {
            setDateTimeWarning(false);
        }

        // Create Post
        const postData = {
            title: title,
            content: content,
            date: date,
            time: time,
        };

        if (title === "" || content === "" || date === "" || time === "") {
            alert("Please fill out all fields");
            return;
        }

        // Send Post Data to Server
        try {
            const response = await fetch("/api/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });

            // Check if Response is OK
            if (!response.ok) {
                throw new Error("Error Creating Post");
            }

            const result = await response.json();

            // Alert User if Post Created Successfully
            if (result.success) {
                alert("Post Created Successfully");
                closeForm();
            } else {
                alert("Error Creating Post");
            }

            // Catch Error
        } catch (error) {
            console.error("Error Creating Post: ", error);
        }
    };

    // Close Form
    const handleClose = (e) => {
        // Reset Form
        setTitle("");
        setContent("");
        setDate("");
        setTitle("");

        // Close Form
        closeForm();
    };

    return (
        <div className="createpost-form-container">
            <div className="createpost-form-content">
                {/* Close Button */}
                <div className="createpost-form-closebutton-container">
                    <button
                        className="createpost-form-closebutton-button"
                        onClick={handleClose}
                    >
                        <FaTrash className="createpost-form-closebutton-icon" />
                    </button>
                </div>

                {/* Form */}
                <div className="createpost-form-formcontainer">
                    {/* Title */}
                    <input
                        className="createpost-form-form-title"
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={handleTitleChange}
                    />

                    {/* Content */}
                    <textarea
                        className="createpost-form-form-content-textarea"
                        type="text"
                        encoding="UTF-8"
                        placeholder="Write something..."
                        value={content}
                        onChange={handleContentChange}
                    />

                    {/* Date, Time & Submit*/}
                    <div className="createpost-form-form-datetime-container">
                        <input
                            className="createpost-form-form-content-input"
                            type="date"
                            value={date}
                            onChange={handleDateChange}
                        />
                        <input
                            className="createpost-form-form-content-input"
                            type="time"
                            value={time}
                            onChange={handleTimeChange}
                        />
                        <button
                            className={
                                dateTimeWarning || checkEmptyFields
                                    ? "createpost-form-form-content-button createpost-form-form-content-button-warning"
                                    : "createpost-form-form-content-button"
                            }
                            onClick={handleSubmit}
                            disabled={dateTimeWarning || checkEmptyFields}
                        >
                            Create Post
                        </button>
                    </div>

                    {/* Attachments */}
                    <div className="createpost-form-form-attachments-container">
                        {/* File Attachment */}
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="File"
                        >
                            <TfiClip />
                        </div>
                        {/* General Link */}
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="Link"
                        >
                            <IoMdLink />
                        </div>
                        {/* YouTube/Vimeo/Loom */}
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="YouTube/Vimeo/Loom"
                        >
                            <FaYoutube />
                        </div>
                        {/* Poll */}
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="Poll"
                        >
                            <FaPoll />
                        </div>
                        {/* Complete Action */}
                        <div
                            className={actionButtonSelected ? "createpost-form-attachment-icon createpost-form-action-icon-selected" : "createpost-form-attachment-icon"}
                            onClick={() => handleActionButtonSelected(actionButtonSelected, setActionButtonSelected)}
                            data-tooltip="Action"
                        >
                            <FaBolt />
                        </div>
                        {/* Emoji */}
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="Emoji"
                        >
                            <FaFaceSmileWink />
                        </div>
                        {/* GIFs */}
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="GIFs"
                        >
                            <PiGifBold />
                        </div>
                    </div>
                </div>
            </div>
            {dateTimeWarning && (
                <div className="createpost-form-form-datetime-warning">
                    Date should be at least 15 minutes from now
                </div>
            )}
        </div>
    );
}

export default CreatePostForm;
