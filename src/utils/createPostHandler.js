/*
Fields to be handled:
* date 
* time

* attachments (not yet implemented)
* content
* lable_id
* title
* video_links
* pollOptions
* actionButtonSelected

https://vimeo.com/987301460
https://www.loom.com/share/f975fff565c941d6a358e543dd79a483?sid=b65e5256-93d0-432d-8532-b8d2abb75013
https://youtu.be/OGO4M4iNXWs?si=ZEVbNmW1atYGh4Zp

*/
export const handleCreatePost = (
    date, time,
    actionButtonSelected,
    attachments,
    content,
    labels,
    title,
    video_links
) => {
    // console.log('date', date);
    // console.log('time', time);
    // console.log('actionButtonSelected', actionButtonSelected);
    // console.log('attachments', attachments);
    // console.log('content', content);
    // console.log('labels', labels);
    // console.log('title', title);
    // console.log('video_links', video_links);

    fetch("/api/post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            date,
            time,
            actionButtonSelected,
            attachments,
            content,
            labels,
            title,
            video_links,
        }),
    })
};