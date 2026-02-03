import { HStack, Input, Button, FormControl, FormLabel, Box } from '@chakra-ui/react';
import { FiFilter, FiX } from 'react-icons/fi';

function AttendanceFilter({ filters, onFilterChange, onClear }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const hasFilters = filters.startDate || filters.endDate;

  return (
    <Box p={4} bg="white" borderRadius="lg" boxShadow="sm" mb={4}>
      <HStack spacing={4} flexWrap="wrap">
        <FormControl maxW="200px">
          <FormLabel fontSize="sm" mb={1}>
            Start Date
          </FormLabel>
          <Input
            name="startDate"
            type="date"
            size="sm"
            value={filters.startDate || ''}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl maxW="200px">
          <FormLabel fontSize="sm" mb={1}>
            End Date
          </FormLabel>
          <Input
            name="endDate"
            type="date"
            size="sm"
            value={filters.endDate || ''}
            onChange={handleChange}
          />
        </FormControl>

        {hasFilters && (
          <Button
            leftIcon={<FiX />}
            size="sm"
            variant="ghost"
            colorScheme="gray"
            onClick={onClear}
            alignSelf="flex-end"
            mb={1}
          >
            Clear Filters
          </Button>
        )}
      </HStack>
    </Box>
  );
}

export default AttendanceFilter;
