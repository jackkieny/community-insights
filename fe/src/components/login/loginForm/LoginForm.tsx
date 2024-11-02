import {
    Paper,
    TextInput,
    PasswordInput,
    Button,
    Title,
    Text,
    Anchor,
    Group,
} from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import classes from './LoginForm.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegisterButtonClicked = () => { navigate('/register'); }
    const handleHomeButtonClicked = () => { navigate('/'); }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        }).then((response) => {
            if (response.ok) {
                console.log('Login successful');
            } else {
                console.log('Login unsuccessful');
            }
        });
    }

    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form} radius={0} p={30} onSubmit={handleSubmit}>
                <Group justify='left'>
                    <Button size='sm' color='gray' onClick={handleHomeButtonClicked}><IconHome /></Button>
                </Group>
                <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
                    Welcome back to<br />
                    <span className={classes.titleHighlight}>Community Insights</span>!
                </Title>

                <TextInput
                    label="Email address"
                    placeholder="hello@gmail.com"
                    size="md"
                    onChange={(e) => setEmail(e.currentTarget.value)}
                />
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    mt="md"
                    size="md"
                    onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <Button fullWidth mt="xl" size="md" onClick={handleSubmit}>
                    Login
                </Button>

                <Text ta="center" mt="md">
                    Don&apos;t have an account?{' '}
                    <Anchor<'a'> href="#" fw={700} onClick={handleRegisterButtonClicked}>
                        Register
                    </Anchor>
                </Text>
            </Paper>
        </div>
    );
}