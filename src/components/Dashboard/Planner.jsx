import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import CreatePostForm from "./CreatePostForm";

// Import Styles
import "../../styles/dashboard/planner.css";
import "../../styles/dashboard/calendar.css";
import "../../styles/dashboard/createPostButton.css";
import "../../styles/dashboard/createPostForm.css";

import { FaPlus } from "react-icons/fa6";

const localizer = momentLocalizer(moment);

// Create New Post Button
function CreateNewPostButton({ openForm }) {

    const handleClick = (e) => { openForm(); }

    return (
        <div className="createpost-button-container">
            <button
                className="createpost-button"
                onClick={handleClick}
            >
                <FaPlus className="createpost-button-icon" />
            </button>
        </div>
    )
}

// Create Post Form
function Planner() {

    const [showCreatePostForm, setShowCreatePostForm] = useState(false);

    const OpenCreatePostForm = () => {
        setShowCreatePostForm(true);
    }

    const CloseCreatePostFrom = () => {
        setShowCreatePostForm(false);
    }

    return (
        <div className="dshbd-planner-container">
            <div style={{ textAlign: "center", fontSize: "3em" }}>Planner</div>
            <div className="dshbd-planner-cal-container">
                <div className="cal-container">
                    <CreateNewPostButton openForm={OpenCreatePostForm} />
                    {showCreatePostForm && <CreatePostForm closeForm={CloseCreatePostFrom} />}

                    <Calendar
                        localizer={localizer}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView="month"

                        events={[
                            {
                                title: "My event",
                                start: new Date(),
                                end: new Date(),
                            },
                        ]}
                    />
                </div>
            </div>


        </div >
    );
}

export default Planner;
