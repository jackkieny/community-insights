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
import { checkIfLoggedIn, loginToSkool } from './handler';

const mockdata = [
  {
    archived: false,
    role: "group-admin",
    id: "fd0a318aff324d5cbdd709e8d6c28927",
    name: "savvy-savings-7765",
    display_name: "Savvy Savings",
    totalmembers: 1,
    totalposts: 38,
    logourl: "",
    color: "#21B8A6"
  },
  {
    archived: false,
    role: "group-admin",
    id: "fd0a318aff324d5cbdd709e8d6c28927",
    name: "savvy-savings-7765",
    display_name: "Savvy Savings",
    totalmembers: 1,
    totalposts: 38,
    logourl: "",
    color: "#21B8A6"
  },
  {
    archived: false,
    role: "group-admin",
    id: "fd0a318aff324d5cbdd709e8d6c28927",
    name: "savvy-savings-7765",
    display_name: "Savvy Savings",
    totalmembers: 1,
    totalposts: 38,
    logourl: "",
    color: "#21B8A6"
  },
  {
    archived: false,
    role: "group-admin",
    id: "fd0a318aff324d5cbdd709e8d6c28927",
    name: "savvy-savings-7765",
    display_name: "Savvy Savings",
    totalmembers: 1,
    totalposts: 38,
    logourl: "",
    color: "#21B8A6"
  },
  {
    archived: false,
    role: "group-admin",
    id: "fd0a318aff324d5cbdd709e8d6c28927",
    name: "savvy-savings-7765",
    display_name: "Savvy Savings",
    totalmembers: 1,
    totalposts: 38,
    logourl: "",
    color: "#21B8A6"
  },
  {
    archived: false,
    role: "group-admin",
    id: "fd0a318aff324d5cbdd709e8d6c28927",
    name: "savvy-savings-7765",
    display_name: "Savvy Savings",
    totalmembers: 1,
    totalposts: 38,
    logourl: "",
    color: "#21B8A6"
  },
  {
    archived: false,
    role: "group-admin",
    id: "fd0a318aff324d5cbdd709e8d6c28927",
    name: "savvy-savings-7765",
    display_name: "Savvy Savings",
    totalmembers: 1,
    totalposts: 38,
    logourl: "",
    color: "#21B8A6"
  },
  {
    archived: false,
    role: "member",
    id: "e4452",
    name: "community",
    display_name: "Skool Community",
    totalmembers: 169449,
    totalposts: 28514,
    logourl: "https://assets.skool.com/f/-/1d8b1123248347ddb42dfd1293b27c18df01da30aa414a678a2f1d312832a785/icon.jpg",
    color: "#FCB900"
  },
  {
    archived: false,
    role: "pending",
    id: "5512a2",
    name: "topchessgang",
    display_name: "Top Chess Gang",
    totalmembers: 9631,
    totalposts: 10149,
    logourl: "https://assets.skool.com/f/5512a2e71b1649149136ea51bef78b0c/2ed12b54e87f421996b14977684de25dbfd2eb3da7244f6395e2cf4b52ff4345",
    color: "#739250"
  }
]

interface CommunityType {
  archived: boolean;
  role: string;
  id: string;
  name: string;
  display_name: string;
  totalmembers: number;
  totalposts: number;
  logourl: string;
  color: string;
}

export function Community() {

  // TODO: useEffect to check if the has already logged in
  // TODO: If logged in, lock the login form
  // TODO: If not, display nothing on the right side
  // TODO: Add a refresh button to allow the user to refresh the communities
  // TODO: When the refresh is happening, display a loadingoverlay
  // TODO: Add a display to show the current community the user is logged in to
  //       Make the user confirm the community selection

  const [refreshToggle, setRefreshToggle] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [skoolEmail, setSkoolEmail] = useState('');
  const [skoolPassword, setSkoolPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errorMsgVisible, setErrorMsgVisible] = useState(false);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    checkIfLoggedIn().then(resp => {
      if (resp.loggedIn) {
        setIsLoggedIn(true);
        setSkoolEmail(resp.userEmail);
      } else {
        setIsLoggedIn(false);
      }
      setVisible(false);
    });
  }, [refreshToggle])

  const availableCommunities = mockdata.filter(community => !community.archived && community.role === 'group-admin');
  const unavailableCommunities = mockdata.filter(community => community.archived || community.role !== 'group-admin');


  const renderCard = (community: CommunityType, isActive: boolean) => {
    return (
      <Card
        key={community.id}
        title={community.display_name}
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
          alt={community.display_name}
          w={50}
          style={{ filter: isActive ? 'none' : 'grayscale(100%)' }}
        />
        <Title mt={10} ta="left" order={3}> {community.display_name} </Title>
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
              const err = await loginToSkool(skoolEmail, skoolPassword, errorMsg);
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