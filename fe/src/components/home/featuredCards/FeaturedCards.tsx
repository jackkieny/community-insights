import {
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconClipboardList, IconCalendarClock, IconTrendingUp} from '@tabler/icons-react';
import classes from './FeaturedCards.module.css';

const mockdata = [
  {
    title: 'View Actionable Insights',
    description:
      'With our comprehensive analytics dashboard, we help you make informed decisions quickly. No guesswork, just clear insights guiding your strategy.',
    icon: IconClipboardList,
  },
  {
    title: 'Plan & Schedule Posts',
    description:
      'Plan and schedule your posts so that you can spend more time on other valuable tasks within your community.',
    icon: IconCalendarClock,
  },
  {
    title: 'Maximize Member Engagement',
    description:
      'Acquiring new members cost 5x more than retaining existing ones so keep your members happy and boost your bottom line.',
    icon: IconTrendingUp,
  },
];

export function FeaturedCards() {
  const theme = useMantineTheme();
  const features = mockdata.map((feature) => (
    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
      <feature.icon
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={theme.colors.blue[6]}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Title order={2} className={classes.title} ta="center" mt="sm">
        Attract more members, serve them better and keep them longer
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Tired of having to guess what to do in order to maintain and grow the
        engagement of your community members?<br/>
        View everything you need in a centralised hub and stop wasting time.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}