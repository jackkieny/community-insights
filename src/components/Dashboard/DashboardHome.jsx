import React from "react";

// Import CSS
import '../../styles/dashboard/dashboardHome.css'

function DashboardHome() {
    return (
        <div className='dbdhome-container'>

            {/* Coming Soon Sign */}
            {/* Delete Later */}
            <div className="dbdhome-coming-soon">
                <h1 style={{textDecoration: "underline", fontStyle: "italic"}}>METRICS PAGE</h1>
                <h1 style={{fontSize: "300%"}}>COMING SOON</h1>
            </div>
            {/* Delete Later */}

            <h1 className="temp-blur">Welcome to the Dashboard</h1>
            <p className="temp-blur">
                This is the home page of the dashboard. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis, quae quod quaerat veritatis quas ea.
            </p>
            
            {/* Metrics */}
            <div className="dbdhome-metrics-container">
                {/* MMR */}
                <div className="dbdhome-metric">
                    <h4 className="dbdhome-metric-title">MMR</h4>
                    <h1 className="dbdhome-metric-value">$69,420</h1>
                </div>
                {/* Member Growth */}
                <div className="dbdhome-metric">
                    <h4 className="dbdhome-metric-title">Member Growth</h4>
                    <h1 className="dbdhome-metric-value">
                        369
                    </h1>
                </div>
                {/* Engagement Rate */}
                <div className="dbdhome-metric">
                    <h4 className="dbdhome-metric-title">Engagement Rate</h4>
                    <h1 className="dbdhome-metric-value">
                        69%
                    </h1>
                </div>
                {/* Posts Published */}
                <div className="dbdhome-metric">
                    <h4 className="dbdhome-metric-title">Posts Published</h4>
                    <h1 className="dbdhome-metric-value">
                        420
                    </h1>
                </div>
                {/* Total Likes */}
                <div className="dbdhome-metric">
                    <h4 className="dbdhome-metric-title">Total Likes</h4>
                    <h1 className="dbdhome-metric-value">
                        69,420
                    </h1>
                </div>
                {/* Total Comments */}
                <div className="dbdhome-metric">
                    <h4 className="dbdhome-metric-title">Total Comments</h4>
                    <h1 className="dbdhome-metric-value">
                        420,690
                    </h1>
                </div>
                {/* Top 10 */}
                <div className="dbdhome-metric dbdhome-metric-last">
                    <h4 className="dbdhome-metric-title">Top 10: Inactive Members</h4>
                    <h1 className="dbdhome-metric-value">

                    </h1>
                </div>
            </div>
        </div>
    );
}

export default DashboardHome;
