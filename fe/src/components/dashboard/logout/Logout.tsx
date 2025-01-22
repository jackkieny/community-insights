import { Modal, Button, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export function Logout({ opened, onClose }: { opened: boolean, onClose: () => void }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).then((response) => {
            if (response.ok) {
                onClose();
                navigate('/login')
            } 
            else (
                fetch('/api/session', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }).then((response) => {
                    if (!response.ok) {
                        navigate('/');
                    }
                })
            )
        })
    }

    return (
        <>
            <Modal
                opened={opened}
                onClose={onClose}
                title="Logout"
                overlayProps={{
                    backgroundOpacity: 0.5,
                    blur: 1,
                }}
            >
                Are you sure you want to log out?
                <Group justify="center" p={10}>
                    <Button onClick={onClose} variant="light" color="gray">Cancel</Button>
                    <Button onClick={handleLogout}>Log Out</Button>
                </Group>
            </Modal>
        </>
    );
}
