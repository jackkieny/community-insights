import { Text } from '@mantine/core';
import classes from './Stats.module.css';

const data = [
    {
        title: 'Community Owners',
        stats: '100+',
        description: 'use our tool'
    },
    {
        title: 'Members Managed',
        stats: '500,000+',
        description: 'across all communities'
    },
    {
        title: 'Retention Rate',
        stats: '5.6X',
        description: 'increase'
    },
];

export function Stats() {
    const stats = data.map((stat) => (
        <div key={stat.title} className={classes.stat}>
            <Text className={classes.count}>{stat.stats}</Text>
            <Text className={classes.title}>{stat.title}</Text>
            <Text className={classes.description}>{stat.description}</Text>
        </div>
    ));
    return <div className={classes.container}><div className={classes.root}>{stats}</div></div>;
}