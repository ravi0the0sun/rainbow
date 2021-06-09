import { has } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { Emoji } from '../text';
import { GasSpeedOptions } from '@rainbow-me/entities';
import { magicMemo } from '@rainbow-me/utils';

const EmojiForGasSpeedType = {
  [GasSpeedOptions.FAST]: {
    emoji: 'rocket', // 🚀️
    position: [0.5, 0], // (x, y)
  },
  [GasSpeedOptions.NORMAL]: {
    emoji: 'stopwatch', // ⏱️
    position: [1, -1], // (x, y)
  },
  [GasSpeedOptions.SLOW]: {
    emoji: 'snail', // 🐌️
    position: [0, -2], // (x, y)
  },
  [GasSpeedOptions.CUSTOM]: {
    emoji: 'gear', // ⚙️
    position: [1, -0.25], // (x, y)
  },
};

const Container = styled.View`
  height: ${({ height }) => height};
  width: 25;
`;

const GasEmoji = styled(Emoji).attrs({
  lineHeight: 'loosest',
  size: 'medium',
})`
  left: ${({ left }) => left};
  position: absolute;
  top: ${({ top }) => top};
`;

const GasSpeedEmoji = ({ containerHeight, label }) => {
  const gasSpeed = has(EmojiForGasSpeedType, label)
    ? EmojiForGasSpeedType[label]
    : EmojiForGasSpeedType[GasSpeedOptions.NORMAL];

  return (
    <Container height={containerHeight}>
      <GasEmoji
        left={gasSpeed.position[0]}
        name={gasSpeed.emoji}
        top={gasSpeed.position[1]}
      />
    </Container>
  );
};

export default magicMemo(GasSpeedEmoji, 'label');
