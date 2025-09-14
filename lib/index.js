/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, forwardRef} from 'react';
import {View, Text, TouchableOpacity, TextInput, Platform} from 'react-native';
import CountrySelect, {
  getAllCountries,
  getCountriesByName,
  getCountriesByCallingCode,
  getCountryByCca2,
} from 'react-native-country-select';
import parsePhoneNumber, {
  formatIncompletePhoneNumber,
  Metadata,
} from 'libphonenumber-js';

import getCountryByPhoneNumber from './utils/getCountryByPhoneNumber';
import isValidPhoneNumber from './utils/isValidPhoneNumber';
import {getPhoneNumberInputPlaceholder} from './utils/getPlaceholders';
import {
  getCaretStyle,
  getContainerStyle,
  getDividerStyle,
  getFlagContainerStyle,
  getFlagStyle,
  getFlagTextStyle,
  getInputStyle,
} from './utils/getStyles';

const PhoneInput = forwardRef(
  (
    {
      theme,
      language,
      placeholder,
      phoneInputPlaceholderTextColor,
      phoneInputSelectionColor,
      phoneInputStyles,
      modalStyles,
      disabled,
      modalDisabled,
      defaultCountry,
      defaultValue,
      value,
      onChangePhoneNumber,
      selectedCountry,
      onChangeSelectedCountry,
      customMask,
      visibleCountries,
      hiddenCountries,
      popularCountries,
      customCaret,
      rtl,
      isFullScreen = false,
      modalType = Platform.OS === 'web' ? 'popup' : 'bottomSheet',
      modalDragHandleIndicatorComponent,
      modalSearchInputPlaceholderTextColor,
      modalSearchInputPlaceholder,
      modalSearchInputSelectionColor,
      modalPopularCountriesTitle,
      modalAllCountriesTitle,
      modalSectionTitleComponent,
      modalCountryItemComponent,
      modalCloseButtonComponent,
      modalSectionTitleDisabled,
      modalNotFoundCountryMessage,
      disabledModalBackdropPress,
      removedModalBackdrop,
      onModalBackdropPress,
      onModalRequestClose,
      showModalSearchInput,
      showModalCloseButton,
      showModalScrollIndicator,
      ...rest
    },
    ref,
  ) => {
    const [show, setShow] = useState(false);
    const [defaultCca2, setDefaultCca2] = useState('');

    function onSelect(country) {
      setShow(false);
      onChangePhoneNumber('');
      onChangeSelectedCountry(country);
    }

    function formatPhoneNumberWithCustomMask(phoneNumber) {
      if (!customMask || !phoneNumber) {
        return phoneNumber;
      }

      const numbers = phoneNumber.replace(/\D/g, '');

      let result = '';
      let numberIndex = 0;

      for (
        let i = 0;
        i < customMask.length && numberIndex < numbers.length;
        i++
      ) {
        if (customMask[i] === '#') {
          result += numbers[numberIndex];
          numberIndex++;
        } else {
          result += customMask[i];
        }
      }

      onChangePhoneNumber(result);
    }

    function formatPhoneNumber(phoneNumber, callingCode) {
      let formattedNumber = '';

      const metadata = new Metadata();
      metadata.selectNumberingPlan(selectedCountry?.cca2);

      const possibleLengths = selectedCountry ? metadata.possibleLengths() : [];

      let validCallingCode = callingCode
        ? callingCode
        : selectedCountry?.idd?.root;

      const res = formatIncompletePhoneNumber(
        `${validCallingCode}${phoneNumber}`,
      );

      formattedNumber = res;

      if (res.startsWith(0)) {
        formattedNumber = parsePhoneNumber(res)?.formatNational();
      } else {
        if (validCallingCode && res && res.startsWith(validCallingCode)) {
          formattedNumber = res.substring(validCallingCode.length).trim();
        }
      }

      const possibleLength = formattedNumber.startsWith(0)
        ? possibleLengths.slice(-1)[0] + 1
        : possibleLengths.slice(-1)[0];

      if (formattedNumber?.replace(/\D/g, '')?.length > possibleLength) {
        return;
      }

      onChangePhoneNumber(formattedNumber);
    }

    function onChangeText(phoneNumber, callingCode) {
      if (phoneNumber.includes('+')) {
        const matchingCountry = getCountryByPhoneNumber(phoneNumber);

        if (matchingCountry) {
          setDefaultCca2(matchingCountry.cca2);

          onChangeSelectedCountry(matchingCountry);

          onChangeText(
            phoneNumber.replace(matchingCountry?.idd?.root, ''),
            null,
          );
        }

        return;
      }

      if (customMask) {
        return formatPhoneNumberWithCustomMask(phoneNumber);
      }
      formatPhoneNumber(phoneNumber, callingCode);
    }

    useEffect(() => {
      if (!selectedCountry && !defaultCountry) {
        const country = getCountryByCca2('BR');

        onChangeSelectedCountry(country);
      }
    }, []);

    useEffect(() => {
      if (defaultCountry) {
        onChangeSelectedCountry(getCountryByCca2(defaultCountry));
      }
    }, [defaultCountry]);

    useEffect(() => {
      if (defaultValue) {
        const matchingCountry = getCountryByPhoneNumber(defaultValue);

        if (matchingCountry) {
          setDefaultCca2(matchingCountry.cca2);

          onChangeSelectedCountry(matchingCountry);
        } else {
          setDefaultCca2(null);

          onChangeSelectedCountry(null);

          onChangeText('', null);

          console.warn(
            "The default number provided (defaultValue) don't match with anyone country. Please, correct it to be shown in the input. For more information: https://github.com/AstrOOnauta/react-native-international-phone-number#intermediate-usage---typescript--default-phone-number-value",
          );
        }
      }
    }, [defaultValue]);

    useEffect(() => {
      if (
        defaultValue &&
        selectedCountry &&
        selectedCountry.cca2 === defaultCca2 &&
        !value
      ) {
        const callingCode = selectedCountry?.idd?.root;

        let phoneNumber = defaultValue;

        onChangeText(phoneNumber, callingCode);
      }
    }, [selectedCountry]);

    // Create a separate constant for each part of the component
    const touchableStart = (
      <>
        <Text style={getFlagStyle(phoneInputStyles?.flag)}>
          {selectedCountry?.flag || selectedCountry?.cca2}
        </Text>
        {(customCaret && customCaret()) || (
          <View style={phoneInputStyles?.caret}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingTop: 4,
              }}>
              <View style={getCaretStyle(theme, phoneInputStyles?.caret)} />
            </View>
          </View>
        )}
      </>
    );

    const touchableMiddle = (
      <View style={getDividerStyle(theme, phoneInputStyles?.divider)} />
    );

    const touchableEnd = (
      <Text style={getFlagTextStyle(theme, phoneInputStyles?.callingCode)}>
        {selectedCountry?.idd?.root}
      </Text>
    );

    const touchablePart = (
      <TouchableOpacity
        testID="countryPickerFlagContainerButton"
        accessibillityRole="button"
        accessibilityLabel="Countries button"
        accessibilityHint="Click to open the countries modal"
        activeOpacity={disabled || modalDisabled ? 1 : 0.6}
        onPress={() => (disabled || modalDisabled ? null : setShow(true))}
        style={getFlagContainerStyle(theme, phoneInputStyles?.flagContainer)}>
        {/* LTR Display */}
        {!rtl && touchableStart}
        {!rtl && touchableMiddle}
        {!rtl && touchableEnd}

        {/* RTL Display */}
        {rtl && touchableEnd}
        {rtl && touchableMiddle}
        {rtl && touchableStart}
      </TouchableOpacity>
    );

    const inputPart = (
      <TextInput
        style={getInputStyle(theme, phoneInputStyles?.input)}
        placeholder={
          placeholder === '' || placeholder
            ? placeholder
            : getPhoneNumberInputPlaceholder(language || 'en')
        }
        placeholderTextColor={
          phoneInputPlaceholderTextColor ||
          (theme === 'dark' ? '#CCCCCC' : '#AAAAAA')
        }
        selectionColor={
          phoneInputSelectionColor ||
          (theme === 'dark' ? 'rgba(255,255,255, .4)' : 'rgba(0 ,0 ,0 , .4)')
        }
        editable={!disabled}
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        ref={ref}
        testID="countryPickerPhoneInput"
        accessibillityRole="input"
        accessibilityLabel="Phone Number input"
        accessibilityHint="Write the phone number"
        {...rest}
      />
    );

    return (
      <>
        <View
          style={getContainerStyle(
            theme,
            phoneInputStyles?.container,
            disabled,
          )}>
          {/* LTR Display */}
          {!rtl && touchablePart}
          {!rtl && inputPart}

          {/* RTL Display */}
          {rtl && inputPart}
          {rtl && touchablePart}
        </View>
        {!disabled && !modalDisabled && show ? (
          <>
            <CountrySelect
              visible={show}
              onClose={() => setShow(false)}
              onSelect={onSelect}
              theme={theme}
              language={language}
              searchPlaceholder={modalSearchInputPlaceholder}
              searchPlaceholderTextColor={
                modalSearchInputPlaceholderTextColor
              }
              hiddenCountries={
                hiddenCountries
                  ? ['HM', 'AQ', ...hiddenCountries]
                  : ['HM', 'AQ']
              }
              visibleCountries={visibleCountries}
              popularCountries={popularCountries}
              onBackdropPress={() => onModalBackdropPress || setShow(false)}
              onRequestClose={() => onModalRequestClose || setShow(false)}
              countrySelectStyle={modalStyles}
              isFullScreen={isFullScreen}
              modalType={modalType}
              allCountriesTitle={modalAllCountriesTitle}
              popularCountriesTitle={modalPopularCountriesTitle}
              sectionTitleComponent={
                modalSectionTitleDisabled
                  ? () => ''
                  : modalSectionTitleComponent
              }
              countryItemComponent={modalCountryItemComponent}
              modalDragHandleIndicatorComponent={
                modalDragHandleIndicatorComponent
              }
              showCloseButton={showModalCloseButton}
              closeButtonComponent={modalCloseButtonComponent}
              disabledBackdropPress={disabledModalBackdropPress}
              removedBackdrop={removedModalBackdrop}
              showSearchInput={showModalSearchInput}
              countryNotFoundMessage={modalNotFoundCountryMessage}
            />
          </>
        ) : null}
      </>
    );
  },
);

export default PhoneInput;

export {
  getAllCountries,
  getCountryByPhoneNumber,
  getCountryByCca2,
  getCountriesByCallingCode,
  getCountriesByName,
  isValidPhoneNumber,
};
