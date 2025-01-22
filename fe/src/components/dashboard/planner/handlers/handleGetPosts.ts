import { convertTimeToLocal } from "./handleConvertTime";
import { DateValue } from "@mantine/dates";

export async function handleGetPosts() {
    try {
        const response = await fetch('/api/getposts');
        const data = await response.json();

        const events = data.posts.map((post: { Title: string, Datetime: string }) => ({
            title: post.Title,
            allDay: false,
            start: convertTimeToLocal(post.Datetime as unknown as DateValue)
        }));

        return { events };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return { events: [] };
    }
}