import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function RequestNotification() {
  const { t } = useTranslation();
  return <Typography textAlign="center"> {t('notification.allowPrompt')}</Typography>;
}
