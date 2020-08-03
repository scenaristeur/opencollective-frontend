import React from 'react';
import PropTypes from 'prop-types';
import css from '@styled-system/css';
import { isNil } from 'lodash';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { formatCurrency, getCurrencySymbol } from '../lib/currency-utils';

import Container from './Container';
import Currency from './Currency';
import { Flex } from './Grid';
import StyledButtonSet from './StyledButtonSet';
import StyledInputAmount from './StyledInputAmount';
import StyledInputField from './StyledInputField';

const getButtonDisplay = (index, presets) => {
  if (index === 0 || index === presets.length - 1 || index < 2) {
    // Ensure first and last values are always displayed
    return 'block';
  } else if (index < 4) {
    // Limit to 3 on small screens
    return ['none', null, 'block'];
  } else {
    // Never show more than 5 options
    return 'none';
  }
};

const FONT_SIZES = ['15px', null, '20px'];
const LINE_HEIGHTS = ['23px', null, '26px'];

const ButtonText = styled.span(props =>
  css({
    fontSize: FONT_SIZES,
    lineHeight: LINE_HEIGHTS,
    fontWeight: props.isSelected ? ['normal', null, 'bold'] : ['normal', null, '300'],
  }),
);

/**
 * A money amount picker that shows a button set to pick between presets.
 */
const StyledAmountPicker = ({ presets, currency, min, value, onChange }) => {
  const [isOtherSelected, setOtherSelected] = React.useState(() => !isNil(value) && !presets?.includes(value));
  const hasPresets = presets?.length > 0;

  React.useEffect(() => {
    if (value && !presets?.includes(value) && !isOtherSelected) {
      setOtherSelected(true);
    }
  }, [presets, value, isOtherSelected]);

  return (
    <div>
      <Flex>
        {hasPresets && (
          <StyledInputField
            htmlFor="amount"
            css={{ flexGrow: 1 }}
            labelFontSize="20px"
            labelColor="black.700"
            labelProps={{ fontWeight: 500, lineHeight: '28px', mb: 1 }}
            label={
              <FormattedMessage
                id="contribution.amount.currency.label"
                defaultMessage="Amount ({currency})"
                values={{ currency: `${getCurrencySymbol(currency)}${currency}` }}
              />
            }
          >
            {fieldProps => (
              <StyledButtonSet
                {...fieldProps}
                justifyContent="center"
                items={presets}
                buttonProps={{ p: 2 }}
                selected={isOtherSelected ? null : value}
                buttonPropsBuilder={({ index }) => ({ display: getButtonDisplay(index, presets) })}
                onChange={value => {
                  onChange(value);
                  setOtherSelected(false);
                }}
              >
                {({ item, isSelected }) =>
                  item === 0 ? (
                    <ButtonText isSelected={isSelected}>
                      <FormattedMessage id="Amount.Free" defaultMessage="Free" />
                    </ButtonText>
                  ) : (
                    <ButtonText isSelected={isSelected}>
                      <Currency value={item} currency={currency} precision="auto" />
                    </ButtonText>
                  )
                }
              </StyledButtonSet>
            )}
          </StyledInputField>
        )}
        <Container minWidth={75} maxWidth={125} ml="-3px" height="100%">
          <StyledInputField
            htmlFor="custom-amount"
            labelColor="black.600"
            labelFontSize="14px"
            labelProps={{ mb: 1, pt: '13px' }}
            label={
              hasPresets ? (
                <FormattedMessage id="contribution.amount.other.label" defaultMessage="Other" />
              ) : (
                <FormattedMessage
                  id="contribution.amount.currency.label"
                  defaultMessage="Amount ({currency})"
                  values={{ currency: `${getCurrencySymbol(currency)}${currency}` }}
                />
              )
            }
          >
            {fieldProps => (
              <StyledInputAmount
                {...fieldProps}
                type="number"
                currency={currency}
                value={value || null}
                isEmpty={!isOtherSelected}
                placeholder="---"
                width={1}
                fontSize={FONT_SIZES}
                lineHeight={LINE_HEIGHTS}
                px="2px"
                min={min}
                containerProps={{
                  borderRadius: hasPresets ? '0 4px 4px 0' : '4px',
                }}
                prependProps={{
                  pr: 1,
                  bg: '#FFFFFF',
                  fontSize: FONT_SIZES,
                  lineHeight: LINE_HEIGHTS,
                  color: isOtherSelected ? 'black.800' : 'black.400',
                }}
                onChange={value => {
                  onChange(value);
                  setOtherSelected(true);
                }}
                onBlur={() => setOtherSelected(!presets?.includes(value))}
              />
            )}
          </StyledInputField>
        </Container>
      </Flex>
      {Boolean(min) && (
        <Flex fontSize="Caption" color="black.500" flexDirection="column" alignItems="flex-end" mt={1}>
          <FormattedMessage
            id="contribuion.minimumAmount"
            defaultMessage="Minimum amount: {minAmount} {currency}"
            values={{ minAmount: formatCurrency(min, currency), currency: currency }}
          />
        </Flex>
      )}
    </div>
  );
};

StyledAmountPicker.propTypes = {
  currency: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  min: PropTypes.number,
  onChange: PropTypes.func,
  presets: PropTypes.arrayOf(PropTypes.number),
};

export default StyledAmountPicker;
