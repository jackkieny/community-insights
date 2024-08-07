import React, { useState, useEffect } from "react";

import {
    checkEmptyFields,
    checkDateTimeIsValid,
    handleActionButtonSelected,
    formatGeneralLink,
    handleFormToggle,
} from "../../utils/generalHandlers";
import { handlePollOptionsChange, addPollOption, removePollOption } from "../../utils/pollStateHandlers";
import { handleCreatePost } from "../../utils/createPostHandler";

import GeneralLinks from "./PostFormComponents/GeneralLinks";
import EmbeddedLinks from "./PostFormComponents/EmbeddedLinks";
import EmojiKeyboard from "./PostFormComponents/EmojiKeyboard";
import GiphyGrid from "./PostFormComponents/GiphyGrid";

import "../../styles/dashboard/createPostForm.css";
import "../../styles/dashboard/postFormComponentsStyles/attachmentPreview.css";

import { FaTrash, FaPoll } from "react-icons/fa";  // Trash Icon, Poll Icon
import { TfiClip } from "react-icons/tfi"; // Paperclip Icon
import { IoMdLink } from "react-icons/io"; // Link Icon
import { FaYoutube, FaFaceSmileWink, FaBolt } from "react-icons/fa6"; // YouTube Icon, Emoji Icon, Bolt Icon
import { PiGifBold } from "react-icons/pi"; // GIF Icon
import { IoCloseCircle } from "react-icons/io5"; // Close "X" Icon

function CreatePostForm({ closeForm }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [videoLinks, setVideoLinks] = useState([]);
    const [videoIFrames, setVideoIFrames] = useState([]);
    const [GLDisplayText, setGLDisplayText] = useState("");
    const [GLLinkAddress, setGLLinkAddress] = useState("");
    const [dateTimeWarning, setDateTimeWarning] = useState(false);
    const [actionButtonSelected, setActionButtonSelected] = useState(false);
    const [openForm, setOpenForm] = useState(null);
    const [openPollForm, setOpenPollForm] = useState(false);
    const [pollOptionCount, setPollOptionCount] = useState(3);
    const [pollOptions, setPollOptions] = useState([]);
    const [labels, setLabels] = useState([]);
    const [selectedLabel, setSelectedLabel] = useState("");

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

    useEffect(() => {
        const fetchLabels = async () => {
            const response = await fetch("/api/get-labels", {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            }); 
            const data = await response.json();
            setLabels(data.labels);

        };
        fetchLabels();
    }, [openForm]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Temporary solution to handle the action button
        const attachments = "";

        handleCreatePost(date, time, actionButtonSelected, attachments, content, selectedLabel, title, videoLinks);
        handleClose();
    };

    const handleClose = (e) => {
        setTitle("");
        setContent("");
        setDate("");
        setTime("");
        setVideoLinks([]);
        setVideoIFrames([]);
        setGLDisplayText("");
        setGLLinkAddress("");
        setDateTimeWarning(false);
        setActionButtonSelected(false);
        setOpenForm(null);
        setOpenPollForm(false);
        setPollOptions([]);
        setPollOptionCount(3);
        setLabels([]);
        setSelectedLabel("");

        closeForm();
    };

    return (
        <div className="createpost-form-container">
            <div className="createpost-form-content">
                <div className="createpost-form-closebutton-container">
                    <button
                        className="createpost-form-closebutton-button"
                        onClick={handleClose}
                    >
                        <FaTrash className="createpost-form-closebutton-icon" />
                    </button>
                </div>

                <div className="createpost-form-formcontainer">
                    <input
                        className="createpost-form-form-title"
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={handleTitleChange}
                    />

                    <div className="createpost-form-form-content">
                        <textarea
                            className="createpost-form-form-content-textarea"
                            type="text"
                            encoding="UTF-8"
                            placeholder="Write something..."
                            value={content}
                            onChange={handleContentChange}
                        />
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
                                                onChange={(e) => handlePollOptionsChange(index, e.target.value, pollOptions, setPollOptions)}
                                            />
                                            {pollOptionCount > 2 && (
                                                <button
                                                    className="createpost-form-poll-removeoption-button"
                                                    onClick={() => removePollOption(index, pollOptions, setPollOptions, pollOptionCount, setPollOptionCount)}
                                                ><IoCloseCircle />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <button
                                        className="createpost-form-form-polls-remove-button"
                                        onClick={() => {
                                            setOpenPollForm(false);
                                            setPollOptions([])
                                            setPollOptionCount(3);
                                        }}
                                    >Remove</button>
                                    {pollOptionCount < 10 &&
                                        <button
                                            className="createpost-form-form-poll-addoption-button"
                                            onClick={() => addPollOption(pollOptions, setPollOptions, pollOptionCount, setPollOptionCount)}
                                        >Add Option</button>
                                    }
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="createpost-form-form-datetime-container">
                        {labels &&
                            <select
                                className="createpost-form-form-content-labels"
                                value={selectedLabel}
                                onChange={(e) => setSelectedLabel(e.target.value)}
                            >
                                <option value="" disabled>Select a label</option>
                                {labels.map((label) => (
                                    <option
                                        key={label.id}
                                        value={label.id}
                                    >{label.display_name}</option>
                                ))}
                            </select>
                        }
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
                            disabled={dateTimeWarning || checkEmptyFields(title, content, date, time) || selectedLabel === ""}
                        >
                            Create Post
                        </button>
                    </div>

                    <div className="createpost-form-form-attachments-container">
                        <div
                            className="createpost-form-attachment-icon"
                            style={{ cursor: "not-allowed" }}
                            data-tooltip="File"
                        // DISABLED
                        >
                            <TfiClip />
                        </div>
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="Link"
                            style={openForm === "generalLink" ? { color: "#669bbc" } : {}}
                            onClick={() => handleFormToggle("generalLink", openForm, setOpenForm)}
                        >
                            <IoMdLink />
                        </div>
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="YouTube/Vimeo/Loom"
                            style={openForm === "embeddedLink" ? { color: "#FF0000" } : {}}
                            onClick={() => handleFormToggle("embeddedLink", openForm, setOpenForm)}
                        >
                            <FaYoutube />
                        </div>
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="Poll"
                            style={openPollForm ? { color: "#29a1d3" } : {}}
                            onClick={() => {
                                setPollOptions(["", "", ""])
                                setOpenPollForm(true);
                            }}
                        >
                            <FaPoll />
                        </div>
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="Action"
                            style={actionButtonSelected ? { color: "#ef233c" } : {}}
                            onClick={() => handleActionButtonSelected(actionButtonSelected, setActionButtonSelected)}
                        >
                            <FaBolt />
                        </div>
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="Emoji"
                            style={openForm === "emojiKeyboard" ? { color: "#ffde34" } : {}}
                            onClick={() => handleFormToggle("emojiKeyboard", openForm, setOpenForm)}
                        >
                            <FaFaceSmileWink />
                        </div>
                        <div
                            className="createpost-form-attachment-icon"
                            data-tooltip="GIFs"
                            // DISABLED
                            style={{ cursor: "not-allowed" }}
                        // onClick={() => handleFormToggle("gifs", openForm, setOpenForm)}
                        >
                            <PiGifBold />
                        </div>
                    </div>

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
                    {openForm === "embeddedLink" &&
                        <EmbeddedLinks
                            videoLinks={videoLinks}
                            setVideoLinks={setVideoLinks}
                            videoIFrames={videoIFrames}
                            setVideoIFrames={setVideoIFrames}
                            onSubmit={() => {
                                handleFormToggle(null, openForm, setOpenForm);
                            }}
                        />
                    }
                    {openForm === "emojiKeyboard" &&
                        <EmojiKeyboard
                            setOpenForm={setOpenForm}
                            content={content}
                            setContent={setContent}
                        />
                    }
                    {openForm === "gifs" &&
                        <GiphyGrid />
                    }

                    {openForm === null && videoLinks.length > 0 &&
                        <div className="createpost-attachmentpreview-container">
                            {videoIFrames.map((videoIFrame, index) => (
                                <div key={index} className="createpost-attachment-preview">
                                    {videoIFrame.includes("iframe") ? (
                                        <div className="createpost-attachment-iframe-container">
                                            <div dangerouslySetInnerHTML={{ __html: videoIFrame }}></div>
                                        </div>
                                    ) : (
                                        <div>no iframe</div>
                                    )}
                                    <button
                                        className="createpost-attachment-preview-remove"
                                        onClick={() => {
                                            const newVideoIFrames = videoIFrames.filter((_, i) => i !== index);
                                            setVideoIFrames(newVideoIFrames);
                                            const newVideoLinks = videoLinks.filter((_, i) => i !== index);
                                            setVideoLinks(newVideoLinks);
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
