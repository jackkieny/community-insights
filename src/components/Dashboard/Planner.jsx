import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { loadScheduledPosts } from "../../utils/loadPlannerEventsUtils";

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
    const [posts, setPosts] = useState([]);

    const OpenCreatePostForm = () => setShowCreatePostForm(true);
    const CloseCreatePostFrom = () => setShowCreatePostForm(false);

    useEffect(() => {
        setTimeout(() => {
            const fetchPosts = async () => {
                await loadScheduledPosts(setPosts);
            }
            fetchPosts();
        }, 2000);
    }, [showCreatePostForm === false]);

    return (
        <div className="dshbd-planner-container">
            {/* Title */}
            <h1 className="dshbd-planner-title-container">Planner</h1>

            {/* Calendar */}
            <>
                <div className="cal-container">
                    {/* Post Button */}
                    <CreateNewPostButton openForm={OpenCreatePostForm} />

                    {/* Post Form */}
                    {showCreatePostForm && <CreatePostForm closeForm={CloseCreatePostFrom} />}

                    <Calendar
                        localizer={localizer}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView="month"

                        events={posts.map(post => ({
                            id: post._id,
                            title: post.data.title,
                            start: new Date(post.data.date + "T" + post.data.time),
                            end: new Date(post.data.date + "T" + post.data.time),
                            allDay: false
                        }))}
                    />
                </div>
            </>
        </div >
    );
}

export default Planner;
