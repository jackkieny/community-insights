import React, { useState } from "react";

// Import Actions Functions
import {
    checkEmptyFields,
    checkDateTimeIsValid,
    handleActionButtonSelected,
    formatGeneralLink,
    handleFormToggle,
} from "./CreatePostFormUtils";

// Import Components
import GeneralLinks from "./PostFormComponents/GeneralLinks";
import EmojiKeyboard from "./PostFormComponents/EmojiKeyboard";

// Import Styles
import "../../styles/dashboard/createPostForm.css";

// Import Icons
import { FaTrash, FaPoll } from "react-icons/fa";  // Trash Icon, Poll Icon
import { TfiClip } from "react-icons/tfi"; // Paperclip Icon
import { IoMdLink } from "react-icons/io"; // Link Icon
import { FaYoutube, FaFaceSmileWink, FaBolt } from "react-icons/fa6"; // YouTube Icon, Emoji Icon, Bolt Icon
import { PiGifBold } from "react-icons/pi"; // GIF Icon

function CreatePostForm({ closeForm }) {
    // Content States
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    // General Link States
    const [GLDisplayText, setGLDisplayText] = useState("");
    const [GLLinkAddress, setGLLinkAddress] = useState("");
    // Form States
    const [dateTimeWarning, setDateTimeWarning] = useState(false);
    const [actionButtonSelected, setActionButtonSelected] = useState(false);
    const [openForm, setOpenForm] = useState(null);

    // Handle Form Changes
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        checkEmptyFields(title, content, date, time);
    };
    const handleContentChange = (e) => {
        setContent(e.target.value);
        checkEmptyFields(title, content, date, time);
    };
    const handleDateChange = (e) => {
        setDate(e.target.value);
        setDateTimeWarning(checkDateTimeIsValid(e.target.value, time));
        checkEmptyFields(title, content, date, time);
    };
    const handleTimeChange = (e) => {
        setTime(e.target.value);
        setDateTimeWarning(checkDateTimeIsValid(date, e.target.value));
        checkEmptyFields(title, content, date, time);
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
                                dateTimeWarning || checkEmptyFields(title, content, date, time)
                                    ? "createpost-form-form-content-button createpost-form-form-content-button-warning"
                                    : "createpost-form-form-content-button"
                            }
                            onClick={handleSubmit}
                            disabled={dateTimeWarning || checkEmptyFields(title, content, date, time)}
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
                            onClick={() => handleFormToggle("generalLink", openForm, setOpenForm)}
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
                            data-tooltip="Action"
                            onClick={() => handleActionButtonSelected(actionButtonSelected, setActionButtonSelected)}
                        >
                            <FaBolt />
                        </div>
                        {/* Emoji */}
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="Emoji"
                            onClick={() => handleFormToggle("emojiKeyboard", openForm, setOpenForm)}
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

                    {/*** Forms ***/}
                    {/* General Forms */}
                    {openForm === "generalLink" &&
                        <GeneralLinks
                            setGLDisplayText={setGLDisplayText}
                            setGLLinkAddress={setGLLinkAddress}
                            onSubmit={() => {
                                const newContent = formatGeneralLink(GLDisplayText, GLLinkAddress);
                                setContent(content + newContent);
                                handleFormToggle(null, openForm, setOpenForm);
                                setGLDisplayText("");
                                setGLLinkAddress("");
                            }}
                        />}
                    {/* Emoji Form */}
                    {openForm === "emojiKeyboard" &&
                        <EmojiKeyboard
                            setOpenForm={setOpenForm}
                            content={content}
                            setContent={setContent}
                        />
                    }
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
