import {PropsWithChildren, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {styles} from './styles';

type SectionProps = PropsWithChildren<{
  title: string;
  collapsible?: boolean;
}>;

export function Section({
  children,
  title,
  collapsible,
}: SectionProps): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View style={styles.sectionContainer}>
      {collapsible ? (
        <TouchableOpacity
          onPress={() => {
            setCollapsed(!collapsed);
          }}>
          <Text style={styles.sectionTitle}>
            {title} {collapsed ? '→' : '↓'}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.sectionTitle}>{title}</Text>
      )}
      {!collapsible || !collapsed ? (
        <Text style={[styles.sectionDescription]}>{children}</Text>
      ) : null}
    </View>
  );
}
