import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import { mountWithRouter } from '../../../test/lib/render-helpers';
import ImportToken from './import-token.container';

describe('Import Token', () => {
  let wrapper;

  const state = {
    metamask: {
      tokens: [],
    },
  };

  const store = configureMockStore()(state);

  const props = {
    history: {
      push: sinon.stub().callsFake(() => undefined),
    },
    setPendingTokens: sinon.spy(),
    clearPendingTokens: sinon.spy(),
    tokens: [],
    identities: {},
    mostRecentOverviewPage: '/',
    showSearchTab: true,
    tokenList: {},
  };

  describe('Import Token', () => {
    beforeAll(() => {
      wrapper = mountWithRouter(
        <Provider store={store}>
          <ImportToken.WrappedComponent {...props} />
        </Provider>,
        store,
      );

      wrapper.find({ name: 'customToken' }).simulate('click');
    });

    afterEach(() => {
      props.history.push.reset();
    });

    it('next button is disabled when no fields are populated', () => {
      const nextButton = wrapper.find(
        '.button.btn-primary.page-container__footer-button',
      );

      expect(nextButton.props().disabled).toStrictEqual(true);
    });

    it('edits token address', () => {
      const tokenAddress = '0x617b3f8050a0BD94b6b1da02B4384eE5B4DF13F4';
      const event = { target: { value: tokenAddress } };
      const customAddress = wrapper.find('input#custom-address');

      customAddress.simulate('change', event);
      expect(
        wrapper.find('ImportToken').instance().state.customAddress,
      ).toStrictEqual(tokenAddress);
    });

    it('edits token symbol', () => {
      const tokenSymbol = 'META';
      const event = { target: { value: tokenSymbol } };
      const customAddress = wrapper.find('#custom-symbol');
      customAddress.last().simulate('change', event);

      expect(
        wrapper.find('ImportToken').instance().state.customSymbol,
      ).toStrictEqual(tokenSymbol);
    });

    it('edits token decimal precision', () => {
      const tokenPrecision = '2';
      const event = { target: { value: tokenPrecision } };
      const customAddress = wrapper.find('#custom-decimals');
      customAddress.last().simulate('change', event);

      expect(
        wrapper.find('ImportToken').instance().state.customDecimals,
      ).toStrictEqual(Number(tokenPrecision));
    });

    it('next', () => {
      const nextButton = wrapper.find(
        '.button.btn-primary.page-container__footer-button',
      );
      nextButton.simulate('click');

      expect(props.setPendingTokens.calledOnce).toStrictEqual(true);
      expect(props.history.push.calledOnce).toStrictEqual(true);
      expect(props.history.push.getCall(0).args[0]).toStrictEqual(
        '/confirm-import-token',
      );
    });

    it('cancels', () => {
      const cancelButton = wrapper.find('.page-container__header-close');
      cancelButton.simulate('click');

      expect(props.clearPendingTokens.calledOnce).toStrictEqual(true);
      expect(props.history.push.getCall(0).args[0]).toStrictEqual('/');
    });
  });
});
