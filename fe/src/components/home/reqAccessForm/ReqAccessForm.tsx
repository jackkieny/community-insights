import { 
    Container,
    Title,
    Button,
    Group,
    Text,
    List,
    ThemeIcon,
    rem,
    SimpleGrid,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import classes from './ReqAccessForm.module.css';
import { TextInputs } from './TextInputs';

export function ReqAccessForm() {

    return (
        <Container size="xl">
            <div className={classes.inner}>
                <div className={classes.content}>
                    <Title className={classes.title}>
                        Access <span className={classes.highlight}>Community Insights</span>
                    </Title>
                    <Text c="dimmed" mt="md">
                        The Community Management Tool Built by Community Owners for Community Owners
                    </Text>

                    <List
                        mt={30}
                        spacing="sm"
                        size="sm"
                        icon={
                            <ThemeIcon size={20} radius="xl">
                                <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                            </ThemeIcon>
                        }
                    >
                        <List.Item>
                            <b>Improve engagement. Increase user retention by utilising insights</b>
                        </List.Item>
                        <List.Item>
                            <b>Utilise insights to improve and evolve your marketing and sales campaigns</b>
                        </List.Item>
                        <List.Item>
                            <b>Save time. No more late nights managing your community</b>
                        </List.Item>
                        <List.Item>
                            <b>Build loyalty. Use insights to improve your communities products and services</b>
                        </List.Item>
                        <List.Item>
                            <b>Save costs on a full-time community manager</b>
                        </List.Item>
                    </List>
                </div>
                <form className={classes.form} onSubmit={(event) => event.preventDefault()}>
                    <Text fz="lg" fw={700} className={classes.inputTitle}> 
                        Provide us with some basic information about your community at its current stage.
                    </Text>

                    <div className={classes.fields}>
                        <SimpleGrid cols={{ base: 2, sm: 2 }}>
                            <TextInputs />
                        </SimpleGrid>


                        <Group justify="center" mt="md">
                            <Button w={200} type="submit" className={classes.control}>
                               Submit
                            </Button>
                        </Group>
                    </div>
                </form>
            </div>
        </Container>
    );
}
