import { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import type { TournamentRequest } from '@/types/tournament';
import { styles } from '../styles';

interface PendingRequestsProps {
  requests: TournamentRequest[];
  isLoading: boolean;
  /** The parent calls the mutation and invokes `onSettled` when it resolves. */
  onRespond: (
    requestId: string,
    status: 'accepted' | 'rejected',
    onSettled: () => void,
  ) => void;
}

export const PendingRequests = ({
  requests,
  isLoading,
  onRespond,
}: PendingRequestsProps) => {
  const { t } = useTranslation('tournaments');
  const { tk } = useTheme();
  const [respondingTo, setRespondingTo] = useState<
    Record<string, 'accepted' | 'rejected'>
  >({});

  const joinRequests = requests.filter(r => r.direction === 'request');

  const handleRespond = (requestId: string, status: 'accepted' | 'rejected') => {
    setRespondingTo(prev => ({ ...prev, [requestId]: status }));
    onRespond(requestId, status, () => {
      setRespondingTo(prev => {
        const next = { ...prev };
        delete next[requestId];
        return next;
      });
    });
  };

  if (!isLoading && joinRequests.length === 0) return null;

  return (
    <View
      style={[
        styles.requestsSection,
        { borderColor: tk.border.default },
      ]}
    >
      <Text style={[styles.requestsHeader, { color: tk.text.muted }]}>
        {t('detail.requests.title')}
        {joinRequests.length > 0 && (
          <Text style={{ color: tk.primary[400] }}>
            {' '}({joinRequests.length})
          </Text>
        )}
      </Text>

      {isLoading ? (
        <ActivityIndicator
          size='small'
          color={tk.primary[400]}
          style={{ marginVertical: 12 }}
        />
      ) : joinRequests.length === 0 ? (
        <Text style={[styles.requestsEmpty, { color: tk.text.muted }]}>
          {t('detail.requests.empty')}
        </Text>
      ) : (
        joinRequests.map(req => (
          <View
            key={req.id}
            style={[
              styles.requestRow,
              { borderBottomColor: tk.border.subtle },
            ]}
          >
            <View
              style={[
                styles.reqAvatar,
                { backgroundColor: tk.surface.overlay },
              ]}
            >
              <Text style={[styles.reqAvatarText, { color: tk.primary[400] }]}>
                {(req.profile.displayName || req.profile.username)[0]?.toUpperCase()}
              </Text>
            </View>
            <View style={styles.reqInfo}>
              <Text style={[styles.reqName, { color: tk.text.primary }]}>
                {req.profile.displayName || req.profile.username}
              </Text>
              <Text style={[styles.reqType, { color: tk.text.muted }]}>
                {t('detail.requests.joinRequest')}
              </Text>
            </View>
            <View style={styles.reqActions}>
              {respondingTo[req.id] ? (
                <ActivityIndicator
                  size='small'
                  color={tk.primary[400]}
                  style={styles.reqLoadingIndicator}
                />
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => handleRespond(req.id, 'accepted')}
                    style={[
                      styles.reqAccept,
                      { backgroundColor: tk.primary[500] },
                    ]}
                  >
                    <Text
                      style={[
                        styles.reqActionText,
                        { color: tk.surface.default },
                      ]}
                    >
                      {t('detail.requests.accept')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleRespond(req.id, 'rejected')}
                    style={[
                      styles.reqReject,
                      { borderColor: tk.error.border },
                    ]}
                  >
                    <Text
                      style={[
                        styles.reqActionText,
                        { color: tk.error.text },
                      ]}
                    >
                      {t('detail.requests.reject')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );
};
