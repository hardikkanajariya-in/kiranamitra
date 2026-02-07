import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';
import LogoFullSvg from '@assets/logo/logo-full.svg';
import LogoIconSvg from '@assets/logo/logo-icon.svg';

interface LogoProps extends Omit<SvgProps, 'width' | 'height'> {
  /** Width of the logo. Height is auto-calculated to preserve aspect ratio. */
  size?: number;
  /** Use icon-only variant (no text). Defaults to false (full logo with text). */
  iconOnly?: boolean;
}

/**
 * KiranaMitra Logo component.
 *
 * Usage:
 *   <Logo size={200} />              // Full logo with text
 *   <Logo size={80} iconOnly />      // Icon only (no text)
 */
export const Logo: React.FC<LogoProps> = ({
  size = 160,
  iconOnly = false,
  ...svgProps
}) => {
  const SvgComponent = iconOnly ? LogoIconSvg : LogoFullSvg;

  return (
    <View style={styles.container}>
      <SvgComponent
        width={size}
        height={size}
        {...svgProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
