import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Button,
  Container,
  SimpleGrid,
  Card,
  Image,
  Text,
  Group,
  Divider,
  LoadingOverlay
} from '@mantine/core';
import classes from './Community.module.css';
import { useEffect, useState } from 'react';
import { checkIfLoggedIn, loginToSkool, getCommunities } from './handler';

interface CommunityType {
  archived: boolean;
  role: string;
  id: string;
  name: string;
  displayname: string;
  totalmembers: number;
  totalposts: number;
  logourl: string;
  color: string;
}

export function Community() {

  const [refreshToggle, setRefreshToggle] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [skoolEmail, setSkoolEmail] = useState('');
  const [skoolPassword, setSkoolPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errorMsgVisible, setErrorMsgVisible] = useState(false);
  const [data, setData] = useState<CommunityType[]>([]);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setVisible(true);
      const resp = await checkIfLoggedIn();
      if (resp.loggedIn) {
        setIsLoggedIn(true);
        setSkoolEmail(resp.userEmail);
        const commData = await getCommunities();
        setData(commData.communities);
      } else {
        setIsLoggedIn(false);
      }
      setVisible(false);
    };

    fetchData();
  }, [refreshToggle])

  const availableCommunities = data.filter(community => !community.archived && community.role === 'group-admin');
  const unavailableCommunities = data.filter(community => community.archived || community.role !== 'group-admin');

  const renderCard = (community: CommunityType, isActive: boolean) => {
    return (
      <Card
        key={community.id}
        title={community.displayname}
        shadow='md'
        radius="md"
        padding="xl"
        withBorder
        className={classes.card}
        style={{
          borderColor: isActive ? community.color : undefined,
          cursor: isActive ? 'pointer' : 'not-allowed',
        }}
      >
        <Image
          src={community.logourl}
          alt={community.displayname}
          w={50}
          style={{ filter: isActive ? 'none' : 'grayscale(100%)' }}
        />
        <Title mt={10} ta="left" order={3}> {community.displayname} </Title>
        <Group
          justify='space-between'
          pt={10}
          style={{ display: isActive ? undefined : 'none' }}
        >
          <Text mt={5} ta="left"> {community.totalmembers} members </Text>
          <Text mt={5} ta="left"> {community.totalposts} posts</Text>
        </Group>
      </Card>
    )
  };

  return (
    <>
      <Paper
        withBorder
        shadow='md'
        radius="sm"
        w={420}
        p={25}
        className={classes.login_pannel}
      >
        <Title ta="center" className={classes.title}>
          Login to
          <br />
          <span className={classes.skool_S}>S</span>
          <span className={classes.skool_K}>k</span>
          <span className={classes.skool_O}>o</span>
          <span className={classes.skool_o}>o</span>
          <span className={classes.skool_L}>l</span>
        </Title>

        <Container p={10} mt={30} >
          <TextInput
            label="Email"
            {...isLoggedIn ? { 
              disabled: true,
              placeholder: skoolEmail
            } : {
              required: true,
              disabled: false,
              placeholder: "hello@skool.com",
              ...errorMsgVisible ? { error: " "} : {}
            }}
            onChange={(e) => {
              setSkoolEmail(e.target.value);
              setErrorMsgVisible(false);
            }}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            onChange={(e) => {
              setSkoolPassword(e.target.value)
              setErrorMsgVisible(false);
            }}
            style={isLoggedIn ? {display: "none"}: {}}
            {...errorMsgVisible ? { error: errorMsg} : {}}
          />
          <Button
            disabled={isLoggedIn ? true : false}
            fullWidth
            mt="xl"
            onClick={async () => {
              const err = await loginToSkool(skoolEmail, skoolPassword);
              console.log(err.errorMsg);
              if (err.errorMsg !== "") {
                setErrorMsg(err.errorMsg);
                setErrorMsgVisible(true);
              } else{
                setRefreshToggle(!refreshToggle);
              }
            }}
          >Connect Skool</Button>
        </Container>
        <Divider my="lg" />
        <Button fullWidth mt="md" onClick={async () => { 
          setVisible(true);
          await setRefreshToggle(!refreshToggle);
        }}>Refresh Communities</Button>
      </Paper>

      {/* TODO: Add title to the sections */}
      <div className={classes.grid_container}>
        <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        {isLoggedIn && <>
          <SimpleGrid className={classes.grid} cols={4}>
            {availableCommunities.map(community => renderCard(community, true))}
          </SimpleGrid>
          <Divider my="xl" className={classes.divider} />
          <SimpleGrid className={classes.grid} cols={4}>
            {unavailableCommunities.map(community => renderCard(community, false))}
          </SimpleGrid>
        </>
        }
      </div>
    </>
  );
}
