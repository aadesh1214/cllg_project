import { Box, VStack, Icon, Text, Button } from '@chakra-ui/react';
import { FiInbox, FiUsers, FiCalendar, FiPlus } from 'react-icons/fi';

const icons = {
  default: FiInbox,
  employees: FiUsers,
  attendance: FiCalendar,
};

function EmptyState({
  icon = 'default',
  title = 'No data found',
  description = 'There are no items to display.',
  actionLabel,
  onAction,
}) {
  const IconComponent = icons[icon] || icons.default;

  return (
    <Box py={12} px={6} textAlign="center">
      <VStack spacing={4}>
        <Box
          p={4}
          bg="gray.100"
          borderRadius="full"
          color="gray.400"
        >
          <Icon as={IconComponent} boxSize={10} />
        </Box>
        <VStack spacing={1}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.500" maxW="300px">
            {description}
          </Text>
        </VStack>
        {actionLabel && onAction && (
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            size="sm"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </VStack>
    </Box>
  );
}

export default EmptyState;
