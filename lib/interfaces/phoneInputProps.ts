import {Ref, ReactNode} from 'react';
import {TextInput, TextInputProps} from 'react-native';
import {
  ICountry,
  ICountryCca2,
  ICountrySelectLanguages,
  ICountrySelectStyle,
} from 'react-native-country-select';

import {ITheme} from './theme';
import {IPhoneInputStyles} from './phoneInputStyles';

interface IPhoneInputProps extends TextInputProps {
  value: string;
  onChangePhoneNumber: (phoneNumber: string) => void;
  selectedCountry: ICountry | undefined | null;
  onChangeSelectedCountry: (country: ICountry) => void;
  theme?: ITheme;
  language?: ICountrySelectLanguages;
  placeholder?: string;
  phoneInputPlaceholderTextColor?: string;
  phoneInputSelectionColor?: string;
  phoneInputStyles?: IPhoneInputStyles;
  modalStyles?: ICountrySelectStyle;
  disabled?: boolean;
  modalDisabled?: boolean;
  defaultCountry?: ICountryCca2;
  defaultValue?: string;
  customMask?: string;
  visibleCountries?: Array<ICountryCca2>;
  hiddenCountries?: Array<ICountryCca2>;
  popularCountries?: Array<ICountryCca2>;
  customCaret?: () => ReactNode;
  rtl?: boolean;
  isFullScreen?: boolean;
  modalType?: 'bottomSheet' | 'popup';
  modalDragHandleIndicatorComponent?: () => ReactNode;
  modalSearchInputPlaceholderTextColor?: string;
  modalSearchInputPlaceholder?: string;
  modalSearchInputSelectionColor?: string;
  modalPopularCountriesTitle?: string;
  modalAllCountriesTitle?: string;
  modalSectionTitleComponent?: () => ReactNode;
  modalCountryItemComponent?: () => ReactNode;
  modalCloseButtonComponent?: () => ReactNode;
  modalSectionTitleDisabled?: boolean;
  modalNotFoundCountryMessage?: string;
  disabledModalBackdropPress?: boolean;
  removedModalBackdrop?: boolean;
  onModalBackdropPress?: () => void;
  onModalRequestClose?: () => void;
  showModalSearchInput?: boolean;
  showModalCloseButton?: boolean;
  showModalScrollIndicator?: boolean;
  ref: Ref<TextInput>;
}

export type PhoneInputProps = IPhoneInputProps;
