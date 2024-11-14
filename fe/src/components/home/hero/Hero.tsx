import { Image, Container, Title, Button, Group, Text } from '@mantine/core';
import image from '../../../assets/hpjSkU2UYSU-unsplash.jpg';
import classes from './Hero.module.css';
import { GoArrowUpRight } from "react-icons/go";

export function Hero() {
    return (
        <Container size="xl">
            <div className={classes.inner}>
                <div className={classes.content}>
                    <Title className={classes.title}>
                        Grow & Manage<br/>
                        your<span className={classes.highlight}>Skool Community</span><br/>
                        with a single platform
                        
                    </Title>
                    <Text c="dimmed" mt="md">
                    Community engagement matters. Drastically improve your community member’s
                    experience by accessing an insightful analytics dashboard and post planning
                    calendar to automate your communities growth and management.
                    </Text>

                    <Group mt={30}>
                        <Button radius="xl" size="md" className={classes.control}>
                            Request Access <GoArrowUpRight className={classes.arrow}/>
                        </Button>
                    </Group>
                </div>
                <Image src={image} className={classes.image} />
            </div>
        </Container>
    );
}