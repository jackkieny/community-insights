import { useEffect, useState } from 'react';
import { ComboboxItem, Select } from "@mantine/core";

interface PostFormInputSelectorProps {
  label: ComboboxItem | null;
  setLabel: (value: ComboboxItem | null) => void;
}

export function LabelSelector({ label, setLabel }: PostFormInputSelectorProps) {
  const [labels, setLabels] = useState<ComboboxItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/getlabels', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      const formattedLabels = data.labels.map((label: { ID: string, DisplayName: string }) => ({
        value: label.ID,
        label: label.DisplayName
      }));
      setLabels(formattedLabels);
    };
    fetchData();
  }, []);

  return (
    <Select 
      label="Select Category"
      required
      placeholder='Discussion, Questions, etc.'
      data={labels}
      value={label ? label.value : null}
      onChange={(value) => {
        const selectedLabel = labels.find((item) => item.value === value) || null;
        setLabel(selectedLabel);
      }}
      w="auto"
      allowDeselect={false}
    />
  );
}