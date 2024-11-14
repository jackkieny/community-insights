import { useEffect, useState } from 'react';
import { Center, Tooltip, UnstyledButton, Stack, rem, Image } from '@mantine/core';
import {
    IconHome2,
    IconGauge,
    IconDeviceDesktopAnalytics,
    IconFingerprint,
    IconCalendarStats,
    IconUser,
    IconSettings,
    IconLogout,
    IconSwitchHorizontal,
} from '@tabler/icons-react';
import classes from './Dashboard.module.css';
import logo from '../../assets/Blue-Transparent-logo.png'
import { useNavigate, Outlet } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { Logout } from './logout/Logout';

interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
                <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

const data = [
    { icon: IconHome2, label: 'Home' },
    { icon: IconGauge, label: 'Dashboard' },
    { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
    { icon: IconCalendarStats, label: 'Releases' },
    { icon: IconUser, label: 'Account' },
    { icon: IconFingerprint, label: 'Security' },
    { icon: IconSettings, label: 'Settings' },
];

export function Dashboard() {
    const navigate = useNavigate();
    const [active, setActive] = useState(0);
    const [opened, { open, close }] = useDisclosure(false);

    const links = data.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => {
                setActive(index);
                navigate(link.label.toLowerCase());
            }}
        />
    ));

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
            if (!response.ok) {
                navigate('/');
            }
        });
    }, []);

    return (
        <>
            <nav className={classes.navbar}>
                <Center>
                    <Image src={logo} w={100}/>
                </Center>

                <div className={classes.navbarMain}>
                    <Stack justify="center" gap={0}>
                        {links}
                    </Stack>
                </div>

                <Stack justify="center" gap={0}>
                    <NavbarLink icon={IconSwitchHorizontal} label="Change Community" onClick={() => {navigate('community')}}/>
                    <NavbarLink icon={IconLogout} label="Logout" onClick={open}/>
                </Stack>
            </nav>
            <div className={classes.content}>
                <main className={classes.main}>
                    <Outlet />
                </main>
            </div>

            <Logout opened={opened} onClose={close} />
        </>
    );
}