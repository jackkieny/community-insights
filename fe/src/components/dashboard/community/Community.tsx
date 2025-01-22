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
  LoadingOverlay,
  Checkbox,
} from '@mantine/core';
import classes from './Community.module.css';
import { useEffect, useState } from 'react';
import { 
  checkIfLoggedIn,
  loginToSkool,
  getCommunities,
  handleSaveCommunity,
  handleRefreshCommunities,
} from './handler';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  const [refreshToggle, setRefreshToggle] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [skoolEmail, setSkoolEmail] = useState('');
  const [skoolPassword, setSkoolPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errorMsgVisible, setErrorMsgVisible] = useState(false);
  const [communities, setCommunities] = useState<CommunityType[]>([]);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityType | null>(null)
  const [currentCommunity, setCurrentCommunity] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      setLoadingVisible(true);

      fetch('/api/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      }).then(async (resp) => {
        if (!resp.ok) {
          navigate('/login');
        }
      });
      

      const loggedIn = await checkIfLoggedIn();
      if (!loggedIn.loggedIn) {
        setIsLoggedIn(false);
        setLoadingVisible(false);
        return;
      }

      setIsLoggedIn(true);
      setSkoolEmail(loggedIn.userEmail);

      const communitiesData = await getCommunities();
      setCommunities(communitiesData.communities);
      setCurrentCommunity(communitiesData.currentCommunity);
      setSelectedCommunity(communitiesData.communities.find((community: CommunityType) => community.id === communitiesData.currentCommunity));

      setLoadingVisible(false);
    };

    fetchData();
  }, [refreshToggle])

  const availableCommunities = communities.filter(community => !community.archived && community.role === 'group-admin');
  const unavailableCommunities = communities.filter(community => community.archived || community.role !== 'group-admin');

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
          border: isActive && community.id === selectedCommunity?.id ? `3px solid ${community.color}` :
            isActive && community.id !== selectedCommunity?.id ? `1px solid ${community.color}` : undefined,
        }}
        onClick={() => {
          if (isActive) {
            setSelectedCommunity(community);
          }
        }}
      >
        <Group justify='space-between'>
          <Image
            src={community.logourl}
            alt={community.displayname}
            w={50}
            style={{
              filter: isActive ? 'none' : 'grayscale(100%)',
            }}
          />
          {isActive ? <Checkbox checked={community.id === selectedCommunity?.id} /> : null}
        </Group>
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
              ...errorMsgVisible ? { error: " " } : {}
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
            style={isLoggedIn ? { display: "none" } : {}}
            {...errorMsgVisible ? { error: errorMsg } : {}}
          />
          <Button
            disabled={isLoggedIn ? true : false}
            fullWidth
            mt="xl"
            onClick={async () => {
              const err = await loginToSkool(skoolEmail, skoolPassword);
              if (err.errorMsg !== "") {
                setErrorMsg(err.errorMsg);
                setErrorMsgVisible(true);
              } else {
                setRefreshToggle(!refreshToggle);
              }
            }}
          >Connect Skool</Button>
        </Container>

        <Divider my="lg" />

        {selectedCommunity ?
          <>
            <Button
              fullWidth
              mt="md"
              onClick={async () => {
                await handleRefreshCommunities(refreshToggle, setRefreshToggle, setLoadingVisible);
              }}
            >Refresh Communities</Button>

            <Divider my="lg" />

            <Container p={10} mt={30} >
              <Paper shadow='xs' radius="md" p={20} withBorder>
                <Group mt={10} justify='space-around'>
                  <Image
                    src={selectedCommunity?.logourl}
                    alt={selectedCommunity?.displayname}
                    w={40}
                  />
                </Group>
                <Group mt={10} justify='space-around'>
                  <Title ta='center' mt={5}> {selectedCommunity?.displayname} </Title>
                </Group>
              </Paper>
              <Button
                fullWidth
                mt="xl"
                {...currentCommunity === selectedCommunity.id ? { disabled: true } : {}}
                onClick={() => {
                  handleSaveCommunity(selectedCommunity.id);
                  setRefreshToggle(!refreshToggle);
                }}>Save</Button>
            </Container>
          </>
          : <Title ta='center' size={25}>No Community Selected</Title>
        }
      </Paper>

      <div className={classes.grid_container}>
        <LoadingOverlay visible={loadingVisible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
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
