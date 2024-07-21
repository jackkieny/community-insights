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
import EmbeddedLinks from "./PostFormComponents/EmbeddedLinks";
import EmojiKeyboard from "./PostFormComponents/EmojiKeyboard";

// Import Styles
import "../../styles/dashboard/createPostForm.css";
import "../../styles/dashboard/postFormComponentsStyles/attachmentPreview.css";

// Import Icons
import { FaTrash, FaPoll } from "react-icons/fa";  // Trash Icon, Poll Icon
import { TfiClip } from "react-icons/tfi"; // Paperclip Icon
import { IoMdLink } from "react-icons/io"; // Link Icon
import { FaYoutube, FaFaceSmileWink, FaBolt } from "react-icons/fa6"; // YouTube Icon, Emoji Icon, Bolt Icon
import { PiGifBold } from "react-icons/pi"; // GIF Icon
import { IoCloseCircle } from "react-icons/io5"; // Close "X" Icon

function CreatePostForm({ closeForm }) {
    // Content States
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [attachments, setAttachments] = useState([]);
    // General Link States
    const [GLDisplayText, setGLDisplayText] = useState("");
    const [GLLinkAddress, setGLLinkAddress] = useState("");
    // Form States
    const [dateTimeWarning, setDateTimeWarning] = useState(false);
    const [actionButtonSelected, setActionButtonSelected] = useState(false);
    const [openForm, setOpenForm] = useState(null);
    // Polls
    const [openPollForm, setOpenPollForm] = useState(false);
    const [pollOptionCount, setPollOptionCount] = useState(3);
    const [pollOptions, setPollOptions] = useState(["", "", ""]);

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

    // Handle Poll Changes
    const handlePollOptionsChange = (index, value) => {
        const updatedOptions = [...pollOptions];
        updatedOptions[index] = value;
        setPollOptions(updatedOptions);
    };

    const addPollOption = () => {
        if (pollOptionCount < 10) {
            setPollOptions([...pollOptions, ""]);
            setPollOptionCount(pollOptionCount + 1);
        }
    };

    const removePollOption = (index) => {
        if (pollOptionCount > 2) {
            const updatedPollOptions = pollOptions.filter((_, i) => i !== index);
            setPollOptions(updatedPollOptions);
            setPollOptionCount(pollOptionCount - 1);
        }
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

                    {/* Content & Polls */}
                    <div className="createpost-form-form-content">
                        {/* Post Content */}
                        <textarea
                            className="createpost-form-form-content-textarea"
                            type="text"
                            encoding="UTF-8"
                            placeholder="Write something..."
                            value={content}
                            onChange={handleContentChange}
                        />
                        {/* Polls */}
                        {openPollForm && (
                            <div className="createpost-form-form-content-polls">
                                <div className="createpost-form-form-content-poll-container">
                                    {pollOptions.map((option, index) =>
                                        <div key={index} className="createpost-form-form-poll-item">
                                            <input
                                                className="createpost-form-poll-input"
                                                type="text"
                                                placeholder={`Option ${index + 1}`}
                                                value={option}
                                                onChange={(e) => handlePollOptionsChange(index, e.target.value)}
                                            />
                                            {pollOptionCount > 2 && (
                                                <button className="createpost-form-poll-removeoption-button" onClick={() => removePollOption(index)}><IoCloseCircle /></button>
                                            )}
                                        </div>
                                    )}
                                    <button className="createpost-form-form-polls-remove-button" onClick={() => setOpenPollForm(false)}>Remove</button>
                                    {pollOptionCount < 10 && <button className="createpost-form-form-poll-addoption-button" onClick={addPollOption}>Add Option</button>}
                                </div>
                            </div>
                        )}

                    </div>

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
                            style={openForm === "generalLink" ? { color: "#669bbc" } : {}}
                            onClick={() => handleFormToggle("generalLink", openForm, setOpenForm)}
                        >
                            <IoMdLink />
                        </div>
                        {/* YouTube/Vimeo/Loom */}
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="YouTube/Vimeo/Loom"
                            style={openForm === "embeddedLink" ? { color: "#FF0000" } : {}}
                            onClick={() => handleFormToggle("embeddedLink", openForm, setOpenForm)}
                        >
                            <FaYoutube />
                        </div>
                        {/* Poll */}
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="Poll"
                            style={openPollForm ? { color: "#29a1d3" } : {}}
                            onClick={() => setOpenPollForm(true)}
                        >
                            <FaPoll />
                        </div>
                        {/* Complete Action */}
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="Action"
                            style={actionButtonSelected ? { color: "#ef233c" } : {}}
                            onClick={() => handleActionButtonSelected(actionButtonSelected, setActionButtonSelected)}
                        >
                            <FaBolt />
                        </div>
                        {/* Emoji */}
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="Emoji"
                            style={openForm === "emojiKeyboard" ? { color: "#ffde34" } : {}}
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
                    {/* Embedded Links */}
                    {openForm === "embeddedLink" &&
                        <EmbeddedLinks
                            attachments={attachments}
                            setAttachments={setAttachments}
                            onSubmit={() => {
                                handleFormToggle(null, openForm, setOpenForm);
                            }}
                        />
                    }
                    {/* Emoji Form */}
                    {openForm === "emojiKeyboard" &&
                        <EmojiKeyboard
                            setOpenForm={setOpenForm}
                            content={content}
                            setContent={setContent}
                        />
                    }

                    {/* Attachement Previews */}
                    {openForm === null && attachments.length > 0 &&
                        <div className="createpost-attachmentpreview-container">
                            {/* Map Attachment Preview */}
                            {attachments.map((attachment, index) => (
                                <div key={index} className="createpost-attachment-preview">
                                    {attachment.includes("iframe") ? (
                                        <div className="createpost-attachment-iframe-container">
                                            <div dangerouslySetInnerHTML={{ __html: attachment }}></div>
                                        </div>
                                    ) : (
                                        <div>no iframe</div>
                                    )}
                                    {/* Close Button */}
                                    <button
                                        className="createpost-attachment-preview-remove"
                                        onClick={() => {
                                            const newAttachments = attachments.filter((_, i) => i !== index);
                                            setAttachments(newAttachments);
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
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
