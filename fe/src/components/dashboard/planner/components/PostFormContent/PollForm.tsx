import { Button, CloseButton, Flex, Grid, Group, Input } from "@mantine/core";
import { useState } from "react";

export function PollForm() {
  const [pollOptions, setPollOptions] = useState<string[]>(["", "", ""]);
  const [numOfPollOptions, setNumOfPollOptions] = useState(3);

  const handleRemoveOption = (index: number) => {
    setPollOptions(pollOptions.filter((_, i) => i !== index));
    setNumOfPollOptions(numOfPollOptions - 1);
  };

  const renderPollOptions = () => {
    return pollOptions.map((option, i) => (
      <Grid.Col span={1} key={i}>
        <Input
          value={option}
          onChange={(e) => {
            const newOptions = [...pollOptions];
            newOptions[i] = e.target.value;
            setPollOptions(newOptions);
          }}
          title={`Option ${i + 1}`}
          placeholder={`Option ${i + 1}`}
          {...(numOfPollOptions > 2 ? {
            rightSectionPointerEvents: "all",
            rightSection: <CloseButton onClick={() => {handleRemoveOption(i); console.log(i)}} />
          } : {})}
        />
      </Grid.Col>
    ));
  };

  return (
    <Flex direction="column" w="90%">
      <Grid columns={2}>
        {renderPollOptions()}
      </Grid>
      <Group justify="space-between" mt={20}>
        <Button
          disabled={numOfPollOptions >= 10}
          onClick={() => {
            setPollOptions([...pollOptions, ""]);
            setNumOfPollOptions(numOfPollOptions + 1);
          }}
        >
          Add Option
        </Button>
      </Group>
    </Flex>
  );
}
