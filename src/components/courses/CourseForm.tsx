import { IconPlus, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Course } from '../../types/course';

interface CourseFormProps {
  initialValues?: Course;
  onSubmit: (values: Partial<Course>) => void;
  isLoading?: boolean;
}

export function CourseForm({ initialValues, onSubmit, isLoading }: CourseFormProps) {
  const form = useForm({
    initialValues: initialValues || {
      code: '',
      name: '',
      description: '',
      credits: 3,
      instructor: '',
      semester: '',
      capacity: 30,
      status: 'active' as const,
      schedule: [{ day: '', start_time: '', end_time: '' }],
    },
    validate: {
      code: (value) => (!value ? 'Course code is required' : null),
      name: (value) => (!value ? 'Course name is required' : null),
      credits: (value) => (value < 1 ? 'Credits must be at least 1' : null),
      capacity: (value) => (value < 1 ? 'Capacity must be at least 1' : null),
      schedule: {
        day: (value) => (!value ? 'Day is required' : null),
        start_time: (value) => (!value ? 'Start time is required' : null),
        end_time: (value) => (!value ? 'End time is required' : null),
      },
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    onSubmit({
      ...values,
      status: values.status as 'active' | 'inactive' | 'completed',
    });
  });

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack gap="md">
        <Group grow>
          <TextInput
            label="Course Code"
            placeholder="e.g., CS101"
            {...form.getInputProps('code')}
            required
          />
          <TextInput
            label="Course Name"
            placeholder="e.g., Introduction to Programming"
            {...form.getInputProps('name')}
            required
          />
        </Group>

        <Textarea
          label="Description"
          placeholder="Course description"
          {...form.getInputProps('description')}
          minRows={3}
        />

        <Group grow>
          <NumberInput
            label="Credits"
            {...form.getInputProps('credits')}
            min={1}
            max={6}
            required
          />
          <TextInput
            label="Instructor"
            placeholder="e.g., Dr. Smith"
            {...form.getInputProps('instructor')}
            required
          />
        </Group>

        <Group grow>
          <TextInput
            label="Semester"
            placeholder="e.g., Fall 2023"
            {...form.getInputProps('semester')}
            required
          />
          <NumberInput label="Capacity" {...form.getInputProps('capacity')} min={1} required />
        </Group>

        <Select
          label="Status"
          {...form.getInputProps('status')}
          data={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'completed', label: 'Completed' },
          ]}
          required
        />

        <Stack gap="xs">
          <Group justify="space-between">
            <Box component="label" fw={500} fz="sm">
              Schedule
            </Box>
            <Button
              size="xs"
              leftSection={<IconPlus size={16} />}
              variant="light"
              onClick={() => {
                form.insertListItem('schedule', { day: '', start_time: '', end_time: '' });
              }}
            >
              Add Time Slot
            </Button>
          </Group>

          {form.values.schedule.map((_, index) => (
            <Group key={index} grow>
              <Select
                placeholder="Day"
                {...form.getInputProps(`schedule.${index}.day`)}
                data={[
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ]}
              />
              <TimeInput
                type="time"
                placeholder="Start Time"
                {...form.getInputProps(`schedule.${index}.start_time`)}
                withSeconds
                required
              />
              <TimeInput
                type="time"
                placeholder="End Time"
                {...form.getInputProps(`schedule.${index}.end_time`)}
                withSeconds
                required
              />
              <ActionIcon
                color="red"
                onClick={() => form.removeListItem('schedule', index)}
                disabled={form.values.schedule.length === 1}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={isLoading}>
            {initialValues ? 'Update Course' : 'Create Course'}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
