import analytics from '@segment/analytics-react-native';
import {
  get,
  indexOf,
  isFunction,
  map,
  property,
  sortBy,
  upperFirst,
} from 'lodash';
import { GasPrices, GasSpeedOption, TxFees } from '@rainbow-me/entities';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

const GasSpeedOrder: GasSpeedOption[] = [
  GasSpeedOption.SLOW,
  GasSpeedOption.NORMAL,
  GasSpeedOption.FAST,
  GasSpeedOption.CUSTOM,
];

interface GasSpeedItem {
  gweiValue: string;
  label: string;
  speed: GasSpeedOption;
}

const showTransactionSpeedOptions = (
  gasPrices: GasPrices,
  txFees: TxFees,
  updateGasOption: (arg0: GasSpeedOption) => void,
  onSuccess: () => void,
  hideCustom = false
) => {
  const options = [
    ...formatGasSpeedItems(gasPrices, txFees, hideCustom),
    { label: 'Cancel' },
  ];
  const cancelButtonIndex = options.length - 1;

  showActionSheetWithOptions(
    {
      cancelButtonIndex,
      options: options.map(property('label')),
    },
    (buttonIndex: number) => {
      if (buttonIndex !== undefined && buttonIndex !== cancelButtonIndex) {
        const selectedGasPriceItem = options[buttonIndex] as GasSpeedItem;
        updateGasOption(selectedGasPriceItem.speed);
        analytics.track('Updated Gas Price', {
          gasPrice: selectedGasPriceItem.gweiValue,
        });

        if (isFunction(onSuccess)) {
          onSuccess();
        }
      }
    }
  );
};

const formatGasSpeedItems = (
  gasPrices: GasPrices,
  txFees: TxFees,
  hideCustom = false
): GasSpeedItem[] => {
  let allSpeeds = GasSpeedOrder;
  if (hideCustom) {
    allSpeeds = allSpeeds.filter(speed => speed !== GasSpeedOption.CUSTOM);
  }
  const gasItems = map(allSpeeds, speed => {
    const cost = txFees?.[speed]?.native?.value?.display;
    const gwei = get(gasPrices, `[${speed}].value.display`);
    const time = gasPrices?.[speed]?.estimatedTime?.display;

    return {
      gweiValue: gwei,
      label: `${upperFirst(speed)}: ${cost}   ~${time}`,
      speed,
    };
  });
  return sortBy(gasItems, ({ speed }) => indexOf(GasSpeedOrder, speed));
};

export default {
  GasSpeedOrder,
  showTransactionSpeedOptions,
};
