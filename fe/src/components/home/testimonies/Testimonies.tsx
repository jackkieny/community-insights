import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { Paper, Text, Title, Button, useMantineTheme, rem } from '@mantine/core';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import classes from './Testimonies.module.css';

interface CardProps {
    image: string;
    name: string;
    community: string;
    headline: string;
    quote: string;
}

function Card({ image, name, community, headline, quote }: CardProps) {
    return (
        <Paper
            shadow="md"
            p="xl"
            radius="md"
            style={{ backgroundImage: `url(${image})` }}
            className={classes.card}
        >
            <div>
                <Text className={classes.category} size="xs">
                    {community}
                </Text>
                <Title order={3} className={classes.title}>
                    {name}
                </Title>
                <Text className={classes.headline} size="lg">
                    {headline}
                </Text>
                <Text className={classes.quote} size="md">
                    {quote}
                </Text>
            </div>
            <Button variant="white" color="dark">
                Read article
            </Button>
        </Paper>
    );
}

const data = [
    {
        image:
            'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        name: 'Jack Warkick',
        community: 'Ecom Dojo',
        headline: 'Optimized Strategy with Community Insights',
        quote: 'Community Insights has completely changed how I manage my community since I’m able to view the most important data from my community that other platforms don’t provide. Because of this data I am able to create new and better ways of engaging with my members',

    },
    {
        image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
        name: "Samantha Klein",
        community: "Mindful Leaders Network",
        headline: "Invaluable for Community Growth",
        quote: "“Thanks to Community Insights, we’ve boosted member engagement tenfold. The platform gives us actionable data that helps shape our community’s growth strategy. I’ve never felt this connected to my members.”"
    },
    {
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
        name: "Liam Chen",
        community: "Startup Hub",
        headline: "Next-Level Community Management",
        quote: "“Community Insights is hands down the best tool I’ve used for community management. The real-time data and feedback give me insights into my members' interests and needs, allowing me to tailor events and discussions like never before.”"
    },
    {
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
        name: "Nina Martinez",
        community: "Fitness Nation",
        headline: "Perfect for Member Engagement",
        quote: "“This tool has transformed how I interact with our fitness community. Community Insights gives me a clear picture of what my members value, so I can craft posts and programs that they actually care about.”"
    },
    {
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
        name: "Michael Zhao",
        community: "Tech Innovators Guild",
        headline: "A Game Changer for Digital Communities",
        quote: "“Since using Community Insights, our events are consistently better attended and more engaging. The data analytics help us to understand what’s working and where we can improve. I can’t imagine managing our group without it!”"
    },
    {
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
        name: "Rachel Simmons",
        community: "Wellness Warriors",
        headline: "Seamless Member Interaction and Growth",
        quote: "“Community Insights provides an in-depth look at our members’ engagement patterns, which has helped us personalize content and encourage meaningful participation. Our community has never been more active!”"
    }
];

export function Testimonies() {
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const slides = data.map((item) => (
        <Carousel.Slide key={item.name}>
            <Card {...item} />
        </Carousel.Slide>
    ));

    return (
        <div className={classes.container}>
            <Carousel
                slideSize={{ base: '100%', sm: '50%' }}
                slideGap={{ base: rem(2), sm: 'xl' }}
                align="start"
                slidesToScroll={mobile ? 1 : 2}
                nextControlIcon={<IconArrowRight className={classes.controlIcon}/>}
                previousControlIcon={<IconArrowLeft className={classes.controlIcon} />}
            >
                {slides}
            </Carousel>
        </div>
    );
}