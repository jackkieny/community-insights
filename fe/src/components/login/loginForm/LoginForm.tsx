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
import { useEffect, useState } from 'react';

export function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageVisible, setErrorMessageVisible] = useState(false);

    const handleRegisterButtonClicked = () => { navigate('/register'); }
    const handleHomeButtonClicked = () => { navigate('/'); }

    // TODO: UseEffect to check if the user already has a session -> navigate to dashboard
    useEffect(() => {
        fetch('/api/session',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        ).then((response) => {
            if (response.ok) {
                navigate('/dashboard');
            }
        });
    }, []);

    const handleSubmit = (event: React.FormEvent<any>) => {
        event.preventDefault();

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        }).then((response) => {
            if (response.ok) {
                navigate('/dashboard');
            } else {
                response.json().then((data) => {
                    const errMsg = data.error;
                    setErrorMessage(errMsg);
                    setErrorMessageVisible(true);

                });
            }
        });
    }

    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form} radius={0} p={30}>
                <Group justify='left'>
                    <Button size='sm' color='gray' onClick={handleHomeButtonClicked}><IconHome /></Button>
                </Group>
                <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
                    Welcome back to<br />
                    <span className={classes.titleHighlight}>Community Insights</span>!
                </Title>

                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Email address"
                        placeholder="hello@mail.com"
                        size="md"
                        onChange={(e) => {
                            setEmail(e.currentTarget.value);
                            setErrorMessageVisible(false);
                        }}
                        {...errorMessageVisible ? { error: " " } : {}}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        mt="md"
                        size="md"
                        onChange={(e) => {
                            setPassword(e.currentTarget.value);
                            setErrorMessageVisible(false);
                        }}
                        {...errorMessageVisible ? { error: errorMessage } : {}}
                    />
                    <Button fullWidth mt="xl" size="md" onClick={handleSubmit} type="submit">
                        Login
                    </Button>
                </form>

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