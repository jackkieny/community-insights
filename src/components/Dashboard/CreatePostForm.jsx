import React, { useState } from "react";

// Import Styles
import "../../styles/dashboard/createPostForm.css";

// Import Icons
import { FaTrash } from "react-icons/fa";

function CreatePostForm({ closeForm }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const [dateTimeWarning, setDateTimeWarning] = useState(false);

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

    // Check Emtpty Fields
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
                    <div className="createpost-form-form-attachments-container">
                        <p>Link</p>
                        <p>Link</p>
                        <p>Link</p>
                        <p>Link</p>
                        <p>Link</p>
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
