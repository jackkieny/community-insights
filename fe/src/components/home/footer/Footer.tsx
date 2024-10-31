import { Image, Text, Container, ActionIcon, Group, rem } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
import CommunityInsightsLogo from '../../../assets/full-logo-transparent.png'
import classes from './Footer.module.css';

const data = [
    {
        title: 'About',
        links: [
            { label: 'How It Works', link: '#' },
            { label: 'Pricing & Benefits', link: '#' },
            { label: 'Use Case', link: '#' },
            { label: 'Blogs', link: '#' },
        ],
    },
    {
        title: 'Social',
        links: [
            { label: 'Skool Community', link: '#' },
            { label: 'Instagram', link: '#' },
            { label: 'Facebook', link: '#' },
            { label: 'Twitter', link: '#' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Terms', link: '#' },
            { label: 'Privacy', link: '#' },
        ],
   },
];

export function Footer() {
    const groups = data.map((group) => {
        const links = group.links.map((link, index) => (
            <Text<'a'>
                key={index}
                className={classes.link}
                component="a"
                href={link.link}
                onClick={(event) => event.preventDefault()}
            >
                {link.label}
            </Text>
        ));

        return (
            <div className={classes.wrapper} key={group.title}>
                <Text className={classes.title}>{group.title}</Text>
                {links}
            </div>
        );
    });

    return (
        <footer className={classes.footer}>
            <Container className={classes.inner}>
                <div className={classes.logo}>
                    <Image w={200} src={CommunityInsightsLogo} />
                    <Text size="xs" c="dimmed" className={classes.description}>
                        Grow & manage your Skool Community with a single platform
                    </Text>
                </div>
                <div className={classes.groups}>{groups}</div>
            </Container>
            <Container className={classes.afterFooter}>
                <Text c="dimmed" size="sm">
                    © 2024 communityinsights.io. All rights reserved.
                </Text>

                <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
                    <ActionIcon size="lg" color="gray" variant="subtle">
                        <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon size="lg" color="gray" variant="subtle">
                        <IconBrandYoutube style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon size="lg" color="gray" variant="subtle">
                        <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </Container>
        </footer>
    );
}